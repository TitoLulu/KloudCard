function validateLoginForm() 
{
  var email = validateEmail("login_form","email","email_span");
  var password = validatePassword("login_form","password","password_span");
  if (email==false || password==false)
   {
     return false;
   }
  loginUser(email,password);
  return false;
}

function validateRegistrationForm()
{
  var fname = document.forms["registrationForm"]["fname"].value;
  var lname = document.forms["registrationForm"]["lname"].value;
  var email = document.forms["registrationForm"]["email"].value;
  var password = document.forms["registrationForm"]["password"].value;
  registerUser(fname,lname,email,password);
  return false;
}

function validateStudentCardForm()
{
  var school = document.forms["student_card"]["school"].value;
  var name = document.forms["student_card"]["name"].value;
  var date = document.forms["student_card"]["date"].value;
  var studentNo = document.forms["student_card"]["student_no"].value;
  var cardId= document.getElementById("studentCard_saveBtn").value;

  if (cardId!="")
  {
    var updatedata = {school:school,name:name,date:date,studentNo:studentNo, userId:localStorage.getItem("userId"), type: "student_id"};
    UpdateCard(cardId, updatedata, "#studentCard_modal");
     
  }
  else
  {
    var insertdata = {school:school,name:name,date:date,studentNo:studentNo,userId:localStorage.getItem("userId"), type: "student_id"};
    addStudentCard(insertdata, "#studentCard_modal");
  }
  //$("#studentCard_modal").modal("toggle");
  return false;
}

function validateSSNITCardForm()
{
  var username = document.forms["ssnit_card"]["username"].value;
  var gender = document.forms["ssnit_card"]["gender"].value;
  var age = document.forms["ssnit_card"]["age"].value;
   var issuedate = document.forms["ssnit_card"]["issuedate"].value;
    var ssnit_no = document.forms["ssnit_card"]["ssnit_no"].value;
  var cardId= document.getElementById("socialsecurity_saveBtn").value;

  if (cardId!="")
  {
      var updateddata = {name:username, gender: gender, age:age, issueDate:issuedate, ssnitNo:ssnit_no, userId:localStorage.getItem("userId"), type: "ssnit_id"};
      UpdateCard(cardId, updateddata, "#socialsecurity_modal");
  }
  else
  {
   var data = {name:username, gender: gender, age:age, issueDate:issuedate, ssnitNo:ssnit_no, userId:localStorage.getItem("userId"), type: "ssnit_id"};
    addStudentCard(data, "#socialsecurity_modal");
  }
  return false;
}

function addStudentCard(jsondata, whichCard)
{
  
  var serverUrl='http://localhost:3000/addCard';
    $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'POST',
      contentType: 'application/json',
      data: JSON.stringify(jsondata),
      success: function(data)
      {
        //console.log(data);
        if (data.response=="card_successfully_added")
        {
          getUserCards();
          $(whichCard).modal("toggle");
        }
      },
      error: function (request, status, error)
      {
        //alert(error);
      }
    });
}


function loginUser(email,password)
{
  var data = {email:email, password:password};
  var serverUrl='http://localhost:3000/login';
    $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data)
      {
        if (data.response=="login_success")
        {
          document.getElementById("password_span").innerHTML="";
          document.getElementById("email_span").innerHTML="";
          localStorage.setItem('userId',data.userId);
          localStorage.setItem('fname',data.fname);
          //redirects the user to the dashboard
          window.location.href="index.html";
        }
        else if(data.response=="wrong password")
        {
          document.getElementById("email_span").innerHTML="";
          document.getElementById("password_span").innerHTML="Wrong Password";
        }
        else if(data.response=="wrong email address")
        {
          document.getElementById("password_span").innerHTML="";
          document.getElementById("email_span").innerHTML="Wrong Email";
        }
      },
      error: function (request, status, error)
      {
        //alert(error);
      }
    });
}




function registerUser(fname,lname,email,password)
{
  var data = {fname:fname, lname:lname, email:email, password:password};
  var serverUrl='http://localhost:3000/register';
    $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data)
      {
        console.log(data.response);
        alert(data.response);
      },
      error: function (request, status, error)
      {
        //alert(error);
      }
    });
}




