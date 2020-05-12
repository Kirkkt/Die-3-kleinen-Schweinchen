/*
 * Board:
 *
 *  ##
 * ####
 * ####
 *  ###
 *
 * All the different pieces:
 *
 * a    Aa    aA    a
 * Aa   a      a   aA
 *
 *       b
 * bBb   B
 *       b
 *
 * c    Ccc   cC        c
 * c    c      c      ccC
 * Cc          c
 *
 * P P P
 *
 * W
 *
 */

let withColor = true
let outputToDocument = true

const PIECES = ['a', 'b', 'c']

const ROTATIONS = {
  p: 1,
  w: 1,
  a: 4,
  b: 2,
  c: 4,
}

const OFFSETS = {
  a: [
    [
      // a
      // Aa
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
    [
      // Aa
      // a
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ],
    [
      // aA
      //  a
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ],
    [
      //  a
      // aA
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ],
  ],
  b: [
    [
      // bBb
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ],
    [
      // b
      // B
      // b
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ],
  ],
  c: [
    [
      // c
      // c
      // Cc
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: -2 },
    ],
    [
      // Ccc
      // c
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
    ],
    [
      // cC
      //  c
      //  c
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    [
      //   c
      // ccC
      { x: -1, y: 0 },
      { x: -2, y: 0 },
      { x: 0, y: -1 },
    ],
  ],
}

const COLORS = {
  p: '#fca3c9',
  w: '#00c2f0',
  a: '#f2ae00',
  b: '#793b1c',
  c: '#db0000',
  '#': '#00c2f0',
}

const BOARD = [
  '', '#', '#', '',
  '#', '#', '#', '#',
  '#', '#', '#', '#',
  '', '#', '#', '#',
]

let puzzleIndex = 0;
let solutionIndex = 0;

const printBoardToConsole = (board) => {
  let output = ''
  const colorOptions = []
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const piece = board[y * 4 + x]
      if (piece === '' && !withColor) {
        output += ' '
      } else if (piece === '') {
        output += '%c '
        colorOptions.push(`color:black`)
      } else if (!withColor) {
        output += piece
      } else {
        output += `%c${piece}`
        colorOptions.push(`${piece === 'p' || piece === 'w' ? 'background' : 'color'}:${COLORS[piece.toLowerCase()]}`)
      }
    }
    output += '\n'
  }
  console.log(output, ...colorOptions)
}

const printBoardToDocument = (board) => {
  for (let y = 0; y < 4; y++) {
    const line = document.createElement('div')
    for (let x = 0; x < 4; x++) {
      const cell = document.createElement('span')
      cell.style.width = 10
      cell.style.display = 'inline-block'
      const piece = board[y * 4 + x]
      if (piece !== '') {
        cell.textContent = piece
        if (withColor && (piece === 'p' || piece === 'w')) {
          cell.style.background = COLORS[piece.toLowerCase()]
        } else if (withColor) {
          cell.style.color = COLORS[piece.toLowerCase()]
        }
      }
      line.appendChild(cell)
    }
    document.game.appendChild(line)
  }
}

const logToDocument = text => {
  const line = document.createElement('h3')
  line.textContent = text;
  document.game.appendChild(line)
}

const printBoard = (board) => outputToDocument ? printBoardToDocument(board) : printBoardToConsole(board)
const consoleLog = (text) => outputToDocument ? logToDocument(text) : console.log(text)

const canFit = (board, piece, rotation, position, isDayGame) => {
  if (isDayGame && board[position] !== '#') {
    return false
  }
  if (!isDayGame && board[position] !== 'p') {
    return false
  }
  const positionY = Math.floor(position / 4)
  const positionX = position % 4
  const offsets = OFFSETS[piece][rotation]
  for (const {x, y} of offsets) {
    const newPositionX = x + positionX
    const newPositionY = y + positionY
    const newPosition = newPositionY * 4 + newPositionX
    if (newPositionX < 0 || newPositionX >= 4 || newPositionY < 0 || newPositionY >= 4 || board[newPosition] !== '#') {
      return false
    }
  }
  return true
}

