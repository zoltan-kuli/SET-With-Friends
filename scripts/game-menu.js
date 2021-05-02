let sessionTimerInterval;
let turnTimerInterval;
let timeLeftFromTurn;
let time;

function gameMenu(gameMode, setFinder, cardDealer) {
    setHintAndShowSetFunctionality(setFinder);
    setPlusThreeCardsFuncionality(cardDealer);
    setSessionTimerInterval(gameMode, players.length);
    activateSingleOrMultiplayerMode();
    displayPlayers();
    
    let noMoreSets = document.querySelector(".no-more-sets");
    noMoreSets.style.display = "none";

    let deckCardNumber = document.querySelector(".deck-card-number");
    deckCardNumber.style.display = "block";

    let turnTimer = document.querySelector(".turn-timer");
    turnTimer.style.display = "none";
}

function addEventListenersToGameMenuComponents() {
    setQuitFunctionality();

    let hintButton = document.querySelector(".hint-button");
    let showSetButton = document.querySelector(".show-set-button");
    hintButton.addEventListener("click", showHint);
    showSetButton.addEventListener("click", showSet);

    let plusThreeCardsButton = document.querySelector(".plus-three-cards-button");
    plusThreeCardsButton.addEventListener("click", setPlusThreeCards);
}

function setQuitFunctionality() {
    let quitButton = document.querySelector(".quit-button");
    quitButton.addEventListener("click", quit);
}

function quit() {
    clearInterval(turnTimerInterval);
    turnTimerInterval = null;
    stopSessionTimerInterval();
    let template = "Your time is MINm SECs.<br>";
    let sessionTimer = document.querySelector(".session-timer");
    sessionTimer.innerHTML = template.replace("MIN", 0).replace("SEC", 0);
    let menuContainer = document.querySelector(".menu-container");
    let inGameContainer = document.querySelector(".in-game-container");
    menuContainer.style.display = "block";
    inGameContainer.style.display = "none";
    setLeaderboards();
}

function setHintAndShowSetFunctionality(setFinder) {
    let hintButton = document.querySelector(".hint-button");
    let hintText = document.querySelector(".hint");
    hintText.style.display = "none";
    let showSetButton = document.querySelector(".show-set-button");
    if (setFinder == "normal-set-finder") {
        showSetButton.setAttribute("disabled", "disabled");
        hintButton.removeAttribute("disabled");
    } else if (setFinder == "advanced-set-finder") {
        hintButton.removeAttribute("disabled");
        showSetButton.removeAttribute("disabled");
    } else {
        hintButton.setAttribute("disabled", "disabled");
        showSetButton.setAttribute("disabled", "disabled");
    }  
}

function showHint() {
    let noMoreSets = document.querySelector(".no-more-sets");

    if (noMoreSets.style.display == "none") {
        let hint = document.querySelector(".hint");
        hint.style.display = "block";
    
        if (checkIfThereIsSetOnBoard()) {
            hint.innerHTML = "Set can be found on the board.<br>";
        } else {
            hint.innerHTML = "There are no sets on the board.<br>";
        }
    }
}

function resetHint() {
    let hint = document.querySelector(".hint");
    hint.style.display = "none";
}

function showSet() {
    if (checkIfThereIsSetOnBoard() && setToShow.length == 0) {
        setToShow = getFirstSetFromBoard();
        displayBoard();
    }
}

function setPlusThreeCardsFuncionality(cardDealer) {
    let plusThreeCardsButton = document.querySelector(".plus-three-cards-button");

    if (cardDealer == "auto-card-dealer") {
        plusThreeCardsButton.setAttribute("disabled", "disabled");
        isAutoCardDealerEnabled = true;
    } else {
        plusThreeCardsButton.removeAttribute("disabled");
        isAutoCardDealerEnabled = false;
    }
}

function displayHowManyCardsLeftInTheDeck() {
    let deckCardNumber = document.querySelector(".deck-card-number");
    if (deck.length > 0) {
        let template = "NUM cards left in the deck.<br>";
        deckCardNumber.innerHTML = template.replace("NUM", deck.length);
    } else {
        deckCardNumber.innerHTML = "No more cards left in the deck";
    }
}

function setSessionTimerInterval(gameMode, numOfPlayers) {
    if (gameMode == "competition" && numOfPlayers == 1) {
        let sessionTimer = document.querySelector(".session-timer");
        sessionTimer.style.display = "block";
        let template = "Your time is MINm SECs.<br>";

        time = 0;
        sessionTimerInterval = setInterval(function() {
            time += 1;
            let minutes = Math.floor(time / 60);
            let seconds = time - minutes * 60;
            sessionTimer.innerHTML = template.replace("MIN", minutes).replace("SEC", seconds);
        }, 1000);
    } else {
        let sessionTimer = document.querySelector(".session-timer");
        sessionTimer.style.display = "none";
    }
}

function stopSessionTimerInterval() {
    clearInterval(sessionTimerInterval);
}

function displayPlayers() {
    orderPlayers();

    let playersContainer = document.querySelector(".players-container");
    playersContainer.innerHTML = "";
    for (let player of players) {
        let playerRow = getPlayerTemplate(player).replaceAll("NAME", player.name);

        if (player.points < 10) {
            playerRow = playerRow.replace("*", "&nbsp;&nbsp;" + player.points);
        } else {
            playerRow = playerRow.replace("*", player.points);
        }

        playersContainer.innerHTML += playerRow;
    }
}

function orderPlayers() {
    players.sort(function(a, b) {
        return b.points - a.points;
    });
}

function getPlayerTemplate(player) {
    let playerTemplateEnabled = '<span class="col-12" data-name="NAME"><a data-name="NAME">*p ~ NAME</a></span>';
    let playerTemplateDisabled = '<span class="disabled-player col-12" data-name="NAME"><a data-name="NAME">*p ~ NAME</a></span>';
    let playerTemplateSelected = '<span class="selected-player col-12" data-name="NAME"><a data-name="NAME">*p ~ NAME</a></span>';
    let template;

    if (player.isOut) {
        template = playerTemplateDisabled;
    } else {
        if (selectedPlayerIndex != -1 && players[selectedPlayerIndex].name == player.name) {
            template = playerTemplateSelected
        }  else {
            template = playerTemplateEnabled;
        }
    }

    return template;
}

function activateSingleOrMultiplayerMode() {
    if (players.length == 1) {
        selectedPlayerIndex = 0;
    } else {
        selectedPlayerIndex = -1;
    }
}
