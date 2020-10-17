const mongoose =require("mongoose");
const bcrypt=require('bcryptjs')

const Donorschema=mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        require: [true, 'email is must require'],
        lowercase: true,
        unique: [true,'this email id already exists'],
        validate:{
            validator: function(el) {
                return el.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
              },
              message: 'plaese use valid email id'
        }
    },
    address:String,
    password:String,
    area:String,
    pincode:Number,
    adharcard_no:Number,
    score:
    {
        type:Number,
        default:0
    },
    mobile:Number,
    checkToken:String,
    
    active:{
        type:Boolean,
        default:false
    }

});
Donorschema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,8);
    
    next()
});
Donorschema.methods.CheckedPassword = async(enterpassword,userpassword)=>{
    
    return await bcrypt.compare(enterpassword,userpassword)

}
const Donor=mongoose.model('Donor',Donorschema);
module.exports=Donor;