const placePiece = (board, piece, rotation, position) => {
  board[position] = piece.toUpperCase()
  const offsets = OFFSETS[piece][rotation]
  for (const {x, y} of offsets) {
    board[position + x + y * 4] = piece
  }
}

const removePiece = (board, piece, rotation, position, isDayGame) => {
  board[position] = isDayGame ? '#' : 'p'
  const offsets = OFFSETS[piece][rotation]
  for (const {x, y} of offsets) {
    board[position + x + y * 4] = '#'
  }
}

const solveGameStep = ({ originalBoard, board, pieceIndex, rotation, position, isDayGame }) => {
  if (pieceIndex === PIECES.length) {
    if (solutionIndex === 0) {
      consoleLog(`puzzle ${++puzzleIndex}:`);
      printBoard(originalBoard)
    }
    consoleLog(`puzzle ${puzzleIndex} - solution ${++solutionIndex}:`)
    printBoard(board)
    return
  }
  const piece = PIECES[pieceIndex]
  if (canFit(board, piece, rotation, position, isDayGame)) {
    placePiece(board, piece, rotation, position)
    solveGameStep({ originalBoard, board, pieceIndex: pieceIndex + 1, rotation: 0, position: 0, isDayGame })
    removePiece(board, piece, rotation, position, isDayGame)
  }
  if (rotation === ROTATIONS[piece] - 1 && position === board.length - 1) {
    return
  } else if (position === board.length - 1) {
    solveGameStep({ originalBoard, board, pieceIndex, rotation: rotation + 1, position: 0, isDayGame })
  } else {
    solveGameStep({ originalBoard, board, pieceIndex, rotation, position: position + 1, isDayGame })
  }
}

const solveGame = ({ originalBoard, board, isDayGame }) => {
  solutionIndex = 0
  solveGameStep({ originalBoard, board, pieceIndex: 0, rotation: 0, position: 0, isDayGame });
}

const game = (next) => {
  puzzleIndex = 0
  const board = [...BOARD];
  for (let p1 = 0; p1 < 16; p1++) {
    if (board[p1] !== '#') {
      continue;
    }
    board[p1] = 'p';
    for (let p2 = p1 + 1; p2 < 16; p2++) {
      if (board[p2] !== '#') {
        continue;
      }
      board[p2] = 'p';
      for (let p3 = p2 + 1; p3 < 16; p3++) {
        if (board[p3] !== '#') {
          continue;
        }
        board[p3] = 'p';
        next(board, p3)
        board[p3] = '#';
      }
      board[p2] = '#'
    }
    board[p1] = '#'
  }
}

const dayGame = () => {
  if (outputToDocument) {
    document.game.innerHTML = ''
  } else {
    console.clear()
  }
  consoleLog('day game')
  game(
    (board) => solveGame({
      originalBoard: [...board],
      board,
      isDayGame: true,
    })
  )
}

const nightGame = () => {
  if (outputToDocument) {
    document.game.innerHTML = ''
  } else {
    console.clear()
  }
  consoleLog('night game')
  game(
    (board, p3) => {
      for (let w = p3 + 1; w < 16; w++) {
        if (board[w] !== '#') {
          continue;
        }
        board[w] = 'w';
        solveGame({ originalBoard: [...board], board, isDayGame: false })
        board[w] = '#';
      }
    }
  )
}

const setUp = () => {
  const withColorRadios = document.withColorForm.withColorRadio
  withColorRadios[withColor ? 0 : 1].click()
  withColorRadios[0].addEventListener('change', () => withColor = true)
  withColorRadios[1].addEventListener('change', () => withColor = false)

  const outputToDocumentRadios = document.outputToDocumentForm.outputToDocumentRadio
  outputToDocumentRadios[outputToDocument ? 0 : 1].click()
  outputToDocumentRadios[0].addEventListener('change', () => outputToDocument = true)
  outputToDocumentRadios[1].addEventListener('change', () => outputToDocument = false)

  const buttons = document.buttons.children
  buttons[0].addEventListener('click', () => dayGame())
  buttons[1].addEventListener('click', () => nightGame())
}

setUp()
