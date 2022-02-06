import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), { url: 'http://localhost:4222' });

stan.on("connect", () => {
  console.log("Listener connected");

  const options = stan.subscriptionOptions().setManualAckMode(true);

  const sub = stan.subscribe("ticket:created", 'orders-service-queue-group', options);

  sub.on("message", (msg: Message) => {

    const data = msg.getData() as string;

    console.log(`Received event #${msg.getSequence()}, with data: ${data}`)

    msg.ack();
  });
});

stan.on("close", () => {
  console.log("nats connection closed");

  process.exit();
})

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());