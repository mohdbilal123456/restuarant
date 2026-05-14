import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId,
  name: string,
  description: string,
  image?: string,
  price:string,
  isAvailable: boolean,
  createdAt: Date,
  updatedAt: Date,
}

const schema = new mongoose.Schema({

  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isAvailable:{
    type:Boolean,
    default:true
  }

}, { timestamps: true })

export default mongoose.model<IMenuItem>("MenuItem",schema)