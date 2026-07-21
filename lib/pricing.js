export const CREDIT_COST_PER_VIDEO = 10;
export const FREE_CREDITS_ON_SIGNUP = 20;

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    credits: 100,
    priceEnvVar: 'NEXT_PUBLIC_STRIPE_PRICE_STARTER',
    blurb: '10 one-minute videos',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    credits: 400,
    priceEnvVar: 'NEXT_PUBLIC_STRIPE_PRICE_PRO',
    blurb: '40 one-minute videos',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 79,
    credits: 1200,
    priceEnvVar: 'NEXT_PUBLIC_STRIPE_PRICE_STUDIO',
    blurb: '120 one-minute videos',
  },
];
