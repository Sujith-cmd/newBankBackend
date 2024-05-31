import mongoose from "mongoose";
const Schema=mongoose.Schema
const transactionSchema= new Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        
    }
    
    },{timestamps:true}
)

export default mongoose.model("Transaction",transactionSchema)