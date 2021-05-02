let nums = ["1", "2", "3"];
let fills = ["H", "O", "S"];
let colors = ["g", "p", "r"];
let shapes = ["D", "P", "S"];
let deck;
let cardsOnBoard;
let setToShow;
let isAutoCardDealerEnabled;
let selectedPlayerIndex;
let selectedCards;
let gameMode;
let difficulty;

function game(gameM, diff, setFinder, cardDealer) {
    let menuContainer = document.querySelector(".menu-container");
    let inGameContainer = document.querySelector(".in-game-container");
    menuContainer.style.display = "none";
    inGameContainer.style.display = "block";

    gameMenu(gameM, setFinder, cardDealer);
    gameMode = gameM;
    difficulty = diff;

    loadDeck(diff);
    shuffleDeck();

    for (let card of deck) {
        console.log(card);
    }

    setToShow = [];
    selectedCards = [];
    setFirstCardsOnBoard();
    displayHowManyCardsLeftInTheDeck();
}

function addEventListenerToGameComponents() {
    let playersContainer = document.querySelector(".players-container");
    playersContainer.addEventListener("click", selectPlayer);

    let boardContainer = document.querySelector(".board-container");
    boardContainer.addEventListener("click", selectCard);
}

function loadDeck(difficulty) {
    deck = [];

    if (difficulty == "advanced-difficulty") {
        loadAdvancedDeck();
    } else {
        loadNormalDeck();
    }
}

function loadAdvancedDeck() {
    for (let num of nums) {
        for (let fill of fills) {
            for (let color of colors) {
                for (let shape of shapes) {
                    deck.push(num + fill + color + shape);
                }
            }
        }
    }
}

