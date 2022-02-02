import request from 'supertest';
import { app } from '../../app';

const createTicket = () => request(app).post("/api/tickets").set('Cookie', global.signin()).send({
  title: 'asdf',
  price: Math.random() * 100
})

it('can fetch a list of tickets', async () => {
  Promise.all([
    createTicket(),
    createTicket(),
    createTicket(),
  ]);

  const res = await request(app).get('/api/tickets').send().expect(200)

  expect(res.body.length).toEqual(3);
})