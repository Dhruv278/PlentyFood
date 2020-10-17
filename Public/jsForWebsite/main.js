import '@babel/polyfill'
import axios from 'axios'


if(document.getElementById('registerform')){
    document.getElementById('submitbutton').addEventListener('click',(e)=>{
        e.preventDefault();
        const user={};
        user.first_name=document.getElementById('fisrtname').value;
        user.last_name=document.getElementById('lastname').value;
        user.password=document.getElementById('password').value;
        user.confirm_password=document.getElementById('confirm_password').value;
        user.email=document.getElementById('email').value;
        user.mobile=document.getElementById('mibile_no').value;
        user.address=document.getElementById('address').value;
        user.area=document.getElementById('area').value;
        user.pincode=document.getElementById('pincode').value;
        user.adharcard_no=document.getElementById('adharcard').value;

        if(document.getElementById('donor').checked){
            user.user='donor'
        }else{
            user.user='receiver'
        };
      register(user)
    })
}
if(document.getElementById('ngoform')){
    document.getElementById('submit').addEventListener('click',(e)=>{
        e.preventDefault();
        const user={};
        user.name=document.getElementById('name').value;
        user.managing_person=document.getElementById('mname').value;
        user.password=document.getElementById('password').value;
        user.confirm_password=document.getElementById('confirm_passowrd').value;
        user.email=document.getElementById('email').value;
        user.no_of_person=document.getElementById('noofperson').value;
        user.mobile=document.getElementById('mobile_no').value;
        user.address=document.getElementById('address').value;
        user.area=document.getElementById('area').value;
        user.pincode=document.getElementById('pincode').value;
       user.user='ngo'

//  console.log(user);       
      register(user)
    })
}


if(document.getElementById('login')){
    document.getElementById('submitLogin').addEventListener('click',(e)=>{
        e.preventDefault();
        const user={};
    
        user.password=document.getElementById('passwordlogin').value;
       
        user.email=document.getElementById('emaillogin').value;
      

        if(document.getElementById('donorlogin').checked){
            user.user='donor'
        }else if(document.getElementById('receiverlogin').checked){
            user.user='receiver'
        }else if(document.getElementById('ngologin').checked){
            user.user='ngo'
        };
      login(user)
    })
}
if(document.getElementById('foodpage')){
    document.getElementById('submit').addEventListener('click',(e)=>{
      e.preventDefault();
      const food={};
      food.name=document.getElementById('foodName').value;
      food.address=document.getElementById('Address').value;
      food.area=document.getElementById('Area').value;
      food.expire_time=document.getElementById('expire_time').value;
      food.pincode=document.getElementById('Pincode').value;
      food.no_of_person=document.getElementById('People').value;
      const food_id=document.getElementsByTagName('form')[0].id
      console.log(food_id)
     if(document.getElementById('veg').checked){
         food.food_type='veg'
     }else{
         food.food_type='non-veg';
     }
     addFood(food,food_id);
    })
  
    
}

if(document.getElementById('submittoken')){
    document.getElementById('submittoken').addEventListener('click',(e)=>{
        e.preventDefault();
        const id=document.getElementsByTagName('form')[0].id
        const token=document.getElementById('tokennumber').value ;
        sendtoken(id,token);

    })
}

const login = async (user) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/login',
            data: user
        })
        // http://127.0.0.1:3000
        console.log(res.data.status)
        if (res.data.status == 'success') {
            console.log(res.data.donor)
            if(res.data.user=='donor'){
                  console.log('work')
                window.setTimeout(() => {
                    location.assign(`/dsahbord/donor/${res.data.donor._id}`);
                    
                }, 0)
            }
            else if(res.data.user=='receiver'){
               console.log('working')
                window.setTimeout(() => {
                    location.assign(`/dsahbord/receiver/${res.data.receiver._id}`);
                }, 0)
            }
           else if(res.data.user=='ngo'){
              
                window.setTimeout(() => {
                    location.assign(`/dsahbord/ngo/${res.data.ngo._id}`);
                }, 0)
            }
        }
    } catch (err) {
        console.log(err.response)
        alert(err.response.data.msg)
    }
}
const register = async (user) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/register',
            data: user
        })
        // http://127.0.0.1:3000
        console.log(res.data.status)
        if (res.data.status == 'success') {
            alert('Please verify your account , we send verification mail ')
            window.setTimeout(() => {
                location.assign('/loginpage');
            }, 0)
        }
    } catch (err) {
        console.log(err.response)
        alert(err.response.data.msg)
    }
}
const addFood = async (food,id) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `http://127.0.0.1:3000/addfood/${id}`,
            data: food
        })
        // http://127.0.0.1:3000
        console.log(res.data.status)
        if (res.data.status == 'success') {
            location.reload();
        }
    } catch (err) {
        console.log(err.response)
        alert(err.response.data.msg)
    }
}
const sendtoken = async (id,token) => {
    try {
        console.log(id,token)
        const res = await axios({
            method: 'POST',
            url: `http://127.0.0.1:3000/Checktoken/${id}`,
            data: {
                token,
            }
        })
        // http://127.0.0.1:3000
        console.log(res.data)
        if (res.data.status == 'success') {
           alert(res.data.message)
           if (res.data.status == 'success') {
            location.reload();
        }

        }
    } catch (err) {
        console.log(err.response.data)
        alert(err.response.data.msg)
    }
}

function getToken(){
    console.log('working function')
    // tokenField = document.getElementById(`${id}`);
    // tokenField.innerHTML = "This is Your Token";
    // tokenField.style.display = "block";
}
if(document.getElementById('pincodeForm')){
    document.getElementById('submitPincode').addEventListener('click',(e)=>{
        e.preventDefault()
        const pincode = document.getElementById('pincodefeild').value;
        console.log(window.location.href);
        window.setTimeout(() => {
            location.assign(`http://127.0.0.1:3000/dsahbord/${pincode}`);
        }, 0)
        
    })
}