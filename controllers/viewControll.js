
const catchAsync = require('./../errorHandling/cathError');

const appError = require('./../errorHandling/ErrorFormate');
const Donor = require('../schema/donor');
const Receiver = require('../schema/receiver');
const Ngo = require('../schema/ngo');
const Email=require('./email');


exports.loginpage=catchAsync(async(req,res,next)=>{
    res.status(200).render('login')
})
exports.signup=catchAsync(async(req,res,next)=>{
    res.status(200).render('signup')
})

exports.ngoRegister=catchAsync(async(req,res,next)=>{
    res.status(200).render('ngo')
})