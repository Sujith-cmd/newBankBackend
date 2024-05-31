import mongoose from "mongoose";
const Schema=mongoose.Schema
const userSchema= new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    accountNum:{
        type:Number,
        unique:true
    },
    accountBal:{
        type:Number,
        required:true
    },
    history:[{
        type:mongoose.Types.ObjectId,
        ref:"Transaction",
        default:[]
    }]
})

export default mongoose.model("User",userSchema)