/**
 * Game of Life
 *
 * @author Hajcskó Patrik
 * @version 1.0
 */
 
 //cellák száma
var rows = 1000;
 //oszlopok száma
var cols = 100;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

// a folyamat lefutási ideje
var timer;
var reproductionTime = 100;

function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Elindítás
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

// Tábla beállítása
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // hiba esetén
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "sejtpusztulas");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

    function cellClickHandler() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "sejtpusztulas");
            grid[row][col] = 0;
        } else {
            this.setAttribute("class", "osztodas");
            grid[row][col] = 1;
        }
        
    }

    function updateView() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "sejtpusztulas");
                } else {
                    cell.setAttribute("class", "osztodas");
                }
            }
        }
    }

function setupControlButtons() {
    // Inditó gomb
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // Rácsot letisztitó gomb
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
}

// Letisztíja a rácsot
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("osztodas");
    // Konvertálja a tömböket és az élő sejteken dolgozik
    // és a frissítés nem működik!
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "sejtpusztulas");
    }
    resetGrids;
}

// inditás/pause/folytatás a játékban
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

// a játé futása
function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // NextGrid-et rácsra másolás és visszaállítás a nextGrid-et
    copyAndResetGrid();
    // Minden 1 values másolása
    updateView();
}

// Szabályok
// A sejt túléli a kört, ha két vagy három szomszédja van.
// A sejt elpusztul, ha kettőnél kevesebb (elszigetelődés), vagy háromnál több (túlnépesedés) szomszédja van.
// Új sejt születik minden olyan cellában, melynek környezetében pontosan három sejt található.


function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }

// Cellák vizsgálata oszloponként a sejt alatt, felett, jobb alsó, bal alsó, jobb felső, bal felső, jobb és bal    
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

// Minden elindítása
window.onload = initialize;
