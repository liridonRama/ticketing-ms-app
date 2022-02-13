import { Listener, Subjects, TicketCreatedEvent } from '@ticketing-lr/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const ticket = Ticket.build({
      id: data.id,
      price: data.price,
      title: data.title,
    });
    await ticket.save();


    msg.ack();
  }

}