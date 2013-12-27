var CompHand = []

var CompHandDisplay = []

var YourHand = []

var YourHandDisplay = []

var gameOver = true

var stay_ind = false

var soft_ind = false

var winsLosses = []

var chips = 1000

var bet = 0



var Suits = ["&spades;","&clubs;","&diams;","&hearts;"]



var scorer = function(Hand){

	var score = 0;

	var countAces = 0;

	for(var i = 0; i <= Hand.length-1; i++) {

		if(Hand[i]>=10){

			score += 10;

		}else if(Hand[i]===1){

			countAces++

	    }else{

			score = score + Hand[i];

		};

	};

	if(countAces > 0){

		if(score+11>21){

			score++

			soft_ind = false

		}else{

			score += 11;

			if(Hand === CompHand){

				soft_ind = true

			}

		};

	};

	if(countAces > 1){

		score = score + countAces-1

	}

	return score

}



var CheckBJ = function(TheHand){

if(scorer(TheHand)===21){

		return true;

	}else{

		return false;

	};

}


//Process and style hand
var Display = function(Hand,TheDisplay){

	var TheSuit = Suits[Math.floor(Math.random()*4)]

	var color = ""

	if(TheSuit === "&diams;" || TheSuit === "&hearts;"){

		color = "red";

		}else{

		color = "black";

	};

	if(Hand[Hand.length-1] === 1){

		TheDisplay.push("<font color ="+color+">"+"A"+ TheSuit+"</font>");

	}else if(Hand[Hand.length-1] === 11){

		TheDisplay.push("<font color ="+color+">"+"J"+ TheSuit+"</font>");

	}else if(Hand[Hand.length-1] === 12){

		TheDisplay.push("<font color ="+color+">"+"Q"+ TheSuit+"</font>");

	}else if(Hand[Hand.length-1] === 13){

		TheDisplay.push("<font color ="+color+">"+"K"+ TheSuit+"</font>");

	}else{TheDisplay.push("<font color ="+color+">"+Hand[Hand.length-1]+ TheSuit+"</font>")};

};



var hit = function(){

	if(gameOver===false){

	YourHand.push(Math.floor(Math.random()*13 +1));

	Display(YourHand,YourHandDisplay);

	writeHand("userHand", YourHandDisplay )

	write_to_screen()

	}

};

var stay = function(){

	stay_ind = true

	if(gameOver===false){

		Display(CompHand,CompHandDisplay)

		writeHand("computerHand", CompHandDisplay)

		while(scorer(CompHand)<17 || (scorer(CompHand)<18 && soft_ind ===true)){

			CompHand.push(Math.floor(Math.random()*13 +1));

			Display(CompHand,CompHandDisplay);

			writeHand("computerHand", CompHandDisplay)

		};

		write_to_screen()

	};

};


//Writes hand to screen
//user is the div ID of the hand
// hand is the hand after it's been processed by Display()
var writeHand = function(user, hand){

	//clear existing hand
	document.getElementById(user).innerHTML = ""

	//write hand to div
	for(var i = 0; i <hand.length; i++){

		document.getElementById(user).innerHTML  += hand[i] + " "
	}

};


var write_to_screen = function(){

	if(scorer(YourHand)>21){

		document.getElementById("message").innerHTML = "BUSTED! YOU LOSE!"

		gameOver = true

		winsLosses[1] ++

		document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]

	}else if(scorer(CompHand)>21){

		document.getElementById("message").innerHTML = "DEALER BUSTED! YOU WIN!"

		gameOver = true

		chips += bet * 2;

		winsLosses[0] ++

		document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0]

	}else if(scorer(CompHand)>scorer(YourHand) && stay_ind){

				document.getElementById("message").innerHTML = "You have " +scorer(YourHand)+ " to the Dealer's " + scorer(CompHand) +". You Lose!"

		gameOver = true

		winsLosses[1] ++

		document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]

	}else if(scorer(CompHand)<scorer(YourHand) && stay_ind){

				document.getElementById("message").innerHTML = "You have " +scorer(YourHand)+ " to the Dealer's " + scorer(CompHand) +". You Win!"

		gameOver = true

		chips += bet * 2;

		winsLosses[0] ++

		document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0]

	}else if(scorer(CompHand)===scorer(YourHand) && stay_ind){

				document.getElementById("message").innerHTML = "You have " +scorer(YourHand)+ " to the Dealer's " + scorer(CompHand) +". You Push."

		gameOver = true

		chips += bet;

	};		

};



var new_game = function(){

	if(gameOver === true){

	CompHand = []

	CompHandDisplay = []

	YourHand = []

	YourHandDisplay = []

	gameOver = false

	stay_ind = false

	document.getElementById("record").rows[0].innerHTML = "Chips = " + chips

	document.getElementById("record").rows[1].cells[0].innerHTML = "Wins"

	document.getElementById("record").rows[1].cells[1].innerHTML = "Loses"

	document.getElementById("record").rows[2].cells[0].innerHTML = 0

	document.getElementById("record").rows[2].cells[1].innerHTML = 0

	winsLosses[0] = 0

	winsLosses[1] = 0

	//Gets the bet. If they press cancel or submit 0 there is no bet

	if(chips === 0){
		chips = 1000;
		bet=prompt("You lost all your chips :( Since I am so generous here are 1000 more :) Please enter your bet","0");
	}else{
		bet=prompt("You have " + chips + " chips. Please enter your bet","0");
	}

	while (bet > chips){

		bet=prompt("Not enough chips. You have " + chips + " chips. Please enter your bet","0");
	}

	chips -= bet;

	document.getElementById("record").rows[0].innerHTML = "Chips = " + chips

	for(var i = 0; i <8; i++){

		document.getElementById("computerHand").innerHTML = "";

		document.getElementById("userHand").innerHTML = "";

	}



	document.getElementById("message").innerHTML = "Hit or Stay?";



CompHand.push(Math.floor(Math.random()*13 +1));

Display(CompHand,CompHandDisplay);

CompHand.push(Math.floor(Math.random()*13 +1));

writeHand("computerHand", CompHandDisplay);



	for (var i = 0; i <= 1; i++) {

		YourHand.push(Math.floor(Math.random()*13 +1));

		Display(YourHand,YourHandDisplay);

	};
writeHand("userHand", YourHandDisplay);


if(CheckBJ(CompHand) === true && CheckBJ(YourHand) === false){

	Display(CompHand,CompHandDisplay);

	writeHand("computerHand", CompHandDisplay);

	document.getElementById("message").innerHTML = "DEALER BLACKJACK! YOU LOSE!";

	winsLosses[1] += 1.5;

	document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1];

	gameOver = true;

}



if(CheckBJ(YourHand) === true && CheckBJ(CompHand) === false){

	Display(CompHand,CompHandDisplay);

	writeHand("computerHand", CompHandDisplay);

	document.getElementById("message").innerHTML = "YOU HAVE BLACKJACK! YOU WIN!"

	winsLosses[0] += 1.5;

	chips += bet * 2.5;

	document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0];

	gameOver = true;

}



if(CheckBJ(YourHand) === true && CheckBJ(CompHand) === true){

	Display(CompHand,CompHandDisplay);

	writeHand("computerHand", CompHandDisplay);

	document.getElementById("message").innerHTML = "Both you and the dealer have BlackJack. Push!";

	chips += bet;

}

}



};



new_game()



if(gameOver === false){

write_to_screen();

document.getElementById("message").innerHTML = "Hit or Stay?";

};