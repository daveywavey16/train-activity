
  var config = {
    apiKey: "AIzaSyDfd7IuGiABlKTH44EIiNq8q00M0axgY3Y",
    authDomain: "train-1391e.firebaseapp.com",
    databaseURL: "https://train-1391e.firebaseio.com",
    projectId: "train-1391e",
    storageBucket: "train-1391e.appspot.com",
    messagingSenderId: "69452928137"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains to fire base
$("#submitbtn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train_name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTime =  $("#first_train").val().trim();
  var frequency = $("#frequency").val().trim();
  

  // Creates object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train_name").val("");
  $("#destination").val("");
  $("#first_train").val("");
  $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime;
  var frequency = childSnapshot.val().frequency;
  var nextArrival = timearrive;
  var minutesAway = minTilTrain;

  
  var firstTrainTime = moment(firstTime, "HH:mm").subtract(1, "years");  // First Train Time converted into hours and minus a year ??
  console.log("TIME CONVERTED: " + firstTrainTime);
    
  var diffTime = moment.duration(moment().diff(moment(firstTime, "HH:mm")), 'milliseconds').asMinutes();  // Current time minus the First Train time diplayed as minutes
    
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var timeRemaining = frequency - (Math.floor(diffTime) % frequency); // Frequency minus difftime divided by frequency 
  console.log("TIME REMAINING: " + timeRemaining);

  var nextArrival = diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(firstTime, "HH:mm") ; //If difftime is greater then zero add duration of time remaining in miutes to current moment
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
  
  var timearrive = moment(nextArrival).format("HH:mm");
  
  var minTilTrain = Math.ceil(moment.duration(moment(nextArrival).diff(moment()), 'milliseconds').asMinutes()); // Calculates the diffence between now and the next arrival in minutes.
  console.log("MINUTES TILL TRAIN: " + minTilTrain);
  
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(timearrive),
    $("<td>").text(minTilTrain)
  );

  // Append the new row to the table
  $(".table > tbody").append(newRow);
});

