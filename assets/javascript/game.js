var pCount = 0;				//variable to keep track of players logged in
var p1Name = "";			
var p2Name = "";
var activePlayer = "";
var p1Choice = "";
var p2Choice = "";
var p1Ref;
var p2Ref;
var pTurn = 0;

var gameAction = {
	p1Entered: false,
	p2Entered: false,
	gameOn: false,
	p1Chose: false,
	p2Chose: false,
	p1Scored: false,
	p2Scored: false
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

		//$(".p1Panel> .methods").show();							// show possible moves to player 11
	}

	if(gameAction.gameOn) {
		gameAction.p1Chose = (p1Choice !== null);
		gameAction.p2Chose = (p2Choice !== null);
		// Getting player 1 and 2 wins and loss data when in progress
		p1Wins = p1Snapshot.child("wins").val();
		p1Wins = (p1Wins === null) ? 0 : p1Wins;

		p2Wins = p2Snapshot.child("wins").val();
		p2Wins = (p2Wins === null) ? 0 : p2Wins;

		
		$("#leftWinsLossesCounter> .wins").html("Wins: " + p1Wins);

		$("#rightWinsLossesCounter> .wins").html("Wins: " + p2Wins);

	}
	// Geting pTurn from database
	pTurn = snapshot.child("pTurn").val();

	if(gameAction.p1Entered) {
		if(activePlayer === p1Name) {
			$(".localMessage").show();
			$("#localMessage").html("Hi " + p1Name + ". You are Player 1.");
		}
		//Display Player 1 details on all windows
		$("#p1Name").html(p1Name);
		$("#p1UpdateName").hide();
		if(!gameAction.p2Entered) {
			$("#p2UpdateName").show();
			$("#p2Name").empty();
			$("#globalMessage").empty();
			$("#globalMessage").hide();
			$(".methods").hide();
		}	
	}else {
		$(".localMessage").hide();
	}

	if(gameAction.p2Entered) {
		if(activePlayer === p2Name) {
			$(".localMessage").show();
			$("#localMessage").html("Hi " + p2Name + ". You are Player 2.");
		}
		//Display Player 2 details on all windows
		$("#p2Name").html(p2Name);
		$("#p2UpdateName").hide();

		//Special condition where Player 1 disconnects and we have a player 2
		if(!gameAction.p1Entered) {
			$("#p2UpdateName").show();
			$("#p1Name").empty();
			$("#globalMessage").empty();
			$("#globalMessage").hide();
		}
	}

	if(gameAction.p1Entered && gameAction.p2Entered) {

			// If not Guest or if they are the players
			if(!gameAction.gameOn && !gameAction.p1Chose && !gameAction.p2Chose) {
				
					// Else block denotes the normal condition that kickstarts a new game.
					gameAction.gameOn = true;
					// Set turn 0 in database indicating game has begun and player 1 can choose
					pTurn = 0;
					// Kickstart game from the player 2 window only
					if(activePlayer === p2Name) {
						database.ref("/game/pTurn").set(pTurn);
					}
					database.ref("/game/pTurn").onDisconnect().remove();	
				}		
			}else if(gameAction.gameOn && !gameAction.p1Chose && !gameAction.p2Chose){
				// Game is in progress.
				// Show methods for players
				if(pTurn === 0) {
					if(activePlayer === p1Name) {
						$("#globalMessage").html("<p>It's your turn.</p>");
						$("#globalMessage").show();
						$(".p1Panel> .methods").show();
					}
					if(activePlayer === p2Name) {
						$("#globalMessage").html("<p>Waiting for " + p1Name + " to choose.</p>");
						$("#globalMessage").show();
					}
					$(".p1Border").addClass('currentPlayer');
					$(".p2Border").removeClass('currentPlayer');
				}
			}

			if(gameAction.p1Chose && pTurn === 0 && !gameAction.p2Chose) {
				// If player one chose and if current window is player one update pTurn to 1
				if(activePlayer === p1Name) {
					// Update pTurn and set in database
					pTurn = 1;
					database.ref("/game/pTurn").set(pTurn);
				}
			}else if(gameAction.p1Chose && pTurn === 1 && !gameAction.p2Chose) {
				// Display messages on both windows when pTurn updated to 1
				// Player 2 allowed to choose
				if(activePlayer === p2Name) {
					$("#globalMessage").html("<p>It's your turn.</p>");
					$("#globalMessage").show();
				}
				if(activePlayer === p1Name) {
					$("#globalMessage").html("<p>Waiting for " + p2Name + " to choose.</p>");
					$("#globalMessage").show();
				}
				$(".p1Border").removeClass('currentPlayer');
				$(".p2Border").addClass('currentPlayer');
			}

			if(gameAction.p2Chose && pTurn === 1) {
				// If player 2 chose and if current window is player 2 update pTurn to 2
				if(activePlayer === p2Name) {
					// Update pTurn and set in database
					pTurn = 2;
					database.ref("/game/pTurn").set(pTurn);
				}
			} else if(gameAction.p2Chose && pTurn === 2){
				// Condition to happen in both windows
				// Calculate the outcome of game
				// Remove current player style
				$(".p1Border").removeClass('currentPlayer');
				$(".rightBorder").removeClass('currentPlayer');
				
				// Validate methods and rps game
				rpsGameValidate(p1Chooosed,p2Chooosed);
				// Resetting player 1 and 2 methods

				gameAction.gameOn = false;
				gameAction.p1Chose = false;
				gameAction.p2Chose = false;

				if(winner === p1Name && !gameAction.p1Scored) {
					gameAction.p1Scored = true;
				}
				if(winner === p2Name && !gameAction.p2Scored) {
					gameAction.p2Scored = true;
				}
				
				// DB calls getting called in onvalue callback is
				// controlled with the help of gameAction flags.

				// Player 1 updates and resets game
				if(activePlayer === p1Name) {
					// Update pTurn and set in db
					pTurn = 0;
					database.ref("/game/pTurn").set(pTurn);
					// Removing methods from db for new game
					database.ref("/game/players/1/method").remove();
					database.ref("/game/players/2/method").remove();

					if(winner === p1Name) {
						++p1Wins;
						database.ref("/game/players/1/wins").set(p1Wins);
					}else if(winner === p2Name) {
						++p2Wins;
						database.ref("/game/players/2/wins").set(p2Wins);
					}
				}
			}
});






	//if a third player trys clicking give alert that all players assigned

//on click method icon
	//when game round activates show all possible moves to player1 and ask them to choose, msg player1 to wait for player 2
	//after player1 chooses show them all possible moves and ask them to choose, after second choice is made update game board
	//mesg both users their	choices, a line of 'this beats that' then a line that player(1 or 2) Wins. use the name they signed in with.

	



