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
  const combo = WINNING_COMBOS.find(([a, b, c]) =>
    gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c]
  );
  if (combo) {
    drawWinLine(combo);
    return true;
  }
  return false;
}

function drawWinLine([a, b, c]) {
  const cellEls = [...cells];
  [a, b, c].forEach(i => cellEls[i].classList.add('winner'));

  const boardRect = board.getBoundingClientRect();
  const get = i => {
    const r = cellEls[i].getBoundingClientRect();
    return {
      x: r.left - boardRect.left + r.width / 2,
      y: r.top - boardRect.top + r.height / 2
    };
  };

  const p1 = get(a), p2 = get(c);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'win-line';
  svg.style.cssText = `position:absolute;top:0;left:0;width:${boardRect.width}px;height:${boardRect.height}px;pointer-events:none`;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
  line.setAttribute('stroke', '#f9ca24');
  line.setAttribute('stroke-width', '5');
  line.setAttribute('stroke-linecap', 'round');

  svg.appendChild(line);
  board.style.position = 'relative';
  board.appendChild(svg);
}

function resetGame() {
  gameState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
  });
  const old = document.getElementById('win-line');
  if (old) old.remove();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
