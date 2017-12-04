$(function() {
  // ready...

  checkIfSignedIn();
  windowHeight();
  fadeIn("body");
  getDate();
  showLabelText();
  listeners();
  getCookies();

  setTimeout(function(){
    getUserDetails();
    getTasks();
  }, 500);

  setInterval(function() {
    getTasks();
  }, 20000);

})

function windowHeight(){

  // calculate any heights in this function

  var wH = $(window).height();
  $(".page").css({height: wH});

  var headerHeight = $("header").height();
  $(".task-creator").css({marginTop:headerHeight+50});

}

function fadeIn(element) {

  // be sure to add a transition to the core element.

  $(element).css({
    opacity: 1
  });

}

function getDate() {

  var d = new Date();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var currentDate = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();

  // set date to the HTML element
  $("#date").html(currentDate);

}

function showLabelText() {

  $('.enter-task').on("input", function() {
    if ($(".enter-task").val() != "") {
      $(".add-label").css({opacity:0.5});
    } else {
      $(".add-label").css({opacity:0});
    }
  });

}

function listeners() {

  $(".left").click(function () {
    navigate("hangar.html");
  });

  // add the focused class to a task item to make it "active".
  $(".task").click(function() {
    $(".task").removeClass("focused");
    $(this).toggleClass("focused");
    //$(this).siblings(".action").toggleClass("show");
  })

  // mark a task as done
  $(".action").click(function() {
    $(this).siblings(".task").removeClass("focused");
    $(this).siblings(".task").toggleClass("done");

    // check if the html of the action is equal to "Undo". If it is then set it to I'm done and vice versa.
    if ($(this).html() == "Undo") {
      $(this).html("I'm done");
    } else if ($(this).html() == "I'm done") {
      $(this).html("Undo");
    }
  })

    $("#GoogleLogin").click(function() {
    GoogleLogin();
    });
    $("#logout").click(function() {
      signout();
    });

    var taskField = document.getElementById("taskField");
    taskField.onkeyup = function(e){
        if(e.keyCode == 13){
          $( ".tasks" ).fadeOut( 200, function() {
            createTask();
          });
        }
    }
}

function navigate(destination) {

  window.location = destination;

}
