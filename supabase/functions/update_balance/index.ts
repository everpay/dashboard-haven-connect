
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const body = await req.json()
    const { user_id, amount } = body

    // Get current balance
    const { data: accountData, error: accountError } = await supabaseClient
      .from('bank_accounts')
      .select('balance')
      .eq('user_id', user_id)
      .single()

    if (accountError) {
      return new Response(
        JSON.stringify({ error: 'Error retrieving bank account', details: accountError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const newBalance = parseFloat(accountData.balance) + parseFloat(amount)

    // Update balance
    const { error: updateError } = await supabaseClient
      .from('bank_accounts')
      .update({ balance: newBalance })
      .eq('user_id', user_id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Error updating balance', details: updateError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, newBalance }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
