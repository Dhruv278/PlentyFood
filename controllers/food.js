const { promisify } = require('util')
const catchAsync = require('./../errorHandling/cathError');
const jwt = require('jsonwebtoken');
const appError = require('./../errorHandling/ErrorFormate');
const Donor = require('../schema/donor');
const Receiver = require('../schema/receiver');
const Ngo = require('../schema/ngo');
const Email=require('./email');
const Food = require('../schema/food');


exports.createFood = catchAsync(async (req, res, next) => {
    const id=req.params.donorid;
    // console.log(id)
    const user =await Donor.findById(id);
    // console.log(user)
    if (!user) return next(new appError(`You don't reister yourself as donor with this email id so `), 400);

    const food = {};
    food.donor_id =id;
    food.name = req.body.name;
    food.address = req.body.address;
    food.no_of_person=req.body.no_of_person;
    food.food_type = req.body.food_type;
    food.mobile = req.body.mobile;
    food.email = user.email;
    food.area=req.body.area;
    food.expire_time = req.body.expire_time;
    food.pincode = req.body.pincode
    const newfood = await Food.create(food);
    await sendmailToreceiever(req,newfood,newfood.id)

    res.status(200).json({
        status: 'success',
        newfood,
    })

})


exports.getallfood = catchAsync(async (req, res, next) => {
    const foods = await Food.find().populate('donor_id');
    // console.log(foods)
    const Allfoods = [];
    foods.forEach((food) => {
        if (food.panding == false) {
            Allfoods.push(food);
        }
    })
    res.status(200).render('receiver',{
        Allfoods,
    })
})
exports.getallfoodForNgo = catchAsync(async (req, res, next) => {
    const foods = await Food.find().populate('donor_id');
    const nid=req.params.ngoid;
    const ngo=await Ngo.findById(nid)
    // console.log(foods)
    const Allfoods = [];
    foods.forEach((food) => {
        if (food.panding == false) {
            if(food.no_of_person>=ngo.no_of_person){
                Allfoods.push(food);
            }
        }

    })
    res.status(200).render('receiver',{
        Allfoods,
    })
})

exports.getfoodbyuserId = catchAsync(async (req, res, next) => {
    const userid = req.params.donorid;
   const user=await Donor.findById(userid)
    const foods = await Food.find({ donor_id:userid })
    res.status(200).render('donor.pug',{
        foods,
        user
    })

})

exports.getfoodbyid = catchAsync(async (req, res, next) => {
    const foodid = req.params.foodid;
    const food = await Food.findById(foodid)
    const donor=await Donor.findById(food.donor_id);
    // console.log(food,donor);
    res.status(200).render('singlefood',{
        food,
        donor
    })
   
})

exports.acceptFood = catchAsync(async (req, res, next) => {
    const foodid = req.params.foodid;
 
    const food = await Food.findById(foodid);
    var tokenForFood = Math.floor(10000 + Math.random() * 90000);
    // tokenForFood = JSON.stringify(Date.now() + 2 * 60 * 60 * 1000);
    food.token = tokenForFood;
    food.token_expire_at=Date.now();
    food.panding = true;
    await food.save();
    res.status(200).json({
        status: 'success',
        tokenForFood,
    })

})

exports.Deletefood = catchAsync(async (req, res, next) => {
    const foodid = req.params.foodid;
    // console.log(foodid)
//    food= await Food.findById(foodid);
//    console.log(food);
//    user=await Donor.findById(food.donor_id);
   await Food.findByIdAndDelete(foodid);

    res.redirect(`/loginpage`)

})


exports.DeletefoodFOrExpire = async () => {
    const foods = await Food.find();
    foods.forEach(async (food) => {
        var date = new Date(food.creatAt); // some mock date
        var milliseconds = date.getTime();

        // console.log(food.expire_time*60*60*1000)
        // console.log((food.creatAt.getMilliseconds()+food.expire_time*60*60*1000)<=Date.now())
        if ((milliseconds + food.expire_time * 60 * 60 * 1000) <= Date.now()) {
            await Food.findOneAndDelete(food.id);
        }
    })
}

exports.checkToken = catchAsync(async (req, res, next) => {
//    console.log('working')
    const donorid = req.params.donorId;
    const token = req.body.token
    const food = await Food.find({token:token});
    if(food.length==0)return next(new appError('Token has been invalid or expired',400))
   const  donor = await Donor.findById(donorid);
        
    if (food[0].donor_id.toString() !== donorid.toString()) return next(new appError('Token has been invalid or expired',400))
    donor.score = donor.score + 1;
    await Food.findByIdAndDelete(food[0].id);
    await donor.save();
    res.status(200).json({
        status:'success',
        message: 'Token is correct so  you can give food to receiver'
    })

})
exports.getFoodbyPincode=catchAsync(async(req,res,next)=>{
 const  pincode=req.params.pincode;
    const foods = await Food.find().populate('donor_id');
    const Allfoods = [];
    foods.forEach((food) => {
        if (food.panding == false) {
            if(food.pincode==pincode)
            Allfoods.push(food);
        }
    })
    res.status(200).render('receiver',{
        Allfoods,
    })

})
exports.checkTokenExpire = async () => {
    const foods = await Food.find();
    foods.forEach(async (food) => {

        if (food.panding == true) {

            if ((food.token_expire_at + 1 * 60 * 60 * 1000) <= Date.now()) {
               food.token=null;
               food.panding=false;
               await food.save();
            }
        }
        // console.log(food.expire_time*60*60*1000)
        // console.log((food.creatAt.getMilliseconds()+food.expire_time*60*60*1000)<=Date.now())
    })
    }

    const sendmailToreceiever=async(req,food,foodid)=>{
      const receivers=await Receiver.find({area:food.area});
         
      receivers.forEach(async(receiver)=>{
          await  new Email(food,`${req.protocol}://${req.get('host')}/food/${'receiver'}/${receiver.id}/${foodid}`,food.name).welcomeMail()

      })

    }