import Stripe from 'stripe';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const items = await req.json();

    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
      metadata: {
        from_location: items[0].from_location || "Unknown",
        to_location: items[0].to_location || "Unknown",
        seats: items[0].quantity.toString(),
        travel_id: items[0].id.toString(),
        price_per_seat: items[0].price.toString(),
        total_price: (items[0].price * items[0].quantity).toString(),
      },
    });

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}