var statusDisplay = ["Standing by...", "Keep on working!", "Take a break!"];
var sessionInt = 25; // 25 is default
var usableSessionInt = sessionInt + ":00";
var breakInt = 5; // 5 is default
var usableBreakInt = breakInt + ":00";
var isWorking = true; // is the timer currently on session?
var isRunning = false; // is the timer running?
var myReset = false; // has the reset button been pressed?

$(document).ready(function() {
    $("#timerDisplay").html(usableSessionInt);
    $("#statusDisplay").html(statusDisplay[0]);
    $("#sessionInt").html(sessionInt);
    $("#breakInt").html(breakInt);
});

$("#sessionLess").click(function() {
    if (sessionInt > 1 && isRunning == false) {
        sessionInt--;
        updateInts();
    }
});

$("#sessionMore").click(function() {
    if (sessionInt < 60 && isRunning == false) {
        sessionInt++;
        updateInts();
    }
});

$("#breakLess").click(function() {
    if (breakInt > 1 && isRunning == false) {
        breakInt--;
        updateInts();
    }
});

$("#breakMore").click(function() {
    if (breakInt < 30 && isRunning == false) {
        breakInt++;
        updateInts();
    }
});

$("#resetButton").click(function() {
    if (isRunning == true) {
        myReset = true;
        $("#statusDisplay").html(statusDisplay[0]);
    }
});

$("#startButton").click(function() {
    if (isRunning == false) {
        mySession(usableSessionInt);
        isRunning = true;
        $("#statusDisplay").html(statusDisplay[1]);
    }
});

function updateInts() {
    usableSessionInt = sessionInt + ":00";
    usableBreakInt = breakInt + ":00";
    $("#sessionInt").html(sessionInt);
    $("#timerDisplay").html(usableSessionInt);
    $("#breakInt").html(breakInt);
}

function mySession(myInt) {
    var interval = setInterval(function() {
        var timer = myInt.split(":"); // split number
        var minutes = parseInt(timer[0], 10); // save minutes
        var seconds = parseInt(timer[1], 10); // save seconds
        seconds--; // subtract 1 from each second
        minutes = seconds < 0 ? --minutes : minutes; // subtract minute when second is zero
        if (minutes < 0) {
            clearInterval(interval); // when minutes are zero, clear
        }
        seconds = seconds < 0 ? 59 : seconds; // seconds are limited to 0 and 59
        seconds = seconds < 10 ? "0" + seconds : seconds; // if seconds are smaller than 10, add a zero to the front
        $("#timerDisplay").html(minutes + ":" + seconds); // display the time
        myInt = minutes + ":" + seconds; // save the updated time

        if (myReset == true) {
            audio.pause();
            $(".speaker").css("color", "#6D6875");
            $("#timerDisplay").html(usableSessionInt);
            console.log("reset was hit");
            myReset = false;
            isRunning = false;
            isWorking = true;
            clearInterval(interval);
        }

        if (myInt == "-1:59" && isWorking == true) { // switch to break
            audio.play();
            $(".speaker").css("color", "#FFFFFF");
            isWorking = false;
            myInt = usableBreakInt;
            $("#timerDisplay").html(myInt);
            $("#statusDisplay").html(statusDisplay[2]);
            clearInterval(interval);
            mySession(usableBreakInt);
        } else if (myInt == "-1:59" && isWorking == false) { // switch to session
            audio.pause();
            $(".speaker").css("color", "#6D6875");
            isWorking = true;
            myInt = usableSessionInt;
            $("#timerDisplay").html(myInt);
            $("#statusDisplay").html(statusDisplay[1]);
            clearInterval(interval);
            mySession(usableSessionInt);
        }
    }, 1000);
}
