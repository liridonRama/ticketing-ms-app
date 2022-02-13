import { BadRequestError, NotFoundError, OrderStatus, validateRequest } from '@ticketing-lr/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';


const router = express.Router();

const EXPIRATION_WINDOW_MINUTES = 15;

const validators = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId is required'),
]

const handler = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  const exp = new Date();
  exp.setMinutes(exp.getMinutes() + EXPIRATION_WINDOW_MINUTES);

  const order = new Order({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: exp,
    ticket
  });

  await order.save();

  res.status(201).send(order);
}

router.post(
  "/api/orders",
  validators,
  validateRequest,
  handler,
)

export { router as newOrderRouter };
