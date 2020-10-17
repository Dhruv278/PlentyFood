const mongoose =require("mongoose");
const bcrypt=require('bcryptjs')
const Ngoschema=mongoose.Schema({
   name:String,
   managing_person:String,
    email:{
        type:String,
        require: [true, 'email is must require'],
        unique: true,
        validate:{
            validator: function(el) {
                return el.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
              },
              message: 'plaese use valid email id'
        }
    },
    address:String,
    mobile:Number,
    password:String,
    no_of_person:Number,
    checkToken:String,
    area:String,
    pincode:Number,
    active:{
        type:Boolean,
        default:false
    }
  
});
Ngoschema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,8);
    
    next()
});
Ngoschema.methods.CheckedPassword = async(enterpassword,userpassword)=>{
    
    return await bcrypt.compare(enterpassword,userpassword)

}

const Ngo=mongoose.model('Ngo',Ngoschema);
module.exports=Ngo;