import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketing-lr/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}