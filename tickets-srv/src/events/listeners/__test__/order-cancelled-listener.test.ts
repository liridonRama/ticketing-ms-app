import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from '@ticketing-lr/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/tickets';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);


  const orderId = new Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  }

  const msg: Partial<Message> = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg };
}

it('updates the ticket, publishes an event and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});