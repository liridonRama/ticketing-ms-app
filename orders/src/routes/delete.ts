import { NotFoundError, OrderStatus, requireAuth } from '@ticketing-lr/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';


const router = express.Router();


router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    id: req.params.orderId,
  });

  if (!order) {
    throw new NotFoundError();
  }

  order.set('status', OrderStatus.Cancelled);

  await order.save();


  res.status(204).end();
});

export { router as deleteOrderRouter };