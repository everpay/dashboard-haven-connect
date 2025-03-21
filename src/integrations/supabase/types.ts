export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          key_type: string
          secret_key: string
          user_id: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          key_type: string
          secret_key: string
          user_id?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          key_type?: string
          secret_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_name: string | null
          account_number: string | null
          balance: number | null
          bank_account_id: number
          bank_account_number: string
          bank_city: string | null
          bank_country_iso3: string | null
          bank_name: string | null
          bank_region: string | null
          bank_routing_number: string
          bank_street_1: string | null
          bank_street_2: string | null
          created_at: string | null
          recipient_id: number | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          balance?: number | null
          bank_account_id?: number
          bank_account_number: string
          bank_city?: string | null
          bank_country_iso3?: string | null
          bank_name?: string | null
          bank_region?: string | null
          bank_routing_number: string
          bank_street_1?: string | null
          bank_street_2?: string | null
          created_at?: string | null
          recipient_id?: number | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          balance?: number | null
          bank_account_id?: number
          bank_account_number?: string
          bank_city?: string | null
          bank_country_iso3?: string | null
          bank_name?: string | null
          bank_region?: string | null
          bank_routing_number?: string
          bank_street_1?: string | null
          bank_street_2?: string | null
          created_at?: string | null
          recipient_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["recipient_id"]
          },
        ]
      }
      banking_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          recipient_email: string | null
          recipient_id: string | null
          sender_id: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id: string
          status?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "banking_transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banking_transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_addresses: {
        Row: {
          address_type: string
          city: string
          country: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          postal_code: string
          state: string
          street_address: string
          unit_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_type: string
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          postal_code: string
          state: string
          street_address: string
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_type?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          postal_code?: string
          state?: string
          street_address?: string
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_details: {
        Row: {
          annual_revenue: number | null
          business_category: string
          business_description: string | null
          business_name: string
          business_type: string
          created_at: string | null
          employee_count: number | null
          id: string
          phone_number: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          annual_revenue?: number | null
          business_category: string
          business_description?: string | null
          business_name: string
          business_type: string
          created_at?: string | null
          employee_count?: number | null
          id?: string
          phone_number?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          annual_revenue?: number | null
          business_category?: string
          business_description?: string | null
          business_name?: string
          business_type?: string
          created_at?: string | null
          employee_count?: number | null
          id?: string
          phone_number?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_owners: {
        Row: {
          city: string
          country: string
          created_at: string | null
          date_of_birth: string
          email: string
          first_name: string
          id: string
          is_primary: boolean | null
          last_name: string
          ownership_percentage: number
          phone_number: string | null
          postal_code: string
          ssn_last_four: string
          state: string
          street_address: string
          unit_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city: string
          country?: string
          created_at?: string | null
          date_of_birth: string
          email: string
          first_name: string
          id?: string
          is_primary?: boolean | null
          last_name: string
          ownership_percentage: number
          phone_number?: string | null
          postal_code: string
          ssn_last_four: string
          state: string
          street_address: string
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          date_of_birth?: string
          email?: string
          first_name?: string
          id?: string
          is_primary?: boolean | null
          last_name?: string
          ownership_percentage?: number
          phone_number?: string | null
          postal_code?: string
          ssn_last_four?: string
          state?: string
          street_address?: string
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_owners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_category: string | null
          business_name: string
          business_type: string
          created_at: string | null
          email_verified: boolean | null
          email_verified_at: string | null
          employer_id: string | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed: boolean | null
          payment_types: string[]
          projected_volume: string
          status: string
          updated_at: string | null
          user_id: string | null
          verification_token: string | null
        }
        Insert: {
          business_category?: string | null
          business_name: string
          business_type: string
          created_at?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          employer_id?: string | null
          first_name: string
          id?: string
          last_name: string
          onboarding_completed?: boolean | null
          payment_types: string[]
          projected_volume: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string | null
        }
        Update: {
          business_category?: string | null
          business_name?: string
          business_type?: string
          created_at?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          employer_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          onboarding_completed?: boolean | null
          payment_types?: string[]
          projected_volume?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      card_accounts: {
        Row: {
          card_account_id: number
          card_number: string
          created_at: string | null
          cvv: string | null
          expiration_month: string
          expiration_year: string
          recipient_id: number | null
        }
        Insert: {
          card_account_id?: number
          card_number: string
          created_at?: string | null
          cvv?: string | null
          expiration_month: string
          expiration_year: string
          recipient_id?: number | null
        }
        Update: {
          card_account_id?: number
          card_number?: string
          created_at?: string | null
          cvv?: string | null
          expiration_month?: string
          expiration_year?: string
          recipient_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_accounts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["recipient_id"]
          },
        ]
      }
      card_networks: {
        Row: {
          acquirer_merchant_id: string | null
          card_type: string
          country_code: string | null
          created_at: string | null
          id: number
          mcc: string | null
          merchant_name: string | null
          merchant_profile_id: number
          processor_id: string
        }
        Insert: {
          acquirer_merchant_id?: string | null
          card_type: string
          country_code?: string | null
          created_at?: string | null
          id?: number
          mcc?: string | null
          merchant_name?: string | null
          merchant_profile_id: number
          processor_id: string
        }
        Update: {
          acquirer_merchant_id?: string | null
          card_type?: string
          country_code?: string | null
          created_at?: string | null
          id?: number
          mcc?: string | null
          merchant_name?: string | null
          merchant_profile_id?: number
          processor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_networks_merchant_profile_id_fkey"
            columns: ["merchant_profile_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_networks_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "payment_processors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_card_network_merchant"
            columns: ["merchant_profile_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_card_network_processor"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "payment_processors"
            referencedColumns: ["id"]
          },
        ]
      }
      cardholders: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          marqeta_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          marqeta_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          marqeta_token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cardholders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          card_holder: string | null
          card_token: string
          card_type: string | null
          created_at: string | null
          cvv: string | null
          expiration: string
          expiry_date: string | null
          id: string
          status: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          card_holder?: string | null
          card_token: string
          card_type?: string | null
          created_at?: string | null
          cvv?: string | null
          expiration: string
          expiry_date?: string | null
          id?: string
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          card_holder?: string | null
          card_token?: string
          card_type?: string | null
          created_at?: string | null
          cvv?: string | null
          expiration?: string
          expiry_date?: string | null
          id?: string
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chartmogul_config: {
        Row: {
          account_token: string
          api_key: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          account_token: string
          api_key: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          account_token?: string
          api_key?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chartmogul_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reseller_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reseller_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reseller_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string
          reason?: string | null
        }
        Relationships: []
      }
      corporate_accounts: {
        Row: {
          corporate_account_id: string
          created_at: string | null
          float_balance: number | null
          gateway_api_key: string
          payout_balance: number | null
          reserve_balance: number | null
          user_id: string | null
        }
        Insert: {
          corporate_account_id: string
          created_at?: string | null
          float_balance?: number | null
          gateway_api_key: string
          payout_balance?: number | null
          reserve_balance?: number | null
          user_id?: string | null
        }
        Update: {
          corporate_account_id?: string
          created_at?: string | null
          float_balance?: number | null
          gateway_api_key?: string
          payout_balance?: number | null
          reserve_balance?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          description: string | null
          email: string
          id: string
          metadata: Json | null
          name: string | null
          phone: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      digicash_credentials: {
        Row: {
          created_at: string | null
          id: string
          private_key: string
          public_key: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          private_key: string
          public_key: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          private_key?: string
          public_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digicash_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      funding: {
        Row: {
          amount: number
          card_id: string | null
          created_at: string | null
          id: string
          method: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          card_id?: string | null
          created_at?: string | null
          id?: string
          method?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          card_id?: string | null
          created_at?: string | null
          id?: string
          method?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_sources: {
        Row: {
          account_number: string
          balance: number | null
          created_at: string | null
          funding_type: string | null
          id: string
          routing_number: string
          user_id: string | null
        }
        Insert: {
          account_number: string
          balance?: number | null
          created_at?: string | null
          funding_type?: string | null
          id?: string
          routing_number: string
          user_id?: string | null
        }
        Update: {
          account_number?: string
          balance?: number | null
          created_at?: string | null
          funding_type?: string | null
          id?: string
          routing_number?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      idempotency_keys: {
        Row: {
          created_at: string | null
          id: string
          key: string
          response: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          response?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          response?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idempotency_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_url: string
          category: string
          created_at: string | null
          description: string
          id: string
          logo_url: string
          name: string
        }
        Insert: {
          api_url: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          logo_url: string
          name: string
        }
        Update: {
          api_url?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          logo_url?: string
          name?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number | null
          description: string
          id: number
          invoice_id: number | null
          quantity: number
          unit_price: number
        }
        Insert: {
          amount?: number | null
          description: string
          id?: never
          invoice_id?: number | null
          quantity: number
          unit_price: number
        }
        Update: {
          amount?: number | null
          description?: string
          id?: never
          invoice_id?: number | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string
          due_date: string
          id: number
          issue_date: string
          merchant_id: string | null
          status: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          due_date: string
          id?: never
          issue_date: string
          merchant_id?: string | null
          status?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          due_date?: string
          id?: never
          issue_date?: string
          merchant_id?: string | null
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_sales_volume"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "invoices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_logs: {
        Row: {
          event: string
          id: string
          ip_address: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event: string
          id?: string
          ip_address: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event?: string
          id?: string
          ip_address?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ip_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verifications: {
        Row: {
          applicant_id: string
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marqeta_customers: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          metadata: Json | null
          phone: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          metadata?: Json | null
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          metadata?: Json | null
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marqeta_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_integrations: {
        Row: {
          active: boolean | null
          config: Json
          created_at: string | null
          id: string
          integration_id: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          config: Json
          created_at?: string | null
          id?: string
          integration_id?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          config?: Json
          created_at?: string | null
          id?: string
          integration_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_integrations_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_processors: {
        Row: {
          created_at: string | null
          id: string
          percentage: number | null
          priority: number | null
          processor_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          percentage?: number | null
          priority?: number | null
          processor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          percentage?: number | null
          priority?: number | null
          processor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_processors_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "payment_processors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_processors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_profiles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          sub_merchant_key: string | null
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          sub_merchant_key?: string | null
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          sub_merchant_key?: string | null
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_merchant_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          reseller_id: string | null
          stripe_account_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          reseller_id?: string | null
          stripe_account_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          reseller_id?: string | null
          stripe_account_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchants_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "merchant_sales_volume"
            referencedColumns: ["reseller_id"]
          },
          {
            foreignKeyName: "merchants_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      new_transactions: {
        Row: {
          bank_account_id: number | null
          card_account_id: number | null
          corporate_account_id: string | null
          corporate_administrative_message: string | null
          float_balance_after_transaction: number | null
          float_balance_before_transaction: number | null
          gateway_message: string | null
          notification_type: number
          payout_balance_after_transaction: number | null
          payout_balance_before_transaction: number | null
          priority_level: number
          public_transaction_description: string | null
          recipient_id: number | null
          reserve_balance_after_transaction: number | null
          reserve_balance_before_transaction: number | null
          send_amount: number
          send_currency_iso3: string
          send_fee_fixed_amount: number | null
          send_fee_percentage: number | null
          send_fee_percentage_amount: number | null
          send_fee_total_amount: number | null
          send_method: string
          transaction_datetime_created: string | null
          transaction_id: string
          transaction_status: string
          transfer_method: string
          user_id: string | null
        }
        Insert: {
          bank_account_id?: number | null
          card_account_id?: number | null
          corporate_account_id?: string | null
          corporate_administrative_message?: string | null
          float_balance_after_transaction?: number | null
          float_balance_before_transaction?: number | null
          gateway_message?: string | null
          notification_type?: number
          payout_balance_after_transaction?: number | null
          payout_balance_before_transaction?: number | null
          priority_level?: number
          public_transaction_description?: string | null
          recipient_id?: number | null
          reserve_balance_after_transaction?: number | null
          reserve_balance_before_transaction?: number | null
          send_amount: number
          send_currency_iso3?: string
          send_fee_fixed_amount?: number | null
          send_fee_percentage?: number | null
          send_fee_percentage_amount?: number | null
          send_fee_total_amount?: number | null
          send_method: string
          transaction_datetime_created?: string | null
          transaction_id: string
          transaction_status: string
          transfer_method?: string
          user_id?: string | null
        }
        Update: {
          bank_account_id?: number | null
          card_account_id?: number | null
          corporate_account_id?: string | null
          corporate_administrative_message?: string | null
          float_balance_after_transaction?: number | null
          float_balance_before_transaction?: number | null
          gateway_message?: string | null
          notification_type?: number
          payout_balance_after_transaction?: number | null
          payout_balance_before_transaction?: number | null
          priority_level?: number
          public_transaction_description?: string | null
          recipient_id?: number | null
          reserve_balance_after_transaction?: number | null
          reserve_balance_before_transaction?: number | null
          send_amount?: number
          send_currency_iso3?: string
          send_fee_fixed_amount?: number | null
          send_fee_percentage?: number | null
          send_fee_percentage_amount?: number | null
          send_fee_total_amount?: number | null
          send_method?: string
          transaction_datetime_created?: string | null
          transaction_id?: string
          transaction_status?: string
          transfer_method?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "new_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["bank_account_id"]
          },
          {
            foreignKeyName: "new_transactions_card_account_id_fkey"
            columns: ["card_account_id"]
            isOneToOne: false
            referencedRelation: "card_accounts"
            referencedColumns: ["card_account_id"]
          },
          {
            foreignKeyName: "new_transactions_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["corporate_account_id"]
          },
          {
            foreignKeyName: "new_transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["recipient_id"]
          },
        ]
      }
      notes: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: never
          title: string
        }
        Update: {
          id?: never
          title?: string
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          bank_details_completed: boolean | null
          business_address_completed: boolean | null
          business_details_completed: boolean | null
          business_type_completed: boolean | null
          created_at: string | null
          current_step: string
          id: string
          owner_details_completed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bank_details_completed?: boolean | null
          business_address_completed?: boolean | null
          business_details_completed?: boolean | null
          business_type_completed?: boolean | null
          created_at?: string | null
          current_step?: string
          id?: string
          owner_details_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bank_details_completed?: boolean | null
          business_address_completed?: boolean | null
          business_details_completed?: boolean | null
          business_type_completed?: boolean | null
          created_at?: string | null
          current_step?: string
          id?: string
          owner_details_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          name: string
          supports_hosted_payment: boolean | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          supports_hosted_payment?: boolean | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          supports_hosted_payment?: boolean | null
          type?: string
        }
        Relationships: []
      }
      payment_processors: {
        Row: {
          api_key: string
          cost: number | null
          created_at: string | null
          flexify_private_key: string | null
          flexify_public_key: string | null
          hosted_payment_metadata: Json | null
          id: string
          name: string
          payok_api_key: string | null
          payok_api_secret: string | null
          priority: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          api_key: string
          cost?: number | null
          created_at?: string | null
          flexify_private_key?: string | null
          flexify_public_key?: string | null
          hosted_payment_metadata?: Json | null
          id?: string
          name: string
          payok_api_key?: string | null
          payok_api_secret?: string | null
          priority?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          api_key?: string
          cost?: number | null
          created_at?: string | null
          flexify_private_key?: string | null
          flexify_public_key?: string | null
          hosted_payment_metadata?: Json | null
          id?: string
          name?: string
          payok_api_key?: string | null
          payok_api_secret?: string | null
          priority?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_processors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_sessions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          customer_id: string | null
          external_id: string
          id: string
          metadata: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          customer_id?: string | null
          external_id: string
          id?: string
          metadata?: Json | null
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          customer_id?: string | null
          external_id?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_tokens: {
        Row: {
          created_at: string | null
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          currency: string | null
          id: string
          payment_date: string | null
          payment_method: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          status: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          p2p_batch_id: string | null
          p2p_status: string | null
          p2p_task_id: string | null
          recipient_details: Json
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          id?: string
          p2p_batch_id?: string | null
          p2p_status?: string | null
          p2p_task_id?: string | null
          recipient_details: Json
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          p2p_batch_id?: string | null
          p2p_status?: string | null
          p2p_task_id?: string | null
          recipient_details?: Json
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          stock: number
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          stock: number
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          stock?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          kyc_status: string | null
          kyc_verified: boolean | null
          last_name: string | null
          phone: string | null
          postal_code: string | null
          role: string | null
          ssn_last_four: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          kyc_status?: string | null
          kyc_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          ssn_last_four?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          kyc_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          ssn_last_four?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipients: {
        Row: {
          account_id: string | null
          bank_account_number: string | null
          bank_name: string | null
          bank_routing_number: string | null
          city: string | null
          country_iso3: string | null
          created_at: string | null
          email_address: string | null
          first_names: string
          full_name: string
          last_names: string
          merchant_id: string | null
          payment_method: string | null
          postal_code: string | null
          recipient_id: number
          region: string | null
          street_1: string | null
          street_2: string | null
          telephone_country_iso2: string | null
          telephone_number: string | null
          user_id: string | null
          zelle_address: string | null
        }
        Insert: {
          account_id?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_routing_number?: string | null
          city?: string | null
          country_iso3?: string | null
          created_at?: string | null
          email_address?: string | null
          first_names: string
          full_name: string
          last_names: string
          merchant_id?: string | null
          payment_method?: string | null
          postal_code?: string | null
          recipient_id?: number
          region?: string | null
          street_1?: string | null
          street_2?: string | null
          telephone_country_iso2?: string | null
          telephone_number?: string | null
          user_id?: string | null
          zelle_address?: string | null
        }
        Update: {
          account_id?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_routing_number?: string | null
          city?: string | null
          country_iso3?: string | null
          created_at?: string | null
          email_address?: string | null
          first_names?: string
          full_name?: string
          last_names?: string
          merchant_id?: string | null
          payment_method?: string | null
          postal_code?: string | null
          recipient_id?: number
          region?: string | null
          street_1?: string | null
          street_2?: string | null
          telephone_country_iso2?: string | null
          telephone_number?: string | null
          user_id?: string | null
          zelle_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resellers: {
        Row: {
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resellers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routing_rules: {
        Row: {
          condition: string
          created_at: string | null
          id: string
          priority: number
          processor_id: string | null
          user_id: string | null
        }
        Insert: {
          condition: string
          created_at?: string | null
          id?: string
          priority?: number
          processor_id?: string | null
          user_id?: string | null
        }
        Update: {
          condition?: string
          created_at?: string | null
          id?: string
          priority?: number
          processor_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routing_rules_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "payment_processors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          id: string
          plan: string
          renewal_date: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          plan: string
          renewal_date?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          id?: string
          plan?: string
          renewal_date?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          anomaly: boolean | null
          card_token: string | null
          card_type: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          description: string | null
          id: string
          ip_address: unknown
          location: unknown | null
          merchant_id: string
          merchant_name: string | null
          metadata: Json | null
          payment_method: string | null
          risk_score: number | null
          status: string | null
          transaction_type: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          anomaly?: boolean | null
          card_token?: string | null
          card_type?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          description?: string | null
          id?: string
          ip_address: unknown
          location?: unknown | null
          merchant_id: string
          merchant_name?: string | null
          metadata?: Json | null
          payment_method?: string | null
          risk_score?: number | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          anomaly?: boolean | null
          card_token?: string | null
          card_type?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          location?: unknown | null
          merchant_id?: string
          merchant_name?: string | null
          metadata?: Json | null
          payment_method?: string | null
          risk_score?: number | null
          status?: string | null
          transaction_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_sales_volume"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          browser_name: string | null
          browser_version: string | null
          created_at: string | null
          device_type: string | null
          id: string
          os_name: string | null
          os_version: string | null
          user_id: string | null
        }
        Insert: {
          browser_name?: string | null
          browser_version?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          os_name?: string | null
          os_version?: string | null
          user_id?: string | null
        }
        Update: {
          browser_name?: string | null
          browser_version?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          os_name?: string | null
          os_version?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_id: string
          country: string | null
          email: string
          email_verified: string | null
          first_name: string | null
          id: string
          ip_address: string | null
          last_name: string | null
          password_hash: string | null
          phone_number: string | null
          phone_verified: boolean | null
          role: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          clerk_id?: string
          country?: string | null
          email: string
          email_verified?: string | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          role?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          clerk_id?: string
          country?: string | null
          email?: string
          email_verified?: string | null
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          event_name: string
          id: string
          payload: Json
          response_body: string | null
          response_code: number | null
          status: string
          webhook_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          id?: string
          payload: Json
          response_body?: string | null
          response_code?: number | null
          status: string
          webhook_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_code?: number | null
          status?: string
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          id: string
          secret_key: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          secret_key: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          secret_key?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          actions: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          trigger: string
        }
        Insert: {
          actions: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          trigger: string
        }
        Update: {
          actions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          trigger?: string
        }
        Relationships: []
      }
    }
    Views: {
      merchant_sales_volume: {
        Row: {
          merchant_id: string | null
          merchant_name: string | null
          reseller_id: string | null
          total_sales: number | null
        }
        Relationships: []
      }
      merchant_verification_status: {
        Row: {
          id: string | null
          is_email_verified: boolean | null
          onboarding_completed: boolean | null
          user_id: string | null
        }
        Insert: {
          id?: string | null
          is_email_verified?: never
          onboarding_completed?: boolean | null
          user_id?: string | null
        }
        Update: {
          id?: string | null
          is_email_verified?: never
          onboarding_completed?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "reseller_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          status: string | null
        }
        Relationships: []
      }
      sales_by_payment_method: {
        Row: {
          payment_method: string | null
          total_sales: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_tables_exist: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      ensure_profile_exists: {
        Args: {
          user_id: string
          user_email: string
          user_full_name?: string
          user_first_name?: string
          user_last_name?: string
        }
        Returns: boolean
      }
      get_resellers: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_settlements: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_transaction_chart_data: {
        Args: {
          days_back?: number
        }
        Returns: Json[]
      }
      get_transactions_paginated: {
        Args: {
          page_number: number
          page_size: number
        }
        Returns: {
          data: Json
          total_count: number
        }[]
      }
      verify_merchant_email: {
        Args: {
          token: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
