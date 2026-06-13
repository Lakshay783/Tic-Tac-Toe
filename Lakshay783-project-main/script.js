const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let gameState = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

function handleCellClick(event) {
  const index = Number(event.target.dataset.index);

  if (gameState[index] !== '' || !gameActive) return;

  gameState[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.disabled = true;

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  return WINNING_COMBOS.some(combo => {
    const [a, b, c] = combo;
    return gameState[a] !== '' &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c];
  });
}

function resetGame() {
  gameState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
