import Stripe from 'stripe';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID is required' }), {
        status: 400,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    return new Response(JSON.stringify({
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata,
      amount_total: session.amount_total,
    }), { status: 200 });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}