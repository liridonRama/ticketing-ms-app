import request from 'supertest';
import { Ticket } from '../../../models/tickets';
import { app } from '../../app';

describe('POST /api/tickets', () => {
  it('has a router handler listening to /api/tickets', async () => {
    const res = await request(app).post('/api/tickets').send({});

    expect(res.status).not.toEqual(404)
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const res = await request(app).post('/api/tickets').set('Cookie', signin())
      .send({});

    expect(res.status).not.toEqual(401)
  });

  it('returns an error if an invalid title is provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: '', price: 10 }).expect(400);
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ price: 10 }).expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: 'asd', price: -10 }).expect(400);
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: 'asd' }).expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: 'asd', price: 50 }).expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
  });
});