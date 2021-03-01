window.onload = init;

function init() {
    let button = document.getElementById("fireButton");
    button.onclick  = handleFireButton;
    let tds = document.querySelectorAll("td");
    tds.forEach( tag => tag.addEventListener('click',handleFireId))
    model.generateShipLocations();
}

function handleFireId(obj) {
    let list = ["A","B","C","D","E","F","G"];
    let guess = obj.target.id;
    guess = list[guess[0]] + guess[1];
    if (obj.target.classList.length != 0 ) {
        view.displayMassage("You Already Select That!");
    } else {
        controller.processGuess(guess);
    }
}

 
function handleFireButton() {
    let button = document.getElementById("guessInput");
    let guess = button.value;
    controller.processGuess(guess);
    button.value = "";
}





let view = {
    displayMassage(msg) {
        let massageArea = document.getElementById("massageArea");
        massageArea.innerHTML = msg;
    }
    ,displayHit(location) {
        let cell = document.getElementById(location);
        cell.classList.add('hit');
        
    }
    ,displayMiss(location) {
        let cell = document.getElementById(location);
        cell.classList.add('miss');
    }
};
 
let model = {
    bordersize:6
    ,numShips:3
    ,shipLength:3
    ,shipsSunk:0
    ,ships : [
             {location:["0","0","0"] , hits:["","",""]}
            ,{location:["0","0","0"] , hits:["","",""]}
            ,{location:["0","0","0"] , hits:["","",""]}
        ]
    ,fire : function (guess) {
        for (let i = 0 ; i < this.numShips ; i++){
            let ship = this.ships[i];
            let index = ship.location.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                if(this.isSink(ship)){
                    this.shipsSunk++;
                    view.displayMassage("You sunk my Battleship!")
                } 
                view.displayHit(guess);
                view.displayMassage("HIT!")
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMassage("Miss!")
        return false;
    }
    ,isSink(ship){
        for(let i = 0; i < this.shipLength ; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    }
    ,generateShipLocations() {
        
        let locations;
        for (let i = 0 ; i < this.numShips ; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));

            this.ships[i].location = locations;
            console.log('pass')
        }
    }
    ,generateShip() {
        let direction = Math.floor(Math.random()*2);
        let row , col;

        if (direction == 1) {
            row = Math.floor(Math.random() * this.bordersize);
            col = Math.floor(Math.random() * (this.bordersize - this.shipLength));
        } else {
            col = Math.floor(Math.random() * this.bordersize);
            row = Math.floor(Math.random() * (this.bordersize - this.shipLength)); 
        }

        let newShipLocation = [];
            for ( let i = 0 ; i < this.shipLength ; i++) {
                if (direction == 1) {
                    newShipLocation.push(row + "" + (col+i));
                }else {
                    newShipLocation.push((row+i) + "" + (col));
                }
            }
            
        return newShipLocation;
        }
    ,collision(locations) {
        for (let i = 0; i < this.numShips ; i++){
            let ship = model.ships[i];
            for (let location of locations) {
                if (ship.location.indexOf(location) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

let controller = {
guesses : 0
,processGuess(guess) {
    let location = this.parseGuess(guess);
    if (location){
        this.guesses++;
        let hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
            view.displayMassage(`You Sank All My Ships , in ${this.guesses} guesses`)
        }
    }
}
,parseGuess(guess) {
    let alphabet = ["A","B","C","D","E","F","G"];
    if (guess==null || guess.length != 2) {
        alert("Pls insert a Valid Number");
    } else {
        let firstChar = guess[0];
        let row = alphabet.indexOf(firstChar.toUpperCase());
        let column = guess[1]
        if(isNaN(row) || isNaN(column)) {
            alert("Ops, it is not on the board")
        } else if(row < 0 || row>model.bordersize || column < 0 || column>model.bordersize ) {
            alert("Ops, it is not on the board")
        } else {
            return row + column; 
        }
    }
    return null;
}
};

