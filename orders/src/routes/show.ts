import { NotFoundError, requireAuth } from '@ticketing-lr/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';


const router = express.Router();


router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    id: req.params.orderId,
  }).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  res.send(order);
});

export { router as showOrderRouter };