function getUserCards()
{
  if (checkLogin())
  {
    var userId = localStorage.getItem("userId");

   var serverUrl='http://localhost:3000/addCard/'+userId;
   $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'GET',
      contentType: 'application/json',
      success: function(data)
      {
        document.getElementById("username").innerHTML=localStorage.getItem("fname");
        var studentcards="";
        var ssnitcards="";
        var studentcardHolder= document.getElementById("studentcards");
        var ssnitcardHolder= document.getElementById("snnitcards");
        data.response.forEach(function(card){
          if(card.type =="student_id"){
            studentcards +="<div class=\"col-sm-6 col-md-4\">"+
                    "<div class=\"thumbnail\">"+
                        "<div class=\"caption\">"+
                            "<h3 style=\"text-align: center;\">"+card.name+"</h3>"+
                            "<p> School : "+card.school+"</p>"+
                            "<p> Student Number : "+card.studentNo+"</p>"+
                            "<p> Expiry Date : "+card.date+"</p>"+

                            "<p>"+ 
                                "<button type=\"button\" id=\"editCard\" onclick=\"fillStudentEditCardForm(this.value)\" value = \""+card._id+"&"+card.school+"&"+card.name+"&"+card.studentNo+"&"+card.date+"\" class=\"btn btn-warning\">Edit Card</button>" +
                                "<button style=\"margin-left:12px;\" type= \"button\" class=\"btn btn-danger\" value = \""+card._id+"\" onclick=\"validateDeleteCard(this.value)\">Delete Card</button>"+
                            "</p>"+
                        "</div>"+
                    "</div>"+
                "</div>";
          } 
          else if(card.type =="ssnit_id"){
            ssnitcards +="<div class=\"col-sm-6 col-md-4\">"+
                    "<div class=\"thumbnail\">"+
                        "<div class=\"caption\">"+
                            "<h3 style=\"text-align: center; color:orange;\">"+card.name+"</h3>"+
                            "<p> Gender : "+card.gender+"</p>"+
                            "<p> SSNIT Number : "+card.ssnitNo+"</p>"+
                            "<p> Issue Date : "+card.issueDate+"</p>"+
                            "<p>"+ 
                                "<button type=\"button\" id=\"editCard\" onclick=\"fillSSNITEditCardForm(this.value)\" value = \""+card._id+"&"+card.gender+"&"+card.name+"&"+card.ssnitNo+"&"+card.issueDate+"&"+card.age+"\" class=\"btn btn-info\">Edit Card</button>" +
                                "<button style=\"margin-left:12px;\" type= \"button\" class=\"btn btn-danger\" value = \""+card._id+"\" onclick=\"validateDeleteCard(this.value)\">Delete Card</button>"+
                            "</p>"+
                        "</div>"+
                    "</div>"+
                "</div>";
          }

          
        });

        studentcardHolder.innerHTML="";
        studentcardHolder.innerHTML=studentcards;

         ssnitcardHolder.innerHTML="";
        ssnitcardHolder.innerHTML=ssnitcards;
      },
      error: function (request, status, error)
      {
        //alert(error);
      }
    });
  }
}


function fillStudentEditCardForm(value)
{
  var cardInfo=value.split("&");
  document.getElementById("studentCard_saveBtn").value=cardInfo[0];
  document.forms["student_card"]["school"].value=cardInfo[1];
  document.forms["student_card"]["name"].value=cardInfo[2];
  document.forms["student_card"]["student_no"].value=cardInfo[3];
  document.forms["student_card"]["date"].value=cardInfo[4];
  document.getElementById("card_header").innerHTML="<i class=\"glyphicon glyphicon-edit\"></i> Update Card";
  document.getElementById("studentCard_saveBtn").innerHTML="Update Card";
  $("#studentCard_modal").modal("show");
}

