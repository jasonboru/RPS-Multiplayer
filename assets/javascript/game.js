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

//on document startup
	/* 	in the game update field it should show a user input to enter their name. This first user to login
		becomes Player 1 and the second user to login becomes player 2. when both player have signed in
		and player count =2 hide submit field and show game updates.*/

//on click submit
	//remove default action
	//add player name to firebase
	//assign 1st user click to player1 (if playercount=0) notify in update a welcome and msg waiting on second player
	//on 2nd users click assign to player2 (if playercount=1) notify a welcome and msg waiting on player 1 to pick
	//if a third player trys clicking give alert that all players assigned

//on click method icon
	//when game round activates show all possible moves to player1 and ask them to choose, msg player1 to wait for player 2
	//after player1 chooses show them all possible moves and ask them to choose, after second choice is made update game board
	//mesg both users their	choices, a line of 'this beats that' then a line that player(1 or 2) Wins. use the name they signed in with.

	



