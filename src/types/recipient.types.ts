
export interface Recipient {
  recipient_id: number;
  first_names: string;
  last_names: string;
  full_name: string;
  email_address?: string;
  telephone_number?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country_iso3?: string;
  created_at?: string;
  user_id?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_name?: string;
  payment_method?: string;
  swift_bic?: string;
  bank_street_1?: string;
  bank_street_2?: string;
  bank_city?: string;
  bank_region?: string;
  bank_country_iso3?: string;
}

export interface UpdateRecipientParams {
  recipientId: number;
  updatedRecipient: Partial<Recipient>;
}