function fillSSNITEditCardForm(value)
{
  var cardInfo=value.split("&");
  document.getElementById("socialsecurity_saveBtn").value=cardInfo[0];
  document.forms["ssnit_card"]["username"].value=cardInfo[2];
  document.forms["ssnit_card"]["gender"].value=cardInfo[1];
  document.forms["ssnit_card"]["age"].value=cardInfo[5];
  document.forms["ssnit_card"]["issuedate"].value=cardInfo[4];
  document.forms["ssnit_card"]["ssnit_no"].value=cardInfo[3];
  document.getElementById("ssnitcard_header").innerHTML="<i class=\"glyphicon glyphicon-edit\"></i> Update Card";
  document.getElementById("socialsecurity_saveBtn").innerHTML="Update Card";
  $("#socialsecurity_modal").modal("show");
}


function UpdateCard(id, jsondata, whichCard)
{
 
  var serverUrl='http://localhost:3000/addCard/'+id;
    $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'PUT',
      contentType: 'application/json',
      data: JSON.stringify(jsondata),
      success: function(data)
      {
        //console.log(data);
        if (data.response=="update_successful")
        {
          getUserCards();
          $(whichCard).modal("toggle");
        }
      },
      error: function (request, status, error)
      {
        //alert(error);
      }
    });
}

function validateDeleteCard(value)
{
  console.log(value);
  localStorage.setItem("cardId",value);
  $("#deleteCardModal").modal("show");
}

function deleteCard()
{
  var cardId = localStorage.getItem("cardId");

  var serverUrl='http://localhost:3000/addCard/'+cardId;

  $.ajax({ // jQuery Ajax
      url: serverUrl, // URL to the PHP file which will insert new value in the database
      method:'DELETE',
      contentType: 'application/json',
      success: function(data)
      {
        if (data.response=="delete_successful")
        {
          localStorage.removeItem("cardId");
          getUserCards();
        }
      }
  });
}


function openStudentIdForm()
{
  
  //rests the supplier form
  document.getElementById("student_card").reset();
  //resets the supplier form save button
  document.getElementById("studentCard_saveBtn").value="";
  document.getElementById("card_header").innerHTML="<i class=\"glyphicon glyphicon-plus\"></i> Add Student ID";
  document.getElementById("studentCard_saveBtn").innerHTML="Add Student ID";
  //triger the modal
  $('#studentCard_modal').modal('show'); 
}

function openSSNITForm()
{
  
  //rests the supplier form
  document.getElementById("ssnit_card").reset();
  //resets the supplier form save button
  document.getElementById("socialsecurity_saveBtn").value="";
  document.getElementById("ssnitcard_header").innerHTML="<i class=\"glyphicon glyphicon-plus\"></i> Add SSNIT ID";
  document.getElementById("socialsecurity_saveBtn").innerHTML="Add SSNIT ID";
  //triger the modal
  $('#socialsecurity_modal').modal('show'); 
}

function logout()
{
  localStorage.clear();
  window.location.href="login.html";
}

function checkLogin()
{
  if (localStorage.getItem("userId")===null)
  {
    window.location.href="login.html";
  }
  else
  {
    return true;
  }
}


//validates password
function validatePassword(form_name,field_name,span_name)
{
  var password = document.forms[form_name][field_name];
  var span = document.getElementById(span_name);

  if (password.value == "") 
   {
    span.innerHTML = "*required";
    password.style.border = "1px solid red";
    return false; 
   }
   else
  {
    span.innerHTML = "";
    password.style.border = "";
    return password.value; 
  }
}

//validates an email 
function validateEmail(form_name,field_name,span_name)
{
  var email = document.forms[form_name][field_name];
  var span = document.getElementById(span_name);

  //email is not requivalired
  if (email.value=="")
  {
    span.innerHTML = "*required";
    email.style.border = "1px solid red";
    return false; 
  }
  else
  {
    //if not empty do the folling 
    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (pattern.test(email.value)) 
    {
      email.style.border= "";
      span.innerHTML = "";
      return email.value; 
    }
    else
    {
      span.innerHTML = "*invalid email address";
      email.style.border = "1px solid red";
      return false; 
    }
  }
}
