import { Schema, model, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, "Поле title обязательно"],
    unique: true,
    minlength: [2, "Минимальная длина title - 2 символа"],
    maxlength: [30, "Максимальная длина title - 30 символов"],
  },

  image: {
    fileName: {
      type: String,
      required: [true, "Поле fileName обязательно"],
    },

    originalName: {
      type: String,
      required: [true, "Поле originalName обязательно"],
    },
  },

  category: {
    type: String,
    required: [true, "Поле category обязательно"],
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    default: null,
  },
});

export default model<IProduct>("product", productSchema);
