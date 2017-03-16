var pCount = 0;				//variable to keep track of players logged in
var p1Name = "";			
var p2Name = "";
var activePlayer = "";
var p1Ref;
var p2Ref;

var gameAction = {
	p1Entered: false,
	p2Entered: false,
};

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAIwDJNNhhPB_2bA09sxG7U5Adoo3q6CgM",
    authDomain: "rps-multiplayer-da442.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-da442.firebaseio.com",
    storageBucket: "rps-multiplayer-da442.appspot.com",
    messagingSenderId: "835780390346"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

$(".methods").hide(); 										// hide methods(various RPS moves) on page start

$("#player-enter").on("click", function(event) {       		//click event on player-enter button
	event.preventDefault();									//prevent the default reload on a submit button

		if(pCount === 0) {									// if the player count is at 0
			p1Name = $("#userName").val();					// p1Name becomes what ever the 1st user entered

			var playerData = {								// Prepare player 1 data for firebase
				name: p1Name,
				wins: 0
			}

			activePlayer = p1Name;							// label player one as the active player

			p1Ref = database.ref("game/players/1");			// Store player 1 db reference in variable
		
			p1Ref.set(playerData);							// Create new player in firebase and pass data to it

			p1Ref.onDisconnect().remove();  				// Remove player 1 from db upon disconnect


		}else if(pCount === 1 && gameAction.p1Entered) {	// if player count is at 1 and Player 1 is designated as entered
			p2Name = $("#userName").val();					// p2Name becomes what ever the 2nd user entered

			var playerData = {								// Prepare player 1 data for firebase
				name: p2Name,
				wins: 0
			}

			activePlayer = p2Name;							// label player one as the active player

			p2Ref = database.ref("game/players/2");			// Store player 2 db reference in variable
		
			p2Ref.set(playerData);							// Create another player in firebase and pass data to it

			p2Ref.onDisconnect().remove();  				// Remove player 2 from db upon disconnect


		}
	
	$(".logInForm").hide();									// Hide login entry field
});

database.ref("/game").on("value", function(snapshot) {			//run function when value in /game firebase changes

	pCount = snapshot.child("players").numChildren();			//pCount is the number of children in players

	var p1Snapshot = snapshot.child("players").child("1");		// grab player 1 data from firebase stored as a var
	var p2Snapshot = snapshot.child("players").child("2");		// grab player 2 data from firebase stored as a var
	
	p1Name = p1Snapshot.child("name").val();					// p1Name updated from db
	p2Name = p2Snapshot.child("name").val();					// p2Name updated from db

	if(pCount === 1 && p1Name !== null) {						// if player count is 1 and the name valid
		gameAction.p1Entered = true;							// change player 1 as entered
		gameAction.p2Entered = false;							// set player two as not entered
		gameAction.gameOn = false;								// set gameOn to false

	}else if(pCount === 2 && p2Name !== null) {					// if player count is 2 and p2 name is valid
		gameAction.p1Entered = true;							// set player 1 as entered
		gameAction.p2Entered = true;							// change player 2 as entered
	}

	if(gameAction.p1Entered && gameAction.p2Entered) {			// if both players are logged as entered 
		gameAction.gameOn = true;								// then set GameOn to true

		$(".p1Panel> .methods").show();							// show possible moves to player 1
	}



});




	//if a third player trys clicking give alert that all players assigned

//on click method icon
	//when game round activates show all possible moves to player1 and ask them to choose, msg player1 to wait for player 2
	//after player1 chooses show them all possible moves and ask them to choose, after second choice is made update game board
	//mesg both users their	choices, a line of 'this beats that' then a line that player(1 or 2) Wins. use the name they signed in with.

	



