import { OrderCreatedEvent, Publisher, Subjects } from '@ticketing-lr/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}