import * as purchaseService from "../services/purchaseService.js";
import { checkoutSchema } from "../validations/index.js";

export async function getAll(req, res, next) {
  try {
    const purchases = await purchaseService.getPurchases();
    res.json(purchases);
  } catch (err) {
    next(err);
  }
}

export async function getByUser(req, res, next) {
  try {
    const purchases = await purchaseService.getUserPurchases(req.user._id);
    res.json(purchases);
  } catch (err) {
    next(err);
  }
}

export async function createCheckout(req, res, next) {
  try {
    const { ebookId } = checkoutSchema.parse(req.body);
    const clientOrigin = req.get("origin");
    const session = await purchaseService.createCheckoutSession(
      ebookId,
      req.user,
      clientOrigin
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const purchase = await purchaseService.confirmPurchase(req.params.sessionId);
    res.json(purchase);
  } catch (err) {
    next(err);
  }
}

export async function confirm(req, res, next) {
  try {
    const { sessionId } = req.body;
    const purchase = await purchaseService.confirmPurchase(sessionId);
    res.json(purchase);
  } catch (err) {
    next(err);
  }
}

export async function getWriterSales(req, res, next) {
  try {
    const sales = await purchaseService.getWriterSales(req.user._id);
    res.json(sales);
  } catch (err) {
    next(err);
  }
}

export async function stripeWebhook(req, res, next) {
  try {
    const result = await purchaseService.handleStripeWebhook(
      req.body,
      req.headers["stripe-signature"]
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
