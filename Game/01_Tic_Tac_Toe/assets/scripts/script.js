class DOMHelper {
    static classCombinator(purpose, elementId, cssClass) {
        const element = document.getElementById(elementId);
        if (purpose === 'add') {
            element.classList.add(cssClass);
        } else if (purpose === 'remove') {
            element.classList.remove(cssClass);
        }
    }
    
    static clearEventListener(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static showResult(result) {
        const cellElements = document.querySelectorAll('.map__cell');
        for (let i = 0; i < 3; i++) {
            if (result === `COL${i}`) {
                cellElements[i * 3].classList.add('result');
                cellElements[i * 3 + 1].classList.add('result');
                cellElements[i * 3 + 2].classList.add('result');
            }
            if (result === `ROW${i}`) {
                cellElements[i].classList.add('result');
                cellElements[i + 3].classList.add('result');
                cellElements[i + 6].classList.add('result');
            }
        }
        if (result === 'DIAGONAL1') {
            for (let i = 0; i < 9; i = i + 4) {
                cellElements[i].classList.add('result');
            }
        }
        if (result === 'DIAGONAL2') {
            for (let i = 2; i < 7; i = i + 2) {
                cellElements[i].classList.add('result'); 
            }
        }
    }
}

class RuleHelper {
    isGameEnd = false;
    winner = '';
    result = '';

    static checkWinner(board) {
        this.cheakGameisDone(board, 'O');
        this.cheakGameisDone(board, 'X');
        if (this.isGameEnd) {
            if (this.result === 'DRAW') {
                return this.result;
            }
            return this.winner;
        }
    }

    static cheakGameisDone(board, p) {
        let result;
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === p && board[i][1] === p && board[i][2] === p) {
                result = `COL${i}`;
            } 
            if (board[0][i] === p && board[1][i] === p && board[2][i] === p) {
                result = `ROW${i}`;
            }
        }
        if (board[0][0] === p && board[1][1] === p && board[2][2] === p) {
            result = 'DIAGONAL1';
        }
        if (board[0][2] === p && board[1][1] === p && board[2][0] === p) {
            result = 'DIAGONAL2';
        }

        let draw = 0;
        for (const row of board) {
            for (const col of row) {
                if (col !== 0) {
                    draw++;
                }
            }
        }

        if (draw === 9) {
            result = 'DRAW';
        }

        if (result) {
            let winner = p === 'O' ? 'Player 1' : 'Player 2';
            this.winner = winner;
            this.isGameEnd = true;
            DOMHelper.showResult(result);
            if (result === 'DRAW') {
                this.result = result;
            }
        }
    }
}

class Board {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    score = [0, 0];

    currentPlayer = 'p1';

    constructor() {
        this.showBoard();
        this.connectBoardElement();
        this.updatePlayerInfoBoard();
    }

    init(winner) {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        const cellElements = document.querySelectorAll('.map__cell');
        cellElements.forEach((cellElement, index) => {
            const childElement = cellElement.children[0];
            if (childElement) {
                cellElement.removeChild(childElement);
            }
            cellElement.classList.remove('result');
            cellElement = DOMHelper.clearEventListener(cellElement);
            cellElement.addEventListener('click', this.cellHandler.bind(this, index));
        });
        
        const boardResultElement = document.querySelector('.board__result');
        const boardHeaderElement = document.querySelector('.board__header');
        boardResultElement.classList.remove('end');
        boardHeaderElement.classList.remove('end');

        if (winner === 'DRAW') {
            RuleHelper.result = '';
        }
        
        this.updatePlayerInfoBoard();
        RuleHelper.isGameEnd = false;
    }

    updateBoardData(idx) {
        const row = parseInt(idx / 3);
        const col = idx % 3; 
        if (this.board[row][col] !== 0) {
            return 'FAIL';
        }
        this.board[row][col] = this.currentPlayer === 'p1' ? 'O' : 'X';
    }

    updatePlayerInfoBoard() {
        const player1Boards = document.querySelector('.board__player-1');
        const player2Boards = document.querySelector('.board__player-2');
        const player1Score = player1Boards.querySelector('.player-1__info--score');
        const player2Score = player2Boards.querySelector('.player-2__info--score');
        if (this.currentPlayer === 'p1') {
            player1Boards.classList.add('on');
            player2Boards.classList.remove('on');
        } else if (this.currentPlayer === 'p2') {
            player1Boards.classList.remove('on');
            player2Boards.classList.add('on');
        }
        player1Score.textContent = this.score[0];
        player2Score.textContent = this.score[1];
    }

    changeCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === 'p1' ? 'p2' : 'p1';
        this.updatePlayerInfoBoard();
    }

    showWinnerMessage(winner) {
        const boardResultElement = document.querySelector('.board__result');
        const boardHeaderElement = document.querySelector('.board__header');
        boardResultElement.classList.add('end');
        boardHeaderElement.classList.add('end');
        const boardResultMessageEl = boardResultElement.firstElementChild;
        const restartButtonElement = boardResultElement.lastElementChild;
        if (winner === 'DRAW') {
            boardResultMessageEl.textContent = 'Draw!';
        } else {
            boardResultMessageEl.textContent = `${winner} Win!`;
        }

        if (winner === 'Player 1') {
            this.score[0]++;
        } else if (winner === 'Player 2') {
            this.score[1]++;
        }

        restartButtonElement.addEventListener('click', this.init.bind(this, winner));
    }

    cellHandler(cellIndex, event) {
        const isUpdated = this.updateBoardData(cellIndex);
        if (isUpdated === 'FAIL') {
            return;
        }

        const markElement = document.createElement('i');
        markElement.className = this.currentPlayer === 'p1' ? 'far fa-circle' : 'fas fa-times';
        event.target.append(markElement);

        const winner = RuleHelper.checkWinner(this.board);

        if (winner) {
            this.showWinnerMessage(winner);
        }

        this.changeCurrentPlayer();
    }

    connectBoardElement() {
        const cellElements = document.querySelectorAll('.map__cell');
        cellElements.forEach((cellElement, index) => {
            cellElement.addEventListener('click', this.cellHandler.bind(this, index));
        });
    }

    showBoard() {
        DOMHelper.classCombinator('add', 'board', 'show')
    }
}

class App {
    static init() {
        this.pageStart();        
        this.connectStartButton();
    }

    static pageStart() {
        DOMHelper.classCombinator('add', 'description', 'page-start');
        DOMHelper.classCombinator('add', 'preview', 'page-start');
    }

    static connectStartButton() {
        const startBtn = document.querySelector('.start-btn');
        startBtn.addEventListener('click', this.gameStart.bind(this));
    }   

    static gameStart() {
        DOMHelper.classCombinator('remove', 'description', 'page-start');
        DOMHelper.classCombinator('remove', 'preview', 'page-start');
        DOMHelper.classCombinator('add', 'description', 'hidden');
        DOMHelper.classCombinator('add', 'preview', 'hidden');

        setTimeout(this.createGame, 700);
    }

    static createGame() {
        const board = new Board();
    }
}

App.init();