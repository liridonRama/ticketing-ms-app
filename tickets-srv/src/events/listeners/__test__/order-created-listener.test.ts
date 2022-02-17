import { OrderCreatedEvent, OrderStatus, Subjects, TicketUpdatedEvent } from '@ticketing-lr/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/tickets';
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);


  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asd',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    }
  }

  const msg: Partial<Message> = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg };
}

it('sets the user id of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg as Message);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();


  await listener.onMessage(data, msg as Message);

  expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();


  const updatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(updatedData.orderId)
});
