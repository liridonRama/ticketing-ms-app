
import { OrderStatus } from '@ticketing-lr/common';
import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns 404 when trying to purchase order that does not exist', async () => {
  await request(app)
    .post("/api/payments")
    .set('Cookie', global.signin())
    .send({ token: 'asdasddsa', orderId: new Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns a 401 when purchasing a order that does not belong to a user', async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set('Cookie', global.signin())
    .send({ token: 'asdasddsa', orderId: order.id })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set('Cookie', global.signin(userId))
    .send({ token: 'asdasddsa', orderId: order.id })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalledWith({ source: 'tok_visa', amount: order.price * 100, currency: 'usd' });

  const payment = await Payment.findOne({
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
});