function loadNormalDeck() {
    for (let num of nums) {
        for (let shape of shapes) {
            for (let color of colors) {
                deck.push(num + fills[2] + color + shape);
            }
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function setFirstCardsOnBoard() {
    cardsOnBoard = [];
    for (let i = 0; i < 12; i++) {
        cardsOnBoard.push(getNextCard());
    }

    if (isAutoCardDealerEnabled) {
        while(!checkIfThereIsSetOnBoard()) {
            setPlusThreeCards();
        }
    }

    displayBoard();
}

function getNextCard() {
    let card = deck[0];
    deck.splice(0,1);
    return card;
}

function setPlusThreeCards() {
    if (deck.length > 2) {
        for (let i = 0; i < 3; i++) {
            cardsOnBoard.push(getNextCard());
        }

        displayBoard();
        displayHowManyCardsLeftInTheDeck();
    }
}

function displayBoard() {
    let boardContainer = document.querySelector(".board-container");
    let cardTemplate = '<div class="card-container d-flex justify-content-center col-4"><img draggable="false" data-card="card-name" src="assets/cards/card-name.svg" class="card"></div>';
    let cardTemplateIfShownInSet = '<div class="card-container d-flex justify-content-center col-4"><img draggable="false" data-card="card-name" src="assets/cards/card-name.svg" class="card card-shown-in-set"></div>';
    let cardTemplateIfShownInSetAndSelected = '<div class="card-container d-flex justify-content-center col-4"><img draggable="false" data-card="card-name" src="assets/cards/card-name.svg" class="card card-shown-in-set card-selected"></div>';
    let cardTemplateIfSelected = '<div class="card-container d-flex justify-content-center col-4"><img draggable="false" data-card="card-name" src="assets/cards/card-name.svg" class="card card-selected"></div>';
    boardContainer.innerHTML = "";

    for (let card of cardsOnBoard) {
        if (setToShow != null && setToShow.includes(card)) {
            if (selectedCards.includes(card)) {
                boardContainer.innerHTML += cardTemplateIfShownInSetAndSelected.replaceAll("card-name", card);
            } else {
                boardContainer.innerHTML += cardTemplateIfShownInSet.replaceAll("card-name", card);
            }
        } else {
            if (selectedCards.includes(card)) {
                boardContainer.innerHTML += cardTemplateIfSelected.replaceAll("card-name", card);
            } else {
                boardContainer.innerHTML += cardTemplate.replaceAll("card-name", card);
            }
        }
    }
}

function checkIfThereIsSetOnBoard() {
    if (getFirstSetFromBoard() == null) {
        return false;
    }

    return true;
}

function getFirstSetFromBoard() {
    let length = cardsOnBoard.length;
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            for (let k = j + 1; k < length; k++) {
                if (checkIfSet(cardsOnBoard[i], cardsOnBoard[j], cardsOnBoard[k])) {
                    let set = [cardsOnBoard[i], cardsOnBoard[j], cardsOnBoard[k]];
                    return set;
                }
            }
        }
    }

    return null;
}

function checkIfSet(card1, card2, card3) {
    for (let i = 0; i < 4; i++) {
        let isCardsQualityAllEqual = card1.charAt(i) == card2.charAt(i) && card2.charAt(i) == card3.charAt(i) && card1.charAt(i) == card3.charAt(i);
        let isCardsQualityAllUnequal = card1.charAt(i) != card2.charAt(i) && card2.charAt(i) != card3.charAt(i) && card1.charAt(i) != card3.charAt(i);
        if (!(isCardsQualityAllEqual || isCardsQualityAllUnequal)) {
            return false;
        }
    }

    return true;
}

function selectPlayer(event) {
    let source = event.target;
    if (players.length > 1 && turnTimerInterval == null) {
        selectedPlayerIndex = -1;
        for (let i = 0; i < players.length; i++) {
            if (players[i].name == source.dataset.name && !players[i].isOut) {
                selectedPlayerIndex = i;

                timeLeftFromTurn = 30;
                let turnTimer = document.querySelector(".turn-timer");
                turnTimer.style.display = "block";
                let template = "SECs left from your turn.<br>";
                turnTimer.innerHTML = template.replace("SEC", timeLeftFromTurn);

                turnTimerInterval = setInterval(function () {
                    if (timeLeftFromTurn > 1) {
                        timeLeftFromTurn = timeLeftFromTurn - 1;
                        
                        let template = "SECs left from your turn.<br>";
                        turnTimer.innerHTML = template.replace("SEC", timeLeftFromTurn);
                    } else {
                        clearInterval(turnTimerInterval);
                        turnTimerInterval = null;

                        handleNoTurnTimeLeft();
                        selectedPlayerIndex = -1;

                        displayPlayers();
                        displayBoard();
                        turnTimer.style.display = "none";
                    }
                }, 1000);

                displayPlayers();
            }
        }
    }
}

function selectCard(event) {
    let source = event.target;

    if (selectedPlayerIndex != -1) {
        if (selectedCards.length < 3) {
            if (selectedCards.includes(source.dataset.card)) {
                selectedCards.remove(source.dataset.card);
            } else if (source.dataset.card != null) {
                selectedCards.push(source.dataset.card);
            }
    
            handleSelectionOfThreeCards();
            displayBoard();
        } else {
            if (selectedCards.includes(source.dataset.card)) {
                selectedCards.remove(source.dataset.card);
                displayBoard();
            }
        }
    }
}

function handleSelectionOfThreeCards() {
    if (selectedCards.length == 3) {
        clearInterval(turnTimerInterval);
        turnTimerInterval = null;
        let turnTimer = document.querySelector(".turn-timer");
        turnTimer.style.display = "none";

        if (checkIfSet(selectedCards[0], selectedCards[1], selectedCards[2])) {
            players[selectedPlayerIndex].points = players[selectedPlayerIndex].points + 1;

            removeSelectedCardsFromBoard();
            setNewCardsOnBoard();
            resetHint();
        } else {
            handleWrongCardsSelection();
        }
        
        activateSingleOrMultiplayerMode();
        selectedCards = [];

        reenablePlayersIfAllOut();
        displayHowManyCardsLeftInTheDeck();

        displayPlayers();

        setGameEnd();
    }
}

function removeSelectedCardsFromBoard() {
    for (let card of selectedCards) {
        cardsOnBoard.remove(card);

        if (setToShow != null && setToShow.includes(card)) {
            setToShow = [];
        }
    }
}

function setNewCardsOnBoard() {
    if ((cardsOnBoard.length < 12 && deck.length > 2) || (isAutoCardDealerEnabled && !checkIfThereIsSetOnBoard() && deck.length > 2)) {
        setPlusThreeCards();

        while(!checkIfThereIsSetOnBoard()) {
            displayBoard();
            setPlusThreeCards();
        }
    }
}

function handleNoTurnTimeLeft() {
    if (players[selectedPlayerIndex].points != 0) {
        players[selectedPlayerIndex].points = players[selectedPlayerIndex].points - 1;
    }

    players[selectedPlayerIndex].isOut = true;
    reenablePlayersIfAllOut();
}

function handleWrongCardsSelection() {
    if (players[selectedPlayerIndex].points != 0) {
        players[selectedPlayerIndex].points = players[selectedPlayerIndex].points - 1;
    }

    players[selectedPlayerIndex].isOut = true;
}

function reenablePlayersIfAllOut() {
    let isAllOut = true;
    for (let player of players) {
        if (!player.isOut) {
            isAllOut = false;
        }
    }

    if (isAllOut) {
        for (let player of players) {
            player.isOut = false;
        }
    }
}

function setGameEnd() {
    if (!checkIfThereIsSetOnBoard() && deck.length == 0) {
        storeLeaderboard();
        
        stopSessionTimerInterval();
        disableAllPlayers();

        let hintButton = document.querySelector(".hint-button");
        let showSetButton = document.querySelector(".show-set-button");
        hintButton.setAttribute("disabled", "disabled");
        showSetButton.setAttribute("disabled", "disabled");

        let noMoreSets = document.querySelector(".no-more-sets");
        noMoreSets.style.display = "block";

        let deckCardNumber = document.querySelector(".deck-card-number");
        deckCardNumber.style.display = "none";
    }
}

function disableAllPlayers() {
    for (let player of players) {
        player.isOut = true;
    }
}

function storeLeaderboard() {
    if (gameMode == "competition") {
        let leaderboard = loadLeaderboard(players.length == 1, difficulty);

        if (leaderboard == null) {
            leaderboard = [];
        }

        if (leaderboard.length >= 10) {
            if ((players.length == 1 && leaderboard[9].points <= players[0].points) || 
            (players.length == 1 && leaderboard[9].sessionTime <= players[0].sessionTime)) {
                leaderboard.remove(leaderboard[9]);
            }
        }

        if (gameMode == "competition" && players.length == 1) {
            players[0].sessionTime = time;
        }

        leaderboard.push(players[0]);

        if (players.length == 1) {
            orderPlayersBasedOnTime(leaderboard);
        } else {
            orderPlayersBasedOnPoints(leaderboard);
        }

        localStorage.setItem("single-player:" + (players.length == 1) + ";" + difficulty + ";leaderboard", JSON.stringify(leaderboard));
    }
}

function orderPlayersBasedOnTime(playersArr) {
    playersArr.sort(function(a, b) {
        return a.sessionTime - b.sessionTime;
    });
}

function orderPlayersBasedOnPoints(playersArr) {
    playersArr.sort(function(a, b) {
        return b.points - a.points;
    });
}

function loadLeaderboard(isSinglePlayer, diff) {
    return JSON.parse(localStorage.getItem("single-player:"+ isSinglePlayer + ";" + diff + ";leaderboard",));
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
