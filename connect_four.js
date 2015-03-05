function ConnectFour(element, cols, rows) {
   this.element = element;
   this.rows = rows;
   this.cols = cols;
   this._columnHeight = Array.apply(null, new Array(cols)).map(Number.prototype.valueOf,0);
   this.turn = "red";
   this.isInSession = true;
   this._render();
}

ConnectFour.prototype = {
    _render: function() {
        this._renderHeader();
        this._renderStats();
        this._renderGrid();
        this._renderButton();
        this.element.innerHtml = "";
        this.element.appendChild(this._header);
        this.element.appendChild(this._stats);
        this.element.appendChild(this._grid);
        this.element.appendChild(this._buttonContainer);
        this.element.addEventListener("click", function(event) {
            if(event.target.nodeName === "DIV") {
                var indexes = this._indexOf(event.target);
                connectFour.addDisc(indexes[1]);
            }
            if (event.target.nodeName === "BUTTON") {
               this.clear();
            }
        }.bind(this));
    },
    _renderHeader: function() {
        this._header = document.createElement("h3");
        this._header.textContent = "Connect Four";
    },
    _renderButton: function() {
        this._buttonContainer = document.createElement("p");
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = "Restart Game";
        this._buttonContainer.appendChild(button)
    },
    _renderStats: function() {
        this._stats = document.createElement("p");
        this._switchTurns();
    },
    // Draw the grid with the containing circles
    _renderGrid: function() {
        this._grid = document.createElement("table");
        for(var i = 0; i < this.rows; i++) {
            var row = document.createElement("tr");
            for(var j = 0; j < this.cols; j++) {
                var td = document.createElement("td");
                var circle = document.createElement("div")
                circle.className = "circle";
                td.appendChild(circle);
                row.appendChild(td);
            }
            this._grid.appendChild(row)
        }
    },
    // Returns a cell for a given coordinate pair if one exists
    _getCell: function(i, j) {
        // Make sure (i,j) is a valid cell coordinate
        if(i >= 0 && j >= 0 && i < this.rows && j < this.cols) {
            return this._grid.childNodes[i].childNodes[j].childNodes[0];
        }
        return null;
    },
    // returns the index of a given cell
    _indexOf: function(cell) {
        var row = cell.parentNode.parentNode;
        console.log(row.parentNode.children);
        var i = Array.prototype.indexOf.call(row.parentNode.children, row);
        var j = Array.prototype.indexOf.call(row.children, cell.parentNode);
        return [i, j];
    },
    // switches between the two players turns
    _switchTurns: function() {
        if(this.turn === "red") {
            this.turn = "yellow";
        } else {
            this.turn = "red";
        }
        this._stats.textContent = "It's " + this.turn.toUpperCase() + "'s Turn!";
    },
    _gameOver: function() {
        this._stats.textContent = this.turn.toUpperCase() + " Player Has Won!";
        this.isInSession = false;
    },
    // figures out if the move just played is a winning move by exploring all possible winning paths
    _isWinner: function(i, j) {
        var cell = this._getCell(i,j)
        var color = cell.style.backgroundColor;
        // Check for row winner
        var rowCount = 1 + this._followPath(i, j, -1, 0, color) + this._followPath(i, j, 1, 0, color);
        // Check for col winner
        var colCount = 1 + this._followPath(i, j, 0, 1, color) + this._followPath(i, j, 0, -1, color);
        // check for diagonal winner
        var diagCount = 1 + this._followPath(i, j, 1, 1, color) + this._followPath(i, j, -1, -1, color);
        var revDiagCount = 1 + this._followPath(i, j, 1, -1, color) + this._followPath(i, j, -1, 1, color);

        if(rowCount >= 4 || colCount >= 4 || diagCount >= 4 || revDiagCount >= 4) {
            return true;
        }
        return false;
    },
    // recursively sums up how many consecutive cells have a given color along a path
    // described as a change to (i,j) of (dirX,dirY) at each step
    // i.e to follow a path along the right row of (i,j), keep adding (1,0) to the coordinates
    _followPath: function(i, j, dirX, dirY, color) {
        var potentialCell = this._getCell((i+dirX), (j+dirY));
        if(potentialCell == null || potentialCell.style.backgroundColor != color) {
            return 0;
        }
        return 1 + this._followPath((i+dirX), (j+dirY), dirX, dirY, color);
    },
    // Set the color of a cell given by coordinates
    setColor: function(i, j, color) {
        var cell = this._getCell(i, j)
        cell.style.backgroundColor = color;
        return this;
    },
    // Add a disc to the grid in the column specified
    addDisc: function(j) {
        if(!this.isInSession) {
            return this;
        }
        var colHeight = this._columnHeight[j];
        var rowLevel = this.rows - colHeight - 1;
        this._columnHeight[j]++;
        this.setColor(rowLevel, j, this.turn);
        if(this._isWinner(rowLevel, j)) {
          this._gameOver();
        } else {
          this._switchTurns();
        }
        return this
    },
    // Clear the grid and re-enable playing
    clear: function() {
        this._columnHeight = Array.apply(null, new Array(this.cols)).map(Number.prototype.valueOf,0);
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                this._getCell(i, j).style.backgroundColor = "";
            }
        }
        this.isInSession = true;
        this._switchTurns();
        return this;
    }
}

var rows = 6;
var cols = 7;
var connectFour = new ConnectFour(document.getElementById('main'), cols, rows);
