

const catchAsync = require('./../errorHandling/cathError');

const appError = require('./../errorHandling/ErrorFormate');
const Donor = require('../schema/donor');
const Receiver = require('../schema/receiver');
const Ngo = require('../schema/ngo');
const Email=require('./email');
const crypto=require('crypto');


exports.adduser = catchAsync(async (req, res, next) => {
     const user={};
     var doc={};
    
     if(req.body.user=='donor'){
       
        if(req.body.password.toString()!=req.body.confirm_password.toString()){
            return next(new appError('Password is not same as Confirm password',400));
        };
        user.first_name=req.body.first_name;
        user.last_name=req.body.last_name;
        user.email=req.body.email;
        user.address=req.body.address;
        user.password=req.body.password;
        user.adharcard_no=req.body.adharcard_no;
        user.area=req.body.area;
        user.pincode=req.body.pincode
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.checkToken=verificationToken;
        user.mobile=req.body.mobile;
      
         doc = await Donor.create(user);
         
         await  new Email(doc,`${req.protocol}://${req.get('host')}/${'donor'}/${doc.id}/${verificationToken}`,'none').verificationMail()
        
     }
    else if(req.body.user=='receiver'){
        if(req.body.password!=req.body.confirm_password){
            return next(new appError('Password is not same as Confirm password',400));
        };
        user.first_name=req.body.first_name;
        user.last_name=req.body.last_name;
        user.email=req.body.email;
        user.address=req.body.address;
        user.password=req.body.password;
        user.adharcard_no=req.body.adharcard_no;
        
        user.area=req.body.area;
        user.pincode=req.body.pincode
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.checkToken=verificationToken;
        user.mobile=req.body.mobile;
        doc = await Receiver.create(user);
        await  new Email(doc,`${req.protocol}://${req.get('host')}/${'receiver'}/${doc.id}/${verificationToken}`,'none').verificationMail()
     }
     else if(req.body.user=='ngo'){
        if(req.body.password!=req.body.confirm_password){
            return next(new appError('Password is not same as Confirm password',400));
        };
        user.name=req.body.name;
        user.managing_person=req.body.managing_person;
        user.email=req.body.email;
        user.address=req.body.address;
        user.password=req.body.password;
        user.adharcard_no=req.body.adharcard_no;
      user.area=req.body.area;
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.checkToken=verificationToken;
       user.pincode=req.body.pincode
        user.no_of_person=req.body.no_of_person;
        user.mobile=req.body.mobile;
         doc=await Ngo.create(user);
         console.log('ngo done')
         await  new Email(doc,`${req.protocol}://${req.get('host')}/${'ngo'}/${doc.id}/${verificationToken}`,'none').verificationMail()
     }

  

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    })
});

exports.login=catchAsync(async(req,res,next)=>{
    if(req.body.user=='donor'){
        const email=req.body.email;
        const password=req.body.password
        if (!email || !password) { return next(new appError('please  id or password', 400)) };
        const user = await Donor.findOne({ email:email }).select('+password')
        // console.log(await user.CheckedPassword(password, user.password)) 
  
        if (!user || !await user.CheckedPassword(password, user.password)) return next(new appError('you enter wrong id or password', 400));
            if(user.active==false){
                return next(new appError('Your account has not verified, Please verify first'))
            }
         req.donor=user
        
         res.status(200).json({
             status:'success',
             user:'donor',
             donor:user
         })
       
    }
    else if(req.body.user=='receiver'){
        const email=req.body.email;
        const password=req.body.password
        if (!email || !password) { return next(new appError('please  id or password', 400)) };
        const user = await Receiver.findOne({ email:email }).select('+password')
        // console.log(await user.CheckedPassword(password, user.password)) 
        if (!user || !await user.CheckedPassword(password, user.password)) return next(new appError('you enter wrong id or password', 400));
        if(user.active==false){
            return next(new appError('Your account has not verified, Please verify first'))
        } 
        req.receiver=user

         res.status(200).json({
             status:'success',
             receiver:user,
             user:'receiver'
         })
       
    }
    else if(req.body.user=='ngo'){
        const email=req.body.email;
        const password=req.body.password
        if (!email || !password) { return next(new appError('please  id or password', 400)) };
        const user = await Ngo.findOne({ email:email }).select('+password')
        // console.log(await user.CheckedPassword(password, user.password)) 
        console.log(user)
        if (!user || !await user.CheckedPassword(password, user.password)) return next(new appError('you enter wrong id or password', 400));
        if(user.active==false){
            return next(new appError('Your account has not verified, Please verify first'))
        } 
        req.ngo=user
         res.status(200).json({
             status:'success',
             ngo:user,
             user:'ngo'
         })
    }
})


exports.CheckVerification=catchAsync(async(req,res,next)=>{
     const userid=req.params.userId;
     const type=req.params.type;
     const token=req.params.token;
   if(type=='donor'){
     const user= await Donor.findById(userid);
     
     if(!user)return next(new appError('Please check your register email and try again',400))
     if(user.checkToken!=token)return next(new appError('Token is invalid',400))
     user.checkToken=null;
     user.active=true;
     await user.save();

   }else if(type=='receiver'){
       console.log(token)
    const user=await Receiver.findById(userid);
    console.log(user)
    if(!user)return next(new appError('Please check your register email and try again',400))
    if(user.checkToken!=token)return next(new appError('Token is invalid',400))
    user.checkToken=null;
    user.active=true;
    await user.save();
    

   }else if(type=='ngo'){
    const user= await Ngo.findById(userid);
    if(!user)return next(new appError('Please check your register email and try again',400))
    if(user.checkToken!=token)return next(new appError('Token is invalid',400))
    user.checkToken=null;
    user.active=true;
    await user.save();
    
   }
   res.redirect('/loginpage');

})