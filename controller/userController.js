import User from "../schema/userSchema.js"
import transactionSchema from "../schema/transactionSchema.js"
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/generateToken.js"

  export const signup=async(req,res,next)=>{
    // console.log(req.body);
    const{username,email,password}=req.body
    // let existingUser
    let existingUser
    try {
        existingUser=await User.findOne({email})
    } catch (error) {
        return console.log(error)
    }
    // console.log("exist",existingUser);
    if(existingUser){
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
    // generateTokenAndSetCookie(newUser._id,res)
  try {
    await newUser.save()
    return res.status(201).json({message:"user created"})
  } catch (error) {
    return console.log(error);
  }
  }
// export const login=async(req,res)=>{
// const {email,password}=req.body
// let match=null
// try {
//     match=await User.findOne({email})
// } catch (error) {
// //   return res.status(500).json({message:"login internal error"})
// return console.log(error);
// }

// if (match==null||match==undefined) {
//  return res.status(404).json({message:"no user found"})   
// }
// let check=bcrypt.compareSync(password,match.password)
// if(check){
//     if(match.access==false){
//         return res.status(401).json({message:"access denied"})   
    
//     }
//     return res.status(200).json({message :"login successful",user:match})
// }
//     return res.status(400).json({message:"invalid user/password"})

// }
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const match = await User.findOne({ email });
  
      // Check if user exists
      if (!match) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user has access
      if (!match.access) {
        return res.status(401).json({ message: "Access denied" });
      }
  
      // Verify the password
      const isPasswordCorrect = bcrypt.compareSync(password, match.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    //   generateTokenAndSetCookie(match._id,res)
      // Login successful
      return res.status(200).json({ message: "Login successful", user: match });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


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


export const transactions=async (req,res)=>{
    // const userId="665447cb61c0bca41ec8c1f2"
    const userId=req.params.id
try {
    const currentUser = await transactionSchema.find({
        $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender').populate('receiver')
      
            if(currentUser.length==0){
                return res.status(400).json({message:"No users to show"})
            }else{
                return res.status(200).json({users:currentUser})
        
            }
      
      
        
        
        }
     catch (error) {
        console.log(error);
        return res.status(500).json({message:"some listing error"})
    }
    
}