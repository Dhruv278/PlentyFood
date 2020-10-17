const mongoose =require("mongoose");
const bcrypt=require('bcryptjs')

const Receiverschema=mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        require: [true, 'email is must require'],
        lowercase: true,
        unique: true,
        validate:{
            validator: function(el) {
                return el.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
              },
              message: 'plaese use valid email id'
        }
    },
    address:String,
    password:String,
    adharcard_no:Number,
    mobile:Number,
    area:String,
    pincode:Number,
    checkToken:String,
    active:{
        type:Boolean,
        default:false
    }

});
Receiverschema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,8);
    
    next()
});
Receiverschema.methods.CheckedPassword = async(enterpassword,userpassword)=>{
    
    return await bcrypt.compare(enterpassword,userpassword)

}
const Receiver=mongoose.model('Receiver',Receiverschema);
module.exports=Receiver;