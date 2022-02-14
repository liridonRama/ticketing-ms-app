import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async () => {
  const ticket1 = Ticket.build({
    title: 'hi',
    price: 1,
    userId: 'some id',
  });

  await ticket1.save();

  const ticket2 = await Ticket.findById(ticket1.id);
  const ticket3 = await Ticket.findById(ticket1.id);

  ticket2!.set({ price: 10 });

  ticket3!.set({ price: 15 });

  await ticket2!.save();

  try {
    await ticket3!.save();
  } catch (error) {
    expect(error).toBeDefined();
  }
});


it('increments the version numbers on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'hi',
    price: 1,
    userId: 'some id',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});