
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

    // Use the update_balance RPC function
    const { data, error } = await supabaseClient.rpc('update_balance', {
      user_id_input: user_id,
      amount_input: parseFloat(amount)
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Error updating balance', details: error }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get the updated balance
    const { data: accountData, error: accountError } = await supabaseClient
      .from('bank_accounts')
      .select('balance')
      .eq('user_id', user_id)
      .single()

    if (accountError) {
      return new Response(
        JSON.stringify({ error: 'Error retrieving updated balance', details: accountError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, newBalance: accountData.balance }),
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
