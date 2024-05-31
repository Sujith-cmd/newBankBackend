import User from "../schema/userSchema.js"
import transactionSchema from "../schema/transactionSchema.js"
import bcrypt from "bcrypt"
  export const signup=async(req,res,next)=>{
    // console.log(req.body);
    const{username,email,password}=req.body
    // let existingUser
    let existingUser
    console.log("exist",existingUser);
    try {
        existingUser=await User.findOne({email})
    } catch (error) {
        return console.log(error)
    }
    if(existingUser.username==username){
        console.log(existingUser);
        return res.status(400).json({message:"email already exists"})
    }

    const saltRounds = 10; 
const hashedPass = bcrypt.hashSync(password, saltRounds);
    // const hashedPass=bcrypt.hashSync(password,10)
    const date=Date.now()
    const newUser=new User({
        username,
        email,
        password:hashedPass,
        accountNum:date,
        accountBal:1000
    })
  try {
    await newUser.save()
    return res.status(201).json({message:"user created"})
  } catch (error) {
    return console.log(error);
  }
  }
export const login=async(req,res)=>{
const {email,password}=req.body
let match=null
try {
    match=await User.findOne({email})
} catch (error) {
//   return res.status(500).json({message:"login internal error"})
return console.log(error);
}
if (match==null||match==undefined) {
 return res.status(404).json({message:"no user found"})   
}
let check=bcrypt.compareSync(password,match.password)
if(check){
    return res.status(200).json({message :"login successful",user:match})
}
    return res.status(400).json({message:"invalid user/password"})

}


export const userTransfer = async (req, res) => {
    const { id, amount } = req.params;
    const { transferId } = req.body;

    if (!id || !amount || !transferId) {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    const amountValue = parseInt(amount);

    if (isNaN(amountValue) || amountValue <= 0) {
        return res.status(400).json({ message: "Invalid transfer amount" });
    }

    try {
        const sender = await User.findByIdAndUpdate(id, { $inc: { accountBal: -amountValue } });
        const receiver = await User.findByIdAndUpdate(transferId, { $inc: { accountBal: amountValue } });

        const history = new transactionSchema({
            sender: id,
            receiver: transferId,
            amount: amountValue
        });

        const transactionHistory = await history.save();
        sender.history.push(transactionHistory._id);
        receiver.history.push(transactionHistory._id);
        await sender.save();
        await receiver.save();

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error("Transfer error:", error);
        return res.status(500).json({ message: "Transfer failed" });
    }
};


export const search=async (req,res)=>{
    const search=req.params.search
    
    // const{transferId}=req.body
    try {
        
         const searchResult=await User.find({username:{$regex:search,$options:'i'}})
   
         if(searchResult==null){
             return res.status(200).json({message:"No search results"})
         }else{
             return res.status(200).json({users:searchResult})
     
         }
        }
     catch (error) {
        console.log(error);
        return res.status(500).json({message:"some searchError"})
    }
    res.status(200).json({message:"transfer successfully"})
}

export const listUsers=async (req,res)=>{
    const userId=req.params.id
try {
        
         const allUsers=await User.find({_id:{$ne:userId}})
        //  const searchResult=await User.find({username:{$regex:search,$options:'i'}})
   
         if(allUsers.length==0){
             return res.status(200).json({message:"No users to show"})
         }else{
             return res.status(200).json({users:allUsers})
     
         }
        }
     catch (error) {
        console.log(error);
        return res.status(500).json({message:"some listing error"})
    }
    
}