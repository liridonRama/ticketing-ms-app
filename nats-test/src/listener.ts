import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), { url: 'http://localhost:4222' });

stan.on("connect", () => {
  console.log("Listener connected");

  new TicketCreatedListener(stan).listen();
});

stan.on("close", () => {
  console.log("nats connection closed");

  process.exit();
})

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());