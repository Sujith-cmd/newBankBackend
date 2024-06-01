import User from "../schema/userSchema.js"
import Transaction from "../schema/transactionSchema.js"

export const listUsers=async (req,res)=>{
    try {
   
        
         const allUsers=await User.find()
         const allTrans=await Transaction.find()
         let total=0
         for (const iterator of allTrans) {
            total+=iterator.amount
         }
        
         if(allUsers.length==0){
             return res.status(204).json({message:"No users to show"})
         }
         if(allTrans.length===0){
             return res.status(204).json({message:"no trans to show"})
             
            }
            return res.status(200).json({allUsers,total})

        }
     catch (error) {
        console.log(error);
        return res.status(500).json({message:"some adminlisting error"})
    }
    

}

export const blockUser=async (req,res)=>{
    const id=req.params.id
    try {
       
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({msg: "no usrs"});
          }
       
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { access: !existingUser.access },
          { new: true }
        );
        
               
        // // const users=await User.updateMany({},{$set:{access:true}})
        const users=await User.find({})
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({msg:"some error"})
    }

}