const fs=require('fs');
const express=require('express');
const mongoose=require('mongoose')
const globalerror=require('./errorHandling/GlobalError')
const app=express();
const path=require('path');
const usercontroller=require('./controllers/user');
const foodcontroller=require('./controllers/food');
const ngocontroller=require('./controllers/ngo');
const viewcontroller=require('./controllers/viewControll');

const dotenv=require('dotenv')
const cookieparser=require('cookie-parser')
app.use(cookieparser())
dotenv.config({path:'./config.env'});
const db=process.env.DATABASE;
mongoose.connect(db,{ 
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));




app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname,'Public')))
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views/'));
app.post('/Checktoken/:donorId',foodcontroller.checkToken);
app.get('/dsahbord/donor/:donorid',foodcontroller.getfoodbyuserId);
app.get('/dsahbord/receiver/:receiverid',foodcontroller.getallfood)
app.get('/dsahbord/receiver/:receiverid/:pincode',foodcontroller.getFoodbyPincode)
app.get('/dsahbord/ngo/:ngoid',foodcontroller.getallfoodForNgo)
app.get('/dsahbord/:pincode',foodcontroller.getFoodbyPincode)
app.post('/register',usercontroller.adduser);

app.post('/addfood/:donorid',foodcontroller.createFood);
app.get('/allFood',foodcontroller.getallfood);
app.post('/accept/:foodid',foodcontroller.acceptFood)
app.get('/food/receiver/:receiverid/:foodid',foodcontroller.getfoodbyid)

app.post('/login',usercontroller.login);
app.post('/getAllNgos',ngocontroller.getAllNgo);
app.get('/:type/:userId/:token',usercontroller.CheckVerification)
app.get('/deletefood/:foodid',foodcontroller.Deletefood);

app.get('/signuppage',viewcontroller.signup);
app.get('/loginpage',viewcontroller.loginpage);
app.get('/ngopage',viewcontroller.ngoRegister);
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})
// setInterval(()=>{
//     foodcontroller.DeletefoodFOrExpire();
//     foodcontroller.checkTokenExpire();
    
// },1000*60*60)
app.use(globalerror)

const port=process.env.PORT ||3000;

const server=app.listen(port,()=>{
    console.log(`server is listing on port ${port}`);
})