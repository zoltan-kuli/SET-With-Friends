class Player {
    constructor(name, points, isOut) {
        this.name = name;
        this.points = points;
        this.isOut = isOut;
        this.sessionTime = 0;
    }
}

function playersContainPlayerWithName(name) {
    let doesContain = false;
    
    for (let player of players) {
        if (player.name == name) {
            doesContain = true;
        }
    }

    return doesContain;
}

let players;
let isCurrentPlayerNameValid;
let playersSetterMainComponents;

function main() {
    players = [];
    isCurrentPlayerNameValid = false;

    playersSetterMainComponents = document.querySelector(".players-setter-main-components");
    playersSetterMainComponents.addEventListener("click", modifyPlayer);
    playersSetterMainComponents.addEventListener("submit", setNewPlayersSetterMainComponentsDefault);
    playersSetterMainComponents.addEventListener("input", checkPlayerNameValitidy);
    addEventListenersToGameMenuComponents();
    addEventListenerToGameComponents();

    document.querySelector(".game-mode-selector").addEventListener("change", toggleSettingsSelectors);
    toggleSettingsSelectors();

    let  startGameButton = document.querySelector(".start-game-button");
    startGameButton.addEventListener("click", startGame);

    setLeaderboards();
}

function toggleSettingsSelectors() {
    if (document.querySelector(".game-mode-selector").value == "competition") {
        document.querySelector(".set-finder-selector").setAttribute("disabled", "disabled");
        document.querySelector(".card-dealer-selector").setAttribute("disabled", "disabled");
        document.querySelector(".set-finder-selector").selectedIndex = 0;
        document.querySelector(".card-dealer-selector").selectedIndex = 0;
    } else {
        document.querySelector(".set-finder-selector").removeAttribute("disabled");
        document.querySelector(".card-dealer-selector").removeAttribute("disabled");
    }          
}

function modifyPlayer(event) {
    let currentElement = event.target;

    if (currentElement.classList.contains("fa-plus-square")) {
        checkPlayerNameValitidy();
        setNewPlayer();
    } else if (currentElement.classList.contains("fa-minus-square")) {
        deletePlayer(currentElement.parentElement);
    }
}

function setNewPlayersSetterMainComponentsDefault(event) {
    event.preventDefault();
    checkPlayerNameValitidy();
    setNewPlayer();
    displayPlayersComponents();
}

function checkPlayerNameValitidy () {
    let playerNameInput = document.querySelector(".player-name-input");
    let playerNameInputValue = playerNameInput.value;

    if (playerNameInputValue.length > 14) {
        isCurrentPlayerNameValid = false;
        playerNameInput.setCustomValidity("This name is too long.");
        playerNameInput.reportValidity();
    } else if (playerNameInputValue.length != 0) {
        if (playersContainPlayerWithName(playerNameInputValue)) {
            isCurrentPlayerNameValid = false;
            playerNameInput.setCustomValidity("This name is already taken.");
            playerNameInput.reportValidity();
        } else if (!playerNameInputValue.match(/^[A-Za-z0-9]+$/g)) {
            isCurrentPlayerNameValid = false;
            playerNameInput.setCustomValidity("Only English letters and numbers are allowed.");
            playerNameInput.reportValidity();
        } else {
            isCurrentPlayerNameValid = true;
            playerNameInput.setCustomValidity("");
            playerNameInput.reportValidity();
        }
    } else {
        isCurrentPlayerNameValid = false;
        playerNameInput.setCustomValidity("Please enter a name.");
        playerNameInput.reportValidity();
    }
}

function setNewPlayer() {
    if (isCurrentPlayerNameValid) {
        let playerNameInput = document.querySelector(".player-name-input");
        players.push(new Player(playerNameInput.value, 0, false));
        displayPlayersComponents();
    }
}

function deletePlayer(element) {
    let playerName = element.querySelector("a").innerText;
    let tmpArray = [];
    for (let player of players) {
        if (player.name != playerName) {
            tmpArray.push(player);
        }
    }

    players = tmpArray;

    displayPlayersComponents();
}

function displayPlayersComponents() {
    let playersSetterInputSpan = '<span class="col-12"><i type="button" class="fas fa-plus-square"></i><input class="player-name-input" placeholder="Player Name"></input></span>';
    let playersSetterMainComponentsPlayerSpanTemplate = '<span class="col-12"><i type="button" class="fas fa-minus-square"></i><a>Player Name</a></span>';    

    playersSetterMainComponents.innerHTML = "";
    for (let player of players) {
        playersSetterMainComponents.innerHTML += playersSetterMainComponentsPlayerSpanTemplate.replace("Player Name", player.name);
    }
    
    if (players.length < 10) {
        playersSetterMainComponents.innerHTML += playersSetterInputSpan;
    }

    let playerNameInput = document.querySelector(".player-name-input");
    if (playerNameInput != null) {
        playerNameInput.focus();
    }
}

function startGame() {
    if (players.length > 0) {
        resetPlayers();
        
        game(document.querySelector(".game-mode-selector").value, 
            document.querySelector(".difficulty-selector").value, 
            document.querySelector(".set-finder-selector").value, 
            document.querySelector(".card-dealer-selector").value);
    } else {
        let playerNameInput = document.querySelector(".player-name-input");
        playerNameInput.setCustomValidity("Please add a player.");
        playerNameInput.reportValidity();
    }
}

function resetPlayers() {
    for (let player of players) {
        player.points = 0;
        player.isOut = false;
    }
}

function setLeaderboards() {
    let singlePlayerNormal = document.querySelector(".single-player-normal-main-components");
    let singlePlayerAdvanced = document.querySelector(".single-player-advanced-main-components");
    let multipalyerNormal = document.querySelector(".multipalyer-normal-main-components");
    let multipalyerAdvanced = document.querySelector(".multiplayer-advanced-main-components");

    let singlePlayerNormalData = loadLeaderboard("true", "normal-difficulty");
    let singlePlayerAdvancedData = loadLeaderboard("true", "advanced-difficulty");
    let multiplayerNormalData = loadLeaderboard("false", "normal-difficulty");
    let multiplayerAdvancedData = loadLeaderboard("false", "advanced-difficulty");

    displayLeaderBoard(singlePlayerNormal, singlePlayerNormalData, true);
    displayLeaderBoard(singlePlayerAdvanced, singlePlayerAdvancedData, true);
    displayLeaderBoard(multipalyerNormal, multiplayerNormalData, false);
    displayLeaderBoard(multipalyerAdvanced, multiplayerAdvancedData, false);
}

function displayLeaderBoard(element, data, isSinglePlayer) {
    if (data != null) {
        element.innerHTML = "";
        let template = '<span><a>* NAME</a><a>RESULT</a></span>';

        let current = '<span><a>* NAME</a><a>RESULT</a></span>';
        for (let i = 0; i < data.length; i++) {
            if (i < 9) {
                current = template.replace("*", "#" + (i + 1) + "&nbsp;&nbsp;&nbsp;");
            } else {
                current = template.replace("*", "#" + (i + 1) + "&nbsp;");
            }

            current = current.replace("NAME", data[i].name);
            if (isSinglePlayer) {
                let sessionTime = data[i].sessionTime;
                let minutes = Math.floor(data[i].sessionTime / 60);
                let seconds = sessionTime - minutes * 60;
                current = current.replace("RESULT", minutes + "m " + seconds + "s");
            } else {
                current = current.replace("RESULT", data[i].points + "p");
            }

            element.innerHTML += current;
        }
    } else {
        element.innerHTML = "<span>No data has been found.</span>";
    }
}

main();
