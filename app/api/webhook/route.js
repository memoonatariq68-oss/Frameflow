import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (userId && credits > 0) {
      const admin = supabaseAdmin();
      const { data: profile } = await admin.from('profiles').select('credits').eq('id', userId).single();
      if (profile) {
        await admin.from('profiles').update({ credits: profile.credits + credits }).eq('id', userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
