const  mongoose=require('mongoose');

const EnquirySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    enquiry:{
        type:String,
        required:true
    }
})

const Enquiry=mongoose.model('Enquiry',EnquirySchema);
module.exports=Enquiry;