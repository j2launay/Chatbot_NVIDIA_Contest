var cookies;
(async () => {
  var socket_host = "ws://localhost:2000"       //change to  wss://rdi.behit.net to deploy
  var namespace = '/test';
var socket = io(socket_host+namespace,{path:"/socket.io"}) //change path to to deploy /qa/socket.io
const synth = window.speechSynthesis
var socket_connected = false
function checkCookie(cookieName) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName + '=') === 0) {
      return true; // Cookie found
    }
  }
  return false; // Cookie not found
}


function deleteCookie(cookieName) {
  // Set the cookie's expiration date to a past date
  document.cookie = "workfit_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.rdi.behit.net;";
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null; // Return null if the cookie with the specified name is not found
}


/*
var cookieName = 'workfit_user';
cookies = JSON.parse(getCookie(cookieName))
console.log(cookies)
// Check if the cookie exists
if (!cookies) {
  // If the cookie doesn't exist, redirect the user to a different page
  window.location.href = 'https://rdi.behit.net/workfit/login/';
}

var uuid = cookies["uuid"]

async function getUser(){

	const response = await fetch("https://rdi.behit.net/workfit/back-office/get_user/"+uuid)
	if (!response.ok) {
               	  throw new Error('Network response was not ok');
     	}

	return  response.json()
	
}



var user_data = await getUser()


 
console.log(user_data)
var user_name
if(user_data.role=="admin"){
  user_name = ""
}else{
  user_name = user_data["demographic_data"]["identities"][0]["details"]["items"][0]["value"]["value"]
}*/

var user_name = ""

$("#first-message").text("Hello, I am Qylo, a chatbot designed by Top Doctors. How can I help you?")

$("#name-ellipse p").text(user_name.substring(0, 2).toUpperCase())
socket.on('error', function(err) {
  console.log(err)
});


socket.on('connect', function() {
  if(!socket_connected){
    console.log("user name " + user_name)
    socket.emit('connected', {data: 'Hello'+ user_name +' ..., How can I help you ?'});
    socket_connected=true
  }

  //setAudioEnabled(false);
  muted = true;
});




socket.on('my_response', async function(msg, cb) {
  //setAudioEnabled(false);
  muted = true;
  if(msg.count==1){
    $(".chat-left.message").delay(800).slideToggle("slow")
  }


  say(msg["data"]["response"])
  console.log(msg)

$(document).on("change", ".insurance-radio", function() {
  socket.emit('ask', {data:`insurance = ${$(this).val()}`});
});
//  let utterThis = new SpeechSynthesisUtterance(msg["data"]["response"])

//  utterThis.rate = 0.9;
//  utterThis.pitch = 2;

//  synth.speak(utterThis)
//  utterThis.onend = async () =>{

  setTimeout(async ()=>{
    if(msg["data"]["intent"]==="dementia-test"){
      await startNeurologyTest()
    }else if(msg["data"]["intent"]=="doctor-recommendation" || msg["data"]["intent"]=="occupational-doctor-recommendation"){
      let doctor_filter = {}
      if((msg["data"]["intent"]=="doctor-recommendation" )|| (msg["data"]["intent"]=="occupational-doctor-recommendation" )){
        
        if(msg["data"]["ui_action"]=="open-recommended-doctor"){
          console.log("here")
          openDoctorPage(msg["data"]["details"]["picked_doctor"],msg["data"]["details"]["td_token"])
        }

        
      }
      
    }else if(msg["data"]["intent"]=="go-ssp"){
      url = "https://rdi.behit.net/workfit/ssp/"
      $("#createUserModal").modal("show")
      //window.open(url,target="_blank")
    }
    
    if(msg["data"]["ui_action"]=="show_insurance"){
      console.log(msg["data"]["details"]["insurance"])
      selectMedicalInsurance()
    } 
    
    if(msg["data"]["intent"]!="dementia-test"){
      //setAudioEnabled(true);
      muted = false;
    }
    console.log("done")
  },2000+(msg["data"]["response"].length*20))
//  }

});





$('form#disconnect').submit(function(event) {
  socket.emit('disconnect_request');
  return false;
});




function handleKeyDown( event ){
    if ( ((event.keyCode === 13) || (event.type == "click") ) && /\S/.test($("#interface").val())){
      event.preventDefault();

      if(event.shiftKey){
        // Insert a newline character at the current cursor position
        const textarea = $("#interface")[0]
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPos);
        const textAfterCursor = textarea.value.substring(cursorPos);
        textarea.value = textBeforeCursor + "\n" + textAfterCursor;

        // Move the cursor to the new position
        textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
      }else{
        $('#chat-wrapper').animate({
          scrollTop: $('#chat-wrapper')[0].scrollHeight
        }, 1000);

        $("#chat-wrapper").prepend(
          $(".chat-right")
          .last()
          .clone()
          .removeClass("d-none")
          .text(
              $("#interface").val()
            )
        )
        $("#interface").selectionStart = 0;
        $("#interface").selectionEnd = 0;
  
        //Send question
        socket.emit('ask', {data:$("#interface").val()});
        $("#interface").val(" ");


      }

    }
}

/*
var sendInsurance = (id) =>{
  socket.emit('ask', {data:`insurance = ${id}`});
}
*/


$("#send").on("click",handleKeyDown)

$(".chat-left.message").toggle()

// Show our Chat Interface:
$("#chat-container").slideToggle();


// Listen on the user's input:
$("#interface").on("keydown", handleKeyDown );

// Close the Chat Interface:
$(".close-button").click(function(){

    $("#chat-container").fadeOut();

});

  // Show the modal when the user clicks the logout button
  $('#log-out-button').on("click",(e)=> {
    e.preventDefault();
    $('#logoutModal').modal('show');
  });

  // Handle logout confirmation
  $('#confirmLogout').click(function() {
    deleteCookie(cookieName);
    
    //normal auth log-out
    //location.reload()

    //auth0 log-out
    window.location.href = "https://rdi.behit.net/workfit/login0/logout";
    
    $('#logoutModal').modal('hide');
  });

  $("#cancelLogout").click(()=>{
    $('#logoutModal').modal('hide');
  })


  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $("#ssp-form #phone_number").val(cookies["phone_number"])
    $("#ssp-form #uuid").val(cookies["uuid"])
    $("#noticeModal").modal("show")
  });

  $('#confirmNotice').click(function() {
    
    $('#noticeModal').modal('hide');
  });

})();





$("#ssp-form").submit(function(event) {
  // Prevent the default form submission
  event.preventDefault();
  say("Your absence request was sent result will come in seconds")
  $("#createUserModal").modal("hide")
  // Get form data
  var formData = $(this).serialize();
  document.body.classList.add('loading');
  $("button").addClass('loading')
  const xhr = new XMLHttpRequest();
  xhr.open('POST', "https://rdi.behit.net/workfit/ssp/create_pdf", true);
  xhr.responseType = 'blob'; // Set the response type to Blob
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          // Create a Blob URL and set it as the source of the iframe
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          document.getElementById('pdfViewer').src = url;
          
          // Show the Bootstrap modal
          $('#pdfModal').modal('show');
          document.body.classList.remove('loading');
          $("button").removeClass('loading')
          
      }else{
        console.log(xhr)
      }
  };
  xhr.send(formData);
});

var say = (message) => {
  $("#chat-wrapper").prepend(
    $(".chat-left.message")
    .last()
    .clone()
    .html(message)
  )
}

$("#know_resolution_date").on("change",()=>{
  if($("#know_resolution_date").val()=="No")
    $("#resolution_date_group").hide()
  else
  $("#resolution_date_group").show()
})




