import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import Stripe from "stripe";

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY.");
  return new Stripe(secretKey);
}

export function getPriceId(plan: string) {
  if (plan === "Basic") return "price_1TLuwVQXfVurUE83LrE4j81Z";
  if (plan === "Pro") return "price_1TLuwVQXfVurUE83LrE4j81Z";
  return null;
}

export function getPlanFromPriceId(priceId?: string | null) {
  if (!priceId) return "Free";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "Pro";
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return "Basic";
  return "Free";
}

export async function findOrCreateStripeCustomer(user: {
  _id: string;
  email: string;
  name: string;
  stripeCustomerId?: string | null;
}) {
  const stripe = getStripe();

  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: String(user._id) },
  });

  await connectToDatabase();
  await UserModel.findByIdAndUpdate(user._id, {
    $set: { stripeCustomerId: customer.id },
  });

  return customer.id;
}