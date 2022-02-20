import { OrderStatus } from '@ticketing-lr/common';
import mongoose, { Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttrs {
  id: string;
  price: number;
  version: number;
  userId: string;
  status: OrderStatus;
}

interface OrderDoc extends Document {
  price: number;
  version: number;
  userId: string;
  status: OrderStatus;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);