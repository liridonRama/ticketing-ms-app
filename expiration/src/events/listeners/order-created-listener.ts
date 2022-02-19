import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@ticketing-lr/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    console.log(`delay will be ${Math.ceil(delay / 1000)} seconds`);

    await expirationQueue.add(
      { orderId: data.id, },
      { delay }
    );


    msg.ack();
  }

}