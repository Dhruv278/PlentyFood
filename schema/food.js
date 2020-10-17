const mongoose =require("mongoose");
const bcrypt=require('bcryptjs')

const Foodschema=mongoose.Schema({
    name:String,
    donor_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Donor',
    },
    email:{
        type:String,
        require: [true, 'email is must require'],
        lowercase: true,
       
        validate:{
            validator: function(el) {
                return el.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
              },
              message: 'plaese use valid email id'
        }
    },
    address:String,
    area:String,
    pincode:Number,
    no_of_person:Number,
    receiver_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Receiver',
    },
    creatAt:{
     type:Date,
     default:Date.now()
    },
    food_type:{
        type: String,
        require:true,
        enum: {
            values: ['veg','non-veg'],
            message: 'Enter your food type like veg or non-veg'
        }
    },
    mobile:Number,
    token_expire_at:Number,
    expire_time:Number,
    panding:{
        type:Boolean,
        default:false
    },
    token:String

});

const Food=mongoose.model('Food',Foodschema);
module.exports=Food;