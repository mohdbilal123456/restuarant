import mongoose from 'mongoose'

const connectDb = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI as string,{
      dbName:"restaurant-db"
    });
    console.log("Connect to MongoDB")
  } catch (error) {
    console.log(error)
  }
}

export default connectDb