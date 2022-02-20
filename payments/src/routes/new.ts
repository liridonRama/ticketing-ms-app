import { BadRequestError, errorHandler, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketing-lr/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';


const validators = [
  body('token').not().isEmpty().withMessage('please provide a valid token'),
  body('orderId').not().isEmpty().withMessage('please provide a valid orderId'),
];

const router = express.Router();

const handler = async (req: Request, res: Response): Promise<void> => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("This order has been cancelled");
  }

  if (order.status === OrderStatus.Complete) {
    throw new BadRequestError("This order has already been completed");
  }

  // add strapi token logic

  const stripeCharge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });

  const payment = Payment.build({
    orderId,
    stripeId: stripeCharge.id,
  })

  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: order.id,
    stripeId: stripeCharge.id,
  });

  res.status(201).send({ id: payment.id });
}

router.post(
  '/api/payments',
  requireAuth,
  validators,
  validateRequest,
  errorHandler,
  handler
);



export { router as createChargeRouter };
