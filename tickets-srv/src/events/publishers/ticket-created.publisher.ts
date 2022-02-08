import { Publisher, Subjects, TicketCreatedEvent } from '@ticketing-lr/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}