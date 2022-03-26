// Initial settings

import { dictionary } from "./assets/words.js";

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let randomIndex = Math.floor(Math.random() * dictionary.length);
let word = removeAccents(dictionary[randomIndex].toUpperCase());

console.log(word);

const height = 6;
const width = 5;

let row = 0; //attempt number
let col = 0; //current letter for that attempts

let gameOver = false;


window.onload = function () {
    initialize();
}


function initialize() {
    //Create the board
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let tile = document.createElement('span');
            tile.id = i.toString() + '-' + j.toString();
            tile.classList.add('tile');
            tile.innerText = '';
            document.getElementById('board').appendChild(tile);
        }
    }

    //Listen for KeyPress

    document.addEventListener('keyup', (event) => {
        if (gameOver) return;

        if ('KeyA' <= event.code && event.code <= 'KeyZ') {
            if (col < width) {
                let currentTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currentTile.innerText === '') {
                    currentTile.innerText = event.code[3];
                    col += 1;
                }
            }
        }
        else if (event.code === 'Backspace') {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currentTile = document.getElementById(row.toString() + '-' + col.toString());
            currentTile.innerText = '';
        }

        else if (event.code === 'Enter') {
            update();
            row += 1;
            col = 0;
        }

        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById('answer').innerText = word;
        }
    });

}

function update() {
    let correct = 0;
    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1
        } else {
            letterCount[letter] = 1;
        }
    }

    //First, check all the correct ones
    for (let j = 0; j < width; j++) {
        let currentTile = document.getElementById(row.toString() + '-' + j.toString());
        let letter = currentTile.innerText;

        // Is it in the correct position?
        if (word[j] == letter) {
            currentTile.classList.add('correct')
            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
            document.getElementById('answer').innerText = word;
        }
    }

    //go again and mark which ones are present but in wrong position
    for (let k = 0; k < width; k++) {
        let currentTile = document.getElementById(row.toString() + '-' + k.toString());
        let letter = currentTile.innerText;

        if (!currentTile.classList.contains('correct')) {
            //Is in the word?
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add('present');
                letterCount[letter] -= 1;
            } else {
                currentTile.classList.add('absent')
            }
        }
    }
}