import Purchase from "../models/Purchase.js";
import Transaction from "../models/Transaction.js";
import Ebook from "../models/Ebook.js";
import User from "../models/User.js";
import { getStripe } from "../utils/stripe.js";
import { TRANSACTION_TYPES } from "../constants/index.js";

export async function getPurchases() {
  return Purchase.find().populate("ebookId buyerId writerId").sort({ purchaseDate: -1 });
}

export async function getUserPurchases(userId) {
  return Purchase.find({ buyerId: userId })
    .populate("ebookId")
    .sort({ purchaseDate: -1 });
}

export async function createCheckoutSession(ebookId, user) {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error("Stripe is not configured");
    err.status = 500;
    throw err;
  }

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) {
    const err = new Error("Ebook not found");
    err.status = 404;
    throw err;
  }

  if (ebook.writerId.toString() === user._id.toString()) {
    const err = new Error("Cannot purchase your own ebook");
    err.status = 400;
    throw err;
  }

  const alreadyPurchased = await Purchase.findOne({
    buyerId: user._id,
    ebookId: ebook._id,
  });
  if (alreadyPurchased) {
    const err = new Error("You already own this ebook");
    err.status = 409;
    throw err;
  }

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: ebook.title },
          unit_amount: Math.round(ebook.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/ebooks/${ebook._id}`,
    metadata: {
      ebookId: ebook._id.toString(),
      buyerId: user._id.toString(),
      writerId: ebook.writerId.toString(),
    },
  });

  return { sessionId: session.id, url: session.url };
}

export async function confirmPurchase(sessionId) {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error("Stripe is not configured");
    err.status = 500;
    throw err;
  }

  const existing = await Purchase.findOne({ stripeSessionId: sessionId });
  if (existing) {
    return existing.populate("ebookId");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    const err = new Error("Payment not completed");
    err.status = 400;
    throw err;
  }

  const { ebookId, buyerId, writerId } = session.metadata;
  const amount = session.amount_total / 100;

  const purchase = await Purchase.create({
    ebookId,
    buyerId,
    writerId,
    amount,
    stripeSessionId: sessionId,
  });

  await Promise.all([
    Ebook.findByIdAndUpdate(ebookId, { $inc: { totalSales: 1 } }),
    User.findByIdAndUpdate(buyerId, { $addToSet: { purchasedBooks: ebookId } }),
    Transaction.create({
      type: TRANSACTION_TYPES.PURCHASE,
      email: session.customer_details?.email || "",
      amount,
      referenceId: purchase._id.toString(),
    }),
  ]);

  return purchase.populate("ebookId");
}

export async function getWriterSales(writerId) {
  return Purchase.find({ writerId })
    .populate("ebookId buyerId")
    .sort({ purchaseDate: -1 });
}

export async function handleStripeWebhook(rawBody, signature) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await confirmPurchase(session.id);
  }

  return { received: true };
}
