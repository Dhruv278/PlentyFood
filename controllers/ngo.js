
const catchAsync = require('./../errorHandling/cathError');

const appError = require('./../errorHandling/ErrorFormate');
const Donor = require('../schema/donor');
const Receiver = require('../schema/receiver');
const Ngo = require('../schema/ngo');
const Email=require('./email');
const crypto=require('crypto');


exports.getAllNgo=catchAsync(async(req,res,next)=>{
    const ngos=await Ngo.find();
    res.status(200).json({
        status:'succes',
        ngos,
    })
})