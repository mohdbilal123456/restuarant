import mongoose,{Schema,Document} from "mongoose";


export interface IAddress extends Document{
  userId:string,
  mobile:number,

  formattedAddress:string,

  location:{
    type:"Point",
    coordinates:[number,number]
  };
  createdAt:Date,
  updatedAt:Date
}


const schema = new Schema<IAddress>({
  userId:{
    type:String,
    required:true
  },
  mobile:
},{timestamps:true})