import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connected to nats");

  const pub = new TicketCreatedPublisher(stan);

  await pub.publish({
    id: '123',
    title: '321',
    price: 1223,
  });
});

stan.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

stan.on("close", () => {
  console.log("nats connection closed");

  process.exit();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());