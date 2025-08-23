/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';

export const bookTour = async (tourId) => {
  const stripe = await loadStripe(
    'pk_test_51RyKCs8rFUCE99yCAkbHikmiFJr5yKXoYTSecgrH89NMDtahoQ2OZ5k0HVOb9Ku5AZSVjy8gt7j4zbW46k2bsERJ006n2BMcJ9',
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
