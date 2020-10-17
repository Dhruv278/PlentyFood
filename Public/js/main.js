function event_chk() {
        var email = document.getElementById("email").value;
        var pwd = document.getElementById("pwd").value;
     

        if (email == "") {
            alert("Enter email....");
            document.getElementById("email").focus();
            return false;
        }

        if (pwd == "") {
                alert("Enter Password..");
                document.getElementById("pwd").focus();
                return false;
        }

      
        return true;
    }



    function form() {
        var ename = document.getElementById("ename").value;
        var econame = document.getElementById("econame").value;
        var edate = document.getElementById("edate").value;
        var edetail = document.getElementById("edetail").value;
        var imgfile = document.getElementById("imgfile").value;

        if (ename == "") {
            alert("Enter Event name....");
            document.getElementById("ename").focus();
            return false;
        }

        if (econame == "") {
                alert("Enter Event's Co-ordinator name...");
                document.getElementById("econame").focus();
                return false;
        }

        if (edate == "") {
                alert("Enter Event's Date.....");
                document.getElementById("edate").focus();
                return false;
        }

        if (edetail == "") {
                alert("Enter Event Details.....");
                document.getElementById("edetail").focus();
                return false;
            }
        return true;
    }
function init() {
        document.getElementById("tick").style.visibility="hidden";
}
function chkfile() {
    if(!document.getElementById("imgfile").files.length == 0 ){
        document.getElementById("tick").style.visibility = "visible";
    }
}