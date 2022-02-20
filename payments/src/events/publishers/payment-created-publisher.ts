import { Publisher, PaymentCreatedEvent, Subjects } from '@ticketing-lr/common';


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}