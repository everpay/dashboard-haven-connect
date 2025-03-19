
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if the payment_processors table exists
    const { data: tableExists, error: checkError } = await supabaseClient
      .from('payment_processors')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (checkError && !checkError.message.includes('does not exist')) {
      throw checkError
    }

    // If the table doesn't exist, create it
    if (!tableExists && checkError?.message.includes('does not exist')) {
      // Create the payment_processors table
      const { error: createTableError } = await supabaseClient.rpc('create_payment_processors_table')
      
      if (createTableError) throw createTableError

      // Insert default payment processors
      const { error: insertError } = await supabaseClient
        .from('payment_processors')
        .insert([
          {
            name: 'Clisapay',
            type: 'credit-card',
            configuration: {
              merchantName: 'EVERPAY',
              merchantNumber: 'EVERPAY',
              merchantPassword: 'pay147258',
              merchantKey: 'beTvmODLata^iPY',
              integrationType: 'clisapay'
            },
            status: 'active'
          },
          {
            name: 'MekaPay',
            type: 'credit-card',
            configuration: {
              authorization: 'Bearer YOUR_SECRET_KEY',
              endpoint: 'https://mekapayglobal.com/api/charge',
              integrationType: 'mekapay'
            },
            status: 'active'
          },
          {
            name: 'Finup',
            type: 'virtual-cards',
            configuration: {
              apiKey: '0c89f93687869cbf3cc0df6bc00ba54d262eecbcd08bb517802d5de4e3a31bef',
              endpoint: 'https://api.finup.io/v1',
              integrationType: 'finup'
            },
            status: 'active'
          }
        ])

      if (insertError) throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment processors initialized' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
