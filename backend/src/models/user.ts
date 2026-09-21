import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: {
    token: string;
  }[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Ё-мое',
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  tokens: {
    type: [
      {
        token: String,
      },
    ],
    select: false,
  },
});

export default model<IUser>('user', userSchema);
