function memoryInit(memoryElementsInner, memoryElementsFront){
	selectTails()
	
	Array.prototype.forEach.call(memoryElementsInner, (element) => {
		element.addEventListener("click", showCard);
	});
	
	setTimeout( function(){
		memoryElementsFront = attachImagesRandomly(memoryElementsFront, memoryElementsFront.length);
	}, 1000);
	document.getElementById("pointTab").innerHTML="Points: "+points;
}

function attachImagesRandomly(elements, amount){
	let namesOfPng = ['Images/1.png', 'Images/2.png', 'Images/3.png', 'Images/4.png', 'Images/5.png', 'Images/6.png', 'Images/7.png', 'Images/8.png'];
	let setNamesCounter = [ 0, 0, 0, 0, 0, 0, 0, 0];
	let background;
	let backgroundSelected;
	Array.prototype.forEach.call(elements, (element) => {
		backgroundSelected = false;
		while(backgroundSelected == false){
			background = Math.floor(Math.random()*amount);
			if(setNamesCounter[background]==0 || setNamesCounter[background]==1){
				setNamesCounter[background]++;
				element.firstChild.setAttribute("src",namesOfPng[background]);
				backgroundSelected = true;
			}
		}
	});

	return elements;
}

function selectTails(){
	let tails = Math.floor(Math.random()*22)+1;
	let name = "url('Images/tails/"+tails+".png')";
	let back = document.getElementsByClassName("memoryElementBack");
	for(let element of back){
		element.style.backgroundImage = name;
	}
	
}

function timerFunction(){
	let i=180;
	let minutes;
	let secounds;

	minutes=Math.floor(i/60);
	secounds=i%60;
	if(secounds<10){
		document.getElementById("timeTab").innerHTML=minutes+" : 0"+secounds;
	}
	else{
		document.getElementById("timeTab").innerHTML=minutes+" : "+secounds;
	}
	timeInterval = setInterval(function(){
		minutes=Math.floor(i/60);
		secounds=i%60;
		if(secounds<10){
			document.getElementById("timeTab").innerHTML=minutes+" : 0"+secounds;
		}
		else{
			document.getElementById("timeTab").innerHTML=minutes+" : "+secounds;
		}
		i--;
		if(i==-1){
			clearInterval(timeInterval);
			stop();
			if(points<8){
				lose();
			}
		}
	}, 1000);
}

function newGame(){
	points = 0;
	let memoryElementsFront = document.getElementsByClassName("memoryElementFront");
	let memoryElementsInner = document.getElementsByClassName("memoryElementInner");
	let flipElements = document.getElementsByClassName("memoryElementFlip");
	while(flipElements.length>0){
		for (let element of flipElements){
			element.classList.toggle("memoryElementFlip");
		}
	}
	clearInterval(timeInterval)
	memoryInit(memoryElementsInner, memoryElementsFront);
	timerFunction();
}

function showCard(e){
	let target = e.target;
	target.parentElement.classList.toggle("memoryElementFlip");
	let flipElements = document.getElementsByClassName("memoryElementFlip").length;
	let modFlipElements = flipElements % 2;
	if(modFlipElements==1){
		toCheckElements[0]=target;
	}
	else if(modFlipElements==0){
		let memoryElementsInner = document.getElementsByClassName("memoryElementInner");
		Array.prototype.forEach.call(memoryElementsInner, (element) => {
			element.removeEventListener("click", showCard);
		});
		toCheckElements[1]=target;
		setTimeout(function(){
			if(check()){
				points++;
				if(points == 8){
					clearInterval(timeInterval)
					win();
				}
			}
			else{
				toCheckElements[0].parentElement.classList.toggle("memoryElementFlip");
				toCheckElements[1].parentElement.classList.toggle("memoryElementFlip");
			}
			memoryElementsInner = document.getElementsByClassName("memoryElementInner");
			flipElements = document.getElementsByClassName("memoryElementFlip");

			Array.prototype.forEach.call(memoryElementsInner, (element) => {
				element.addEventListener("click", showCard);
			});
			Array.prototype.forEach.call(flipElements, (element) => {
				element.removeEventListener("click", showCard);
			});
			document.getElementById("pointTab").innerHTML="Points: "+points;
		}, 700);

	}
}
function win(){
	let rankingBoard = new Array();

	let rankPos = document.getElementsByClassName("rankPos");

	Array.prototype.forEach.call(rankPos, (pos) => {
		let nick = pos.firstElementChild.firstElementChild.textContent;
		let scoreMin = pos.firstElementChild.nextElementSibling.textContent.substring(0,1);
		let scoreSec = pos.firstElementChild.nextElementSibling.textContent.substring(2,4);
		let score = parseInt(scoreMin)*60+parseInt(scoreSec);
		rankingBoard.push([nick ,score]);
	});

	let currNick = document.getElementById("playerName").textContent;
	let currMin = document.getElementById("timeTab").textContent.substring(0,1);
	let currSec = document.getElementById("timeTab").textContent.substring(4,6);
	
	let currScore = parseInt(currMin)*60+parseInt(currSec);

	rankingBoard.push([currNick, currScore]);
	rankingBoard = rankingBoard.sort((a,b)=> { return a[1]-b[1];});
	rankingBoard.reverse();


	while(rankPos.length>0){
		for(let rank of rankPos){
			rank.remove();
		}
	}
	
	let maxLen = 11;
	if(rankingBoard.length<11){
		maxLen = rankingBoard.length;
	}

	for(let i=0; i<maxLen; i++){
		let id = (i+1)+". ";

		let minutes;
		let secounds;
	
		let fullTime = parseInt(rankingBoard[i][1]);
		minutes=Math.floor(fullTime/60);
		let time = minutes+":";
		secounds=fullTime%60;
		if(secounds<10){
			time += "0"+secounds;
		}
		else{
			time += secounds;
		}


		addScore(id, rankingBoard[i][0], time);
	}

	setText(rankingBoard);

}
function addScore(id ,login, time){
	let rankPos = document.createElement("div");
	let rankPosClass = document.createAttribute("class");
	rankPosClass.value = "rankPos";
	rankPos.setAttributeNode(rankPosClass);
	let ranking = document.getElementById("ranking");
	ranking.appendChild(rankPos);
	let nick = document.createElement("div");
	let nickClass = document.createAttribute("class");
	nickClass.value = "nick";
	nick.setAttributeNode(nickClass);
	rankPos.appendChild(nick);
	let score = document.createElement("div");
	let scoreClass = document.createAttribute("class");
	scoreClass.value = "score";
	score.setAttributeNode(scoreClass);
	rankPos.appendChild(score);
	nick.innerHTML = id;
	score.innerHTML = time;
	let span = document.createElement("span");
	span.innerHTML = login;
	nick.appendChild(span);
}
function stop(){
	let memoryElementsInner = document.getElementsByClassName("memoryElementInner");
	for (let element of memoryElementsInner){
		element.removeEventListener("click", showCard);
	}
}
function lose(){
	alert("You lose. Try again!");
}

function getText(){
	jQuery.get("ranking.json").done(res => {						//Pobranie zawartości 
		let maxLen = 11;
		if(res.ranking.length<11){
			maxLen = res.ranking.length;
		}
	
		for(let i=0; i<maxLen; i++){
			let id = res.ranking[i].id+". ";
	
			let minutes;
			let secounds;
		
			let fullTime = parseInt(res.ranking[i].time);
			minutes=Math.floor(fullTime/60);
			let time = minutes+":";
			secounds=fullTime%60;
			if(secounds<10){
				time += "0"+secounds;
			}
			else{
				time += secounds;
			}
			addScore(id, res.ranking[i].login, time);
		}


	});
}
function setText(rankingBoard){
	let jsonRank="";
	let maxLen = 11;
	if(rankingBoard.length<11){
		maxLen = rankingBoard.length;
	}
	for(let i=0; i<maxLen; i++){
		let j = i+1;
		let pos = '{"id":"'+j+'", "login":"'+rankingBoard[i][0]+'", "time":"'+rankingBoard[i][1]+'"},';
		jsonRank += pos;
	}
	jsonRank = jsonRank.slice(0,-1);
	jsonRank = '{"ranking" :['+jsonRank+']}';
	
	jQuery.post("saveRanking.php", {jsonRank:jsonRank}, "json");

}

function check(){
	if(toCheckElements[0].classList != "memoryElementBack"){
		var firstElement = toCheckElements[0].firstChild.nextElementSibling.nextElementSibling.firstChild.getAttribute("src");
	}
	else{
		var firstElement = toCheckElements[0].nextElementSibling.firstChild.getAttribute("src");
	}
	if(toCheckElements[1].classList != "memoryElementBack"){
		var secoundElement = toCheckElements[1].firstChild.nextElementSibling.firstChild.getAttribute("src");
	}
	else{
		var secoundElement = toCheckElements[1].nextElementSibling.firstChild.getAttribute("src");
	}
	if(firstElement == secoundElement){
		return true;
	}
	else{
		return false;
	}
}

function logIn(){
	document.getElementById("toLogIn").addEventListener("click", log);
}

function log(){
	let form = document.getElementById("logInForm");
	function handleForm(event) { event.preventDefault(); } 
	form.addEventListener('submit', handleForm);	
	let login = document.getElementById("loginInput").value;
	if(login == ""){
		alert("Please set login");
	}
	else{
		document.getElementById("logInBox").setAttribute("style","display:none;");
		document.getElementById("playerName").innerHTML = login;
		timerFunction();
	}
}

var points=0;
var toCheckElements= new Array;
function memoryGame(){
	document.getElementById("newGame").addEventListener("click", newGame);
	let memoryElementsFront = document.getElementsByClassName("memoryElementFront");
	let memoryElementsInner = document.getElementsByClassName("memoryElementInner");
	memoryInit(memoryElementsInner, memoryElementsFront);
}

window.onload = function(){
	getText();
	logIn();
	memoryGame();
}