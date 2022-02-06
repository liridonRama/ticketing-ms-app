import { Subjects } from './subjects';

export interface TicketupdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  }
}