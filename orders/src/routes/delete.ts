import { NotFoundError, OrderStatus, requireAuth } from '@ticketing-lr/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();


router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    id: req.params.orderId,
  }).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  order.set('status', OrderStatus.Cancelled);

  await order.save();


  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).end();
});

export { router as deleteOrderRouter };