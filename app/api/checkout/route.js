import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { stripe } from '@/lib/stripe';
import { PLANS } from '@/lib/pricing';

export async function POST(req) {
  const { planId } = await req.json();
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

  const priceId = process.env[plan.priceEnvVar];
  if (!priceId) {
    return NextResponse.json({ error: `Missing ${plan.priceEnvVar} in your environment variables.` }, { status: 500 });
  }

  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Please log in first.' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?purchase=cancelled`,
    client_reference_id: user.id,
    metadata: { user_id: user.id, plan_id: plan.id, credits: String(plan.credits) },
  });

  return NextResponse.json({ url: session.url });
}
