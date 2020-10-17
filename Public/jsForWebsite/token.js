
async function getToken(id){
   console.log(id)
  tokenField = document.getElementById(`${id}`);
  tokenField.innerHTML = "This is Your Token";
  tokenField.style.display = "block";
  try {
    var token;
    fetch(`http://127.0.0.1:3000/accept/${id}`,{
         method:'POST'
    }).then(response => response.json()) // parse JSON from request
          .then(resultData => {
            console.log(resultData.tokenForFood)
            token=resultData.tokenForFood;
            tokenField = document.getElementById(`${id}`);
            tokenField.innerHTML = `Your Token :- ${resultData.tokenForFood}`;
               tokenField.style.display = "block";
          })
    // http://127.0.0.1:3000
    
    // if (response.data.status == 'success') {
    //    console.log(response.data)
    // }
} catch (err) {
    console.log(err.response)
    alert(err.response.data.msg)
}
}
