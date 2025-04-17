import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePayment = async (totalAmount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects cents
      currency,
      payment_method_types: ["Card"],
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    throw new Error("Stripe Payment Error: " + error.message);
  }
};
