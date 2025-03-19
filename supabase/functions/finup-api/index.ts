
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FINUP_API_KEY = Deno.env.get('FINUP_API_KEY') || '0c89f93687869cbf3cc0df6bc00ba54d262eecbcd08bb517802d5de4e3a31bef'
const FINUP_API_URL = 'https://api.finup.io/v1'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, user_id, data } = await req.json()
    
    // Create a virtual card
    if (action === 'create_virtual_card') {
      console.log('Creating virtual card via Finup API for user:', user_id)
      
      // Make request to Finup API
      const response = await fetch(`${FINUP_API_URL}/cards/virtual`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FINUP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user_id,
          name: data.name || 'Virtual Card',
          currency: data.currency || 'USD',
          card_type: 'virtual',
          daily_limit: data.daily_limit || 1000,
          monthly_limit: data.monthly_limit || 5000
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Finup API error:', errorText)
        throw new Error(`Finup API error: ${response.status} ${errorText}`)
      }

      const cardData = await response.json()
      
      // For demo purposes, we'll create a simulated successful response 
      // as we're using a placeholder API key
      const simulatedCardData = {
        id: `card_${Math.random().toString(36).substring(2, 10)}`,
        card_token: `tok_${Math.random().toString(36).substring(2, 10)}`,
        last4: (1000 + Math.floor(Math.random() * 9000)).toString(),
        expiry_month: String(new Date().getMonth() + 1).padStart(2, '0'),
        expiry_year: new Date().getFullYear() + 3,
        cvv: (100 + Math.floor(Math.random() * 900)).toString(),
        status: 'active',
        card_type: 'virtual',
        created_at: new Date().toISOString()
      }
      
      // Store card in the database
      const { data: cardRecord, error } = await supabaseClient
        .from('cards')
        .insert([
          {
            user_id: user_id,
            card_token: simulatedCardData.card_token,
            card_type: 'virtual',
            expiration: `${simulatedCardData.expiry_month}/${String(simulatedCardData.expiry_year).slice(-2)}`,
            status: 'active',
            card_holder: data.name || 'Account Holder',
            cvv: simulatedCardData.cvv
          }
        ])
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify({ success: true, data: simulatedCardData }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    // Get card transactions
    else if (action === 'get_card_transactions') {
      const { card_token } = data
      
      console.log('Getting card transactions for card:', card_token)
      
      // For demo purposes, generate random transactions
      const transactions = Array.from({ length: 5 }).map((_, i) => ({
        id: `txn_${Math.random().toString(36).substring(2, 10)}`,
        card_token: card_token,
        amount: parseFloat((Math.random() * 5).toFixed(2)), // Random amount under $5
        merchant_name: [
          'Coffee Shop', 
          'Grocery Store', 
          'Online Service', 
          'Ride Share', 
          'Streaming Service'
        ][Math.floor(Math.random() * 5)],
        status: ['completed', 'pending', 'declined'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        type: ['purchase', 'refund'][Math.floor(Math.random() * 2)]
      }))
      
      return new Response(
        JSON.stringify({ success: true, data: transactions }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    // Fund a card
    else if (action === 'fund_card') {
      const { card_token, amount } = data
      
      console.log('Funding card:', card_token, 'with amount:', amount)
      
      // Store funding record in the database
      const { data: fundingRecord, error } = await supabaseClient
        .from('funding')
        .insert([
          {
            user_id: user_id,
            card_id: card_token,
            amount: amount,
            method: 'account_transfer'
          }
        ])
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { 
            id: `fund_${Math.random().toString(36).substring(2, 10)}`,
            card_token: card_token,
            amount: amount,
            status: 'completed',
            created_at: new Date().toISOString()
          } 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
