import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); //Creates a new Stripe instance using secret key from the .env file.

//creates a payment intent in Stripe.
export const createStripePayment = async (totalAmount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects cents
      currency,
      payment_method_types: ["Card"],
    });

    return {
      clientSecret: paymentIntent.client_secret, //Used by frontend to complete the payment.
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    throw new Error("Stripe Payment Error: " + error.message);
  }
};
