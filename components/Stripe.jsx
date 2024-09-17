'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

// Load Stripe outside of the component to avoid re-initializing on each render
const stripePromise = loadStripe('pk_test_51Os3LdSAuKmhliKLa5RwcN5usXJVOPdBnPI7CQxWErid75gIzhNpXK4pzfSHZzTvLhhLYqn8eEacIp3NVCxo5oiP009QBLOv1v');

export default function StripePayment() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const[errorMessage,setErrorMessage] = useState("")
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    setLoading(true);

    // Call the API route to create a PaymentIntent
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert USD to cents
      }),
    });

    const { clientSecret } = await res.json();

    if (!stripe || !elements) {
      console.error('Stripe.js has not yet loaded.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirm the card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error('Error processing payment:', error);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment successful!');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#333' }}>Enter Amount to Pay</h2>
      <input
        type="number"
        placeholder="Amount in USD"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        min="1"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '20px',
        }}
      />
      <div style={{ marginBottom: '20px' }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      <button
        disabled={loading}
        onClick={handlePayment}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#6772e5',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
      {/* Show error message to your customers */}
      <div style={{ marginTop: '20px', color: '#9e2146' }}>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </div>
  );
}
