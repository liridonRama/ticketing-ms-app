import nats from "node-nats-streaming";


console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("publisher connected to nats");

  const data = {
    id: '123',
    title: '123',
    price: 20
  }

  stan.publish("ticket:created", JSON.stringify(data), () => console.log("Event published"))
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