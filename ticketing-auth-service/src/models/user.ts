
import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';


// an interface that describes the properties that are required
interface UserAttrs {
  email: string;
  password: string;
}


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// an interface that describes the properties that a user model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

userSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
    
    done();
  }
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };