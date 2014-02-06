var CompHand = []
var CompHandDisplay = []
var YourHand = []
var YourHandDisplay = []
var gameOver = true
var stay_ind = false
var soft_ind = false
var split_ind = false
var dd_ind = false
var split_hand = 0
var winsLosses = []
var YourHand2 = []
var YourHandDisplay2 = []
var theMessage = ""
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

var Display = function(Hand,TheDisplay,user){
var TheSuit = Suits[Math.floor(Math.random()*4)]
var color = ""
var card = ""

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

document.getElementById(user).innerHTML = ""
for(var i = 0; i <TheDisplay.length; i++){
	document.getElementById(user).innerHTML  += TheDisplay[i] + " "
}

};

var hit = function(){
	document.getElementById("ddButton").style.display  = "none"
	if(gameOver===false){
	if(split_ind===false || (split_ind===true && split_hand===1)){
	YourHand.push(Math.floor(Math.random()*13 +1));
	if(scorer(YourHand)>21){
		if(split_ind === false){
			gameOverSetup()
			document.getElementById("message").innerHTML = "Busted! You Lose!"
			winsLosses[1] ++
			document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]
		}else{
			theMessage = "First Hand: Busted! <br>"
			document.getElementById("message").innerHTML = theMessage
			winsLosses[1] ++
			document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]
			split_hand = 2
			hit()
		}
	};
	Display(YourHand,YourHandDisplay,"userHand");
	}else if(split_ind===true && split_hand===2){
	YourHand2.push(Math.floor(Math.random()*13 +1));
	Display(YourHand2,YourHandDisplay2,"userHand2");
	if(scorer(YourHand2)>21){
		theMessage += "Second Hand: Busted! <br>"
		document.getElementById("message").innerHTML = theMessage
		winsLosses[1] ++
		document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]
		split_hand = 2
		if(scorer(YourHand)<=21){stay()}else{gameOverSetup()}
	};
	};
	};

};

var stay = function(){
	stay_ind = true
	document.getElementById("ddButton").style.display  = "none"
	document.getElementById("splitButton").style.display  = "none"
	if(gameOver===false){
	if(split_ind === false || (split_ind === true && split_hand === 2)){
	Display(CompHand,CompHandDisplay,"computerHand")
		while(scorer(CompHand)<17 || (scorer(CompHand)<18 && soft_ind ===true)){
			CompHand.push(Math.floor(Math.random()*13 +1));
			Display(CompHand,CompHandDisplay,"computerHand");
		}
		winnerTest(YourHand);
		if(split_ind===true){
			theMessage += "<br>"
			winnerTest(YourHand2)}
		gameOverSetup()
	};
	if(split_ind === true && split_hand === 1){
	split_hand = 2;
	hit();
	};
	};
};

var doubleDown = function(){
	if(chips>=bet){
	dd_ind = true
	chips -= bet
	bet += bet
	document.getElementById("chips").innerHTML = "Chips = " + chips
	document.getElementById("betInput").value = bet
	document.getElementById("ddButton").style.display  = "none"
	hit()
	stay()
	}else{alert("Not Enough Chips to Double Down!")}
}

var split = function(){
	if(split_ind ===false && (chips>=bet)){
	document.getElementById("splitButton").disabled = true
	chips -= bet;
	document.getElementById("chips").innerHTML = "Chips = " + chips
	document.getElementById("betInput").innerHTML = bet*2
	split_ind = true
	split_hand = 1
	YourHand2.push(YourHand[1])
	YourHandDisplay2.push(YourHandDisplay[1])
	YourHand.splice(1,1);
	YourHandDisplay.splice(1,1);
	document.getElementById("userHand").innerHTML = YourHandDisplay[0] + " "
	document.getElementById("userHand2").innerHTML  = YourHandDisplay2[0] + " "
	hit()
	}else{alert("Can't Split!")}
};

var winnerTest = function(PlayerHand){
	if(scorer(PlayerHand)>21){
		return
	}else if(scorer(CompHand)>21){
		theMessage += "Dealer Busted! You Win! "
		winsLosses[0] ++
		chips += bet * 2;
		document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0]
			document.getElementById("chips").innerHTML = "Chips = " + chips
	document.getElementById("betInput").disabled = false
	gameOverSetup()
	}else if(scorer(CompHand)>scorer(PlayerHand)){
		theMessage += "You have " +scorer(PlayerHand)+ " to the Dealer's " + scorer(CompHand) +". You Lose! "
		winsLosses[1] ++
		document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]
		gameOverSetup()
	}else if(scorer(CompHand)<scorer(PlayerHand)){
		theMessage += "You have " +scorer(PlayerHand)+ " to the Dealer's " + scorer(CompHand) +". You Win! "
		winsLosses[0] ++
		chips += bet * 2;
		document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0]
		document.getElementById("chips").innerHTML = "Chips = " + chips
		gameOverSetup()
		document.getElementById("betInput").disabled = false
	}else if(scorer(CompHand)===scorer(PlayerHand)){
		theMessage += "You have " +scorer(PlayerHand)+ " to the Dealer's " + scorer(CompHand) +". You Push. "
		chips += bet
		document.getElementById("chips").innerHTML = "Chips = " + chips
		gameOverSetup()
	};
	document.getElementById("message").innerHTML = theMessage		
};

var new_game = function(){
	if(gameOver === true){
	CompHand = []
	CompHandDisplay = []
	YourHand = []
	YourHandDisplay = []
	YourHand2 = []
	YourHandDisplay2 = []
	gameOver = false
	stay_ind = false
	split_ind = false
	dd_ind = false
	soft_ind = false
	theMessage = ""
	document.getElementById("splitButton").disabled = false
	document.getElementById("splitButton").style.display = "none"
	document.getElementById("computerHand").innerHTML = ""
	document.getElementById("userHand").innerHTML = ""
	document.getElementById("userHand2").innerHTML = ""
	document.getElementById("message").innerHTML = "Hit or Stay?"
	document.getElementById("ddButton").style.display  = "block"
    bet = Number(document.getElementById("betInput").value)
	chips -= bet;
    document.getElementById("chips").innerHTML = "Chips = " + chips
	document.getElementById("betInput").disabled = true
	document.getElementById("submitBet").disabled = true


CompHand.push(Math.floor(Math.random()*13 +1));
Display(CompHand,CompHandDisplay,"computerHand");
CompHand.push(Math.floor(Math.random()*13 +1));

	for (var i = 0; i <= 1; i++) {
		YourHand.push(Math.floor(Math.random()*13 +1));
		Display(YourHand,YourHandDisplay,"userHand");
	};

if(CheckBJ(CompHand) === true && CheckBJ(YourHand) === false){
	Display(CompHand,CompHandDisplay,"computerHand");
	document.getElementById("message").innerHTML = "DEALER BLACKJACK! YOU LOSE!"
	winsLosses[1] ++
	document.getElementById("record").rows[2].cells[1].innerHTML = winsLosses[1]
	gameOverSetup()
}

if(CheckBJ(YourHand) === true && CheckBJ(CompHand) === false){
	Display(CompHand,CompHandDisplay,"computerHand");
	document.getElementById("message").innerHTML = "YOU HAVE BLACKJACK! YOU WIN!"
	winsLosses[0] += 1
	chips += bet * 2.5;
	document.getElementById("chips").innerHTML = "Chips = " + chips
	document.getElementById("record").rows[2].cells[0].innerHTML = winsLosses[0]
	gameOverSetup()
}

if(CheckBJ(YourHand) === true && CheckBJ(CompHand) === true){
	Display(CompHand,CompHandDisplay,"computerHand");
	document.getElementById("message").innerHTML = "Both you and the dealer have BlackJack. Push!"
	chips += bet
	document.getElementById("chips").innerHTML = "Chips = " + chips
	gameOverSetup()
}

if(YourHand[0]===YourHand[1] || (YourHand[0] > 9 && YourHand[1] > 9) && gameOver === false){	
	document.getElementById("splitButton").style.display  = "block";
};
}
};

winsLosses[0] = 0
winsLosses[1] = 0
    document.getElementById("chips").innerHTML = "Chips = " + chips
    document.getElementById("record").rows[1].cells[0].innerHTML = "Wins"
	document.getElementById("record").rows[1].cells[1].innerHTML = "Loses"
	document.getElementById("record").rows[2].cells[0].innerHTML = 0
	document.getElementById("record").rows[2].cells[1].innerHTML = 0
	document.getElementById("message").innerHTML = "Please Submit Your Bet";
	document.getElementById("betInput").innerHTML = 50
	document.getElementById("betInput").disabled = false
	document.getElementById("submitBet").disabled = false
//new_game()

var gameOverSetup = function(){
	document.getElementById("submitBet").disabled = false
	document.getElementById("betInput").disabled = false
	if(dd_ind===true){
		document.getElementById("betInput").value = bet/2
	}
	gameOver = true
};

if(gameOver === false){
document.getElementById("message").innerHTML = "Hit or Stay?";
};
