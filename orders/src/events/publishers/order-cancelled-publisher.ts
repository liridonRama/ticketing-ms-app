import { OrderCancelledEvent, Publisher, Subjects } from '@ticketing-lr/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}