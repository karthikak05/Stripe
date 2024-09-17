import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Os3LdSAuKmhliKLtgM7OgsCTYQZNnRj0G6oKS0i3Gj07M9VKqlYEbAlI9tXQkCCjuAbT4EHB6pm19V52yYy4qnA00Pkf5ac4s'); // Use your Stripe secret key here

export async function POST(req) {
  try {
    const { amount } = await req.json(); // Parse the incoming JSON payload

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types:["card"],
      amount,
      currency: 'usd',
    });

    // Return the client secret of the PaymentIntent
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

