import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}



export abstract class Publisher<T extends Event> {
  abstract readonly subject: T['subject'];

  constructor(protected readonly client: Stan) { }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`message published: ${this.subject}`)
      this.client.publish(this.subject, JSON.stringify(data), (err) => !!err ? reject(err) : resolve());
    });
  }
}