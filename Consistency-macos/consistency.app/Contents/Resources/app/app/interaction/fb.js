//Initialize Firebase connection
var config = {
  apiKey: "AIzaSyCqVxlxefcJORixWEywRwgwGDXcM44mfpY",
  authDomain: "todolist-e6040.firebaseapp.com",
  databaseURL: "https://todolist-e6040.firebaseio.com",
  projectId: "todolist-e6040",
  storageBucket: "todolist-e6040.appspot.com",
  messagingSenderId: "348195663665"
};
firebase.initializeApp(config);

// Will use the user's machine language for the sign in with Google
firebase.auth().useDeviceLanguage();

// Global Variables

var provider = new firebase.auth.GoogleAuthProvider();

var username, photo;
var usernameCookie, photoCookie;
var database = firebase.database();



//Login with Google Function
function GoogleLogin() {

  firebase.auth().signInWithRedirect(provider);
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;

    console.log(username);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

//Sign out of the Google account
function signout() {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    checkIfSignedIn();
  }).catch(function(error) {
    // An error happened.
  });
}

function checkIfSignedIn() {

    //Gets the current page
    var currentPage = window.location.pathname;

    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      if (currentPage == "/hangar.html") {
        //Do nothing
      } else {
        window.location.href = "/hangar.html";
      }

    } else {
      // No user is signed in.
      if (currentPage == "/login.html" || currentPage == "/") {
        //Do nothing
      } else {
        //Do nothing
        window.location.href = "login.html";
      }
    }
  });
}

function getUserDetails() {

  var userId = firebase.auth().currentUser.uid;

  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    username = (snapshot.val() && snapshot.val().username);
    photo = (snapshot.val() && snapshot.val().photo);
    $("#username").html(username);
    document.getElementById("profile-picture").style.backgroundImage = "url('" + photo + "')";

    //Create a cookie with the username
    Cookies.set('username', username);
    Cookies.set('photo', photo);
  });
}

function getCookies() {

  usernameCookie = Cookies.get('username');
  photoCookie = Cookies.get('photo');

  $("#username").html(usernameCookie);
  document.getElementById("profile-picture").style.backgroundImage = "url('" + photoCookie + "')";

}
function createTask() {

  var userId = firebase.auth().currentUser.uid;

  var userTask = document.getElementById('taskField').value;
  var random1 = Math.floor((Math.random() * 10000000) + 1);
  var random2 = Math.floor((Math.random() * 10000000) + 1);
  var taskID = random1 + random2;
  var d = new Date();
  var date = d.getTime();
  userTaskSliced = userTask.slice(0, -1);

    //Add the task to the DB
    if (userTaskSliced == "" || userTask == "") {
      //Dont add
    } else {
      firebase.database().ref('users/' + userId + "/Tasks/" + taskID).set({
        task: userTaskSliced,
        id: taskID,
        done: false,
        date: date
      });
    }

    //Set hastasks to true
    firebase.database().ref('users/' + userId).update({
      hasTasks: true
    });

  document.getElementById('taskField').value = "";
  getTasks();
}

function getTasks() {
  $( ".tasks" ).empty();
  $( ".DoneTasks" ).empty();
  $( ".tasks" ).fadeIn( "slow" );

  var userId = firebase.auth().currentUser.uid;
  var query = firebase.database().ref( "/users/" +userId+ "/Tasks" ).orderByChild('date');

  //Check if the user has current tasks
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var hasTasks = (snapshot.val() && snapshot.val().hasTasks);
    if (hasTasks == false || hasTasks == null) {
      $( ".informative" ).hide();
      $( ".informative" ).text("Add a task to start off your first list! 🦕");
      $( ".informative" ).fadeIn( "slow" );
    } else {
      $( ".informative" ).remove();
    }
  });

	query.once( "value" ).then( function( snapshot ) {
		snapshot.forEach( function( tasksSnapshot ) {
			var key = tasksSnapshot.key;
			var tasksData = tasksSnapshot.val();

      //Create the tasks in the HTML
      if (tasksData.done == true) {

        var removeHTML = '<div onclick="deleteTask(this.id)" id="' + tasksData.id + '" class="remove"></div>';
        var taskHTML = '<p class="action" onclick="undoTask(this.id)" id="' + tasksData.id + '">'+"Undo"+'</p>';
        var messageHTML = '<h1 onclick="highlightTask(this.id)" class="task">'+"<strike>" + tasksData.task + "</strike>" + '</h1>';
        var divHTML = '<div class="task-holder" id="' + tasksData.id + '">' + removeHTML + taskHTML + messageHTML + '</div>';
        $( ".doneTasks" ).append( divHTML );
      } else {

        var removeHTML = '<div onclick="deleteTask(this.id)" id="' + tasksData.id + '" class="remove"></div>';
        var taskHTML = '<p class="action" onclick="setDone(this.id)" id="' + tasksData.id + '">'+"I'm Done"+'</p>';
        var messageHTML = '<h1 class="task" onclick="highlightTask(this.id)" id="' + tasksData.id + "1" + '">' + tasksData.task + '</h1>';
        var divHTML = '<div class="task-holder" id="' + tasksData.id + '">' + removeHTML + taskHTML + messageHTML + '</div>';
        $( ".tasks" ).append( divHTML );
      }


		} );
	} );
}

function deleteTask(clicked_id) {
  var userId = firebase.auth().currentUser.uid;
  var taskRef = database.ref();
  console.log(clicked_id);

  $( "#"+clicked_id ).fadeOut( "slow", function() {
  $( "#"+clicked_id ).remove();
});


  var tasksRef = taskRef.child("users/" + userId + "/Tasks/" + clicked_id);
  tasksRef.set({
    task: null,
    id: null
  });
}

function setDone (clicked_id) {
  var userId = firebase.auth().currentUser.uid;
  var taskRef = database.ref();
  console.log(clicked_id);

  var tasksRef = taskRef.child("users/" + userId + "/Tasks/" + clicked_id);
  tasksRef.update({
    done: true
  });
  $( "#"+clicked_id ).fadeOut( 200, function() {
  $( "#"+clicked_id ).fadeIn("slow");
});
  getTasks();
}

function undoTask(clicked_id) {
  var userId = firebase.auth().currentUser.uid;
  var taskRef = database.ref();
  console.log(clicked_id);

  var tasksRef = taskRef.child("users/" + userId + "/Tasks/" + clicked_id);
  tasksRef.update({
    done: false
  });
  $( "#"+clicked_id ).fadeOut( 200, function() {
  $( "#"+clicked_id ).remove();
  getTasks();

});
}

function highlightTask(clicked_id) {
  var element = document.getElementById(clicked_id);
  $(".task").removeClass("focused");

  element.className += " focused";
  $(this).toggleClass("focused");

}
