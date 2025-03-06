
-- Enable the PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Ensure the transactions table includes location data
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);

-- Add anomaly detection column for suspicious transactions
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS anomaly BOOLEAN DEFAULT FALSE;

-- Add risk score column for transaction risk assessment
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS risk_score NUMERIC DEFAULT 0;

-- Add sample data with geolocation
INSERT INTO transactions (
  merchant_id, 
  amount, 
  ip_address,
  location, 
  currency, 
  status, 
  payment_method, 
  customer_email, 
  risk_score,
  anomaly
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000', 
    100.00, 
    '192.168.1.1'::inet,
    ST_GeogFromText('SRID=4326;POINT(-77.0364 38.8951)'), 
    'USD', 
    'completed', 
    'credit_card', 
    'customer1@example.com',
    5,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    150.75, 
    '192.168.1.2'::inet,
    ST_GeogFromText('SRID=4326;POINT(-118.2437 34.0522)'), 
    'USD', 
    'completed', 
    'paypal', 
    'customer2@example.com',
    10,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    75.50, 
    '192.168.1.3'::inet,
    ST_GeogFromText('SRID=4326;POINT(-87.6298 41.8781)'), 
    'USD', 
    'completed', 
    'bank_transfer', 
    'customer3@example.com',
    3,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    250.00, 
    '192.168.1.4'::inet,
    ST_GeogFromText('SRID=4326;POINT(-0.1278 51.5074)'), 
    'GBP', 
    'completed', 
    'credit_card', 
    'customer4@example.com',
    2,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', 
    1250.00, 
    '192.168.1.5'::inet,
    ST_GeogFromText('SRID=4326;POINT(139.6917 35.6895)'), 
    'JPY', 
    'completed', 
    'credit_card', 
    'customer5@example.com',
    85,
    true
  );

-- Create a function to calculate transaction risk based on location
CREATE OR REPLACE FUNCTION calculate_transaction_risk()
RETURNS TRIGGER AS $$
BEGIN
  -- Set anomaly flag based on risk score
  IF NEW.risk_score > 80 THEN
    NEW.anomaly := TRUE;
  ELSE
    NEW.anomaly := FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically calculate risk
CREATE TRIGGER transaction_risk_trigger
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION calculate_transaction_risk();

-- Create an index on the location column for faster spatial queries
CREATE INDEX IF NOT EXISTS idx_transactions_location ON transactions USING GIST (location);
