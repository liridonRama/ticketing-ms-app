import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@ticketing-lr/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { queueGroupName } from './queue-group-name';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;


  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    msg.ack();
  }

}