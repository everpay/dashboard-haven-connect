
export interface Recipient {
  recipient_id?: number;
  user_id?: string;
  first_names?: string;
  last_names?: string;
  full_name?: string;
  email_address?: string;
  phone_country_code?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  country_iso3?: string;
  
  // Adding additional fields that are being used
  street_1?: string;
  street_2?: string;
  telephone_number?: string;
  telephone_country_iso2?: string;
  account_number?: string;
  routing_number?: string;
  bank_name?: string;
  account_type?: string;
  swift_code?: string;
  swift_bic?: string;
  payment_method?: string;
  
  // Bank-specific fields
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_street_1?: string;
  bank_street_2?: string;
  bank_city?: string;
  bank_region?: string;
  bank_country_iso3?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface UpdateRecipientParams {
  recipientId: number;
  updatedRecipient: Partial<Recipient>;
}
