import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, amount, chain, txHash } = await req.json();

    if (!walletAddress || !amount || !chain || !txHash) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current presale config
    const { data: presale, error: presaleError } = await supabase
      .from('presale')
      .select('*')
      .single();

    if (presaleError) throw presaleError;

    // Calculate MEME tokens
    const memeReceived = Math.floor(amount / presale.current_price);

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (userError) throw userError;

    // Create transaction record
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        amount: amount,
        chain: chain,
        meme_received: memeReceived,
        price_at_purchase: presale.current_price,
        tx_hash: txHash,
        status: 'confirmed'
      });

    if (txError) throw txError;

    // Update user balance
    const newBalance = (user.meme_balance || 0) + memeReceived;
    const newContributed = (user.total_contributed || 0) + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({
        meme_balance: newBalance,
        total_contributed: newContributed,
        last_contribution: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress.toLowerCase());

    if (updateError) throw updateError;

    // Update presale stats
    const { error: presaleUpdateError } = await supabase
      .from('presale')
      .update({
        total_raised: (presale.total_raised || 0) + amount,
        tokens_allocated: (presale.tokens_allocated || 0) + memeReceived,
        total_participants: presale.total_participants // Will be updated by trigger if needed
      })
      .eq('id', presale.id);

    if (presaleUpdateError) throw presaleUpdateError;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          memeReceived,
          newBalance,
          totalContributed: newContributed,
          txHash
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
