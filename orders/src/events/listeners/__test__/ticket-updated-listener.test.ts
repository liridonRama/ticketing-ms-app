import { Listener, TicketUpdatedEvent } from '@ticketing-lr/common';
import { Types } from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const id = new Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    id,
    title: 'title',
    price: 5,
  });

  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id,
    title: 'concert',
    price: 10,
    userId: new Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates, and saves a ticket', async () => {
  const setupRes = await setup();

  await setupRes.listener.onMessage(setupRes.data, setupRes.msg);

  const updatedTicket = await Ticket.findById(setupRes.ticket._id);

  expect(updatedTicket!.title).toEqual(setupRes.data.title);
  expect(updatedTicket!.price).toEqual(setupRes.data.price);
  expect(updatedTicket!.version).toEqual(setupRes.data.version);
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { data, listener, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    expect(error).toBeDefined();
  }

  expect(msg.ack).not.toHaveBeenCalled();
});