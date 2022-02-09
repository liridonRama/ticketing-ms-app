import { Publisher, Subjects, TicketupdatedEvent } from '@ticketing-lr/common';

export class TicketUpdatedPublisher extends Publisher<TicketupdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}