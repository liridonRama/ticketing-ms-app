import { ExpirationCompleteEvent, Publisher, Subjects } from '@ticketing-lr/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}