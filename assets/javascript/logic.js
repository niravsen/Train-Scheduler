
  var config = {
    apiKey: "AIzaSyADZvbIzzNrA2RuWPAoFrbBs6z6SWgPMZE",
    authDomain: "train-scheduler-65da3.firebaseapp.com",
    databaseURL: "https://train-scheduler-65da3.firebaseio.com",
    projectId: "train-scheduler-65da3",
    storageBucket: "train-scheduler-65da3.appspot.com",
    messagingSenderId: "278122241028"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var frequencyMnt = 0;
  var firstTrainTime = 0;
  var trainTime =0;
  var currentTimeMnt = 0;
  var nextArrivalMnt = 0;
  var nextArrival = 0;
  var minutesAway = 0;
  var currentTime = 0;

  function convertTimeToMinutesFn(time) {

    time = moment(time, "hh:mm");
    timeHours = time.hours();
    timeMin = time.minutes();
   

    return (timeHours*60 + timeMin)
  }

    function displayRealTime() {
    setInterval(function(){
      $('#currentTime').html(moment().format('hh:mm A')+' )')
    }, 1000);
  }
  displayRealTime();
  

  function minutesLeftFn(firstTrainTime, frequencyMnt,currentTimeMnt) {
      var temp= convertTimeToMinutesFn(firstTrainTime);
      var timeDifference=currentTimeMnt - temp;

      if (timeDifference < 0){
        nextArrival=temp;
        nextArrival= convertnextArrivalMntToHoursMntFn(nextArrival);
        minutesAway = temp - currentTimeMnt;
      }
      else{
       var minutesLeft= timeDifference % frequencyMnt;
      minutesAway = frequencyMnt - minutesLeft;
      nextArrivalMnt = currentTimeMnt + minutesAway
      nextArrival= convertnextArrivalMntToHoursMntFn(nextArrivalMnt);
      
      }
    };

function convertnextArrivalMntToHoursMntFn(nextArrivalMnt) {
   nextArrivalHours = Math.floor(nextArrivalMnt / 60); 

  if (nextArrivalHours > 12) {
    nextArrivalHours = nextArrivalHours - 12;
    ampm = "PM";
  } else {
    nextArrivalHours = nextArrivalHours;
    ampm = "AM";
  }
   nextArrivalMin = nextArrivalMnt % 60;
  if (nextArrivalHours < 10) {
    nextArrivalHours = "0" + nextArrivalHours;
  }
  if (nextArrivalMin < 10) {
    nextArrivalMin = "0" + nextArrivalMin;
  }
  nextArrival = nextArrivalHours + ":" + nextArrivalMin + " " + ampm;
  return nextArrival;
}


  $("#submit").on("click", function(event) {

    event.preventDefault();

    trainName= $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    frequencyMnt= $("#frequency").val().trim();

if (trainName === "" || destination === "" || firstTrainTime === "" || frequencyMnt === ""){
  $("#missingField").html("ALL fields are required to add a train to the schedule.");
  return false;		
}

else {

  $("#missingField").empty();

  currentTime=moment().format("hh:mm A");
  currentTimeMnt= convertTimeToMinutesFn(moment());
  minutesLeftFn(firstTrainTime, frequencyMnt, currentTimeMnt);

    var itemsToPush={
    
    Name:trainName,
    Destination:destination,
    FirstTrainTime:firstTrainTime,
    Frequency:frequencyMnt,
    NextArrival:nextArrival,
    MinutesAway:minutesAway,
    CurrentTime:currentTime,
    DateAdded:firebase.database.ServerValue.TIMESTAMP
  
  }


  database.ref().push(itemsToPush);

  $("#trainName").val(" ");
  $("#destination").val(" ");
  $("#firstTrainTime").val(" ");
  $("#frequency").val(" ");
  return false;
}
  });

database.ref().on("child_added", function(childSnapshot) {


var tempname=childSnapshot.val().Name;
var tempdest=childSnapshot.val().Destination;
var tempfreq=childSnapshot.val().Frequency;
var temparrival=childSnapshot.val().NextArrival;
var tempmntaway=childSnapshot.val().MinutesAway;
var firsttraintime=childSnapshot.val().FirstTrainTime;
var currenttime=childSnapshot.val().CurrentTime;
var tempkey=childSnapshot.key;


$('#trainSchedule').append("<tr>" +
"<td>" + tempname+ "</td>" +
"<td>" + tempdest+ "</td>" +
"<td>" + tempfreq+ "</td>" +
"<td>" + temparrival + "</td>" +
"<td>" + tempmntaway + "</td>" +

"</tr>"
);
},function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});


