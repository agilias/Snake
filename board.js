!function game() {
    const board = document.querySelector('#board')
    const ctxBoard = board.getContext('2d')
    board.width = 800
    board.height = board.width / 2

    const SQUARE_SIZE = board.width / 20
    const ROWS = board.height / SQUARE_SIZE
    const COLS = board.width / SQUARE_SIZE

    const snake = {
        speed: 1,
        dir: 'right',
        partsPos: [
            { r: 6, c: 5 },
            { r: 6, c: 4 },
            { r: 6, c: 3 },
        ]
    }

    let start, stop, pause, food, score = 0, nextDir = snake.dir

    function positionToCoordinates({ c, r }) {
        return { x: (c - 1) * SQUARE_SIZE, y: (r - 1) * SQUARE_SIZE }
    }

    // For debugging purposes
    function drawBoard() {
        ctxBoard.strokeStyle = 'black'
        for (let i = 0; i < board.width; i += SQUARE_SIZE) {
            ctxBoard.beginPath()
            ctxBoard.moveTo(i, 0)
            ctxBoard.lineTo(i, board.height)
            ctxBoard.closePath()
            ctxBoard.stroke()
        }
        for (let i = 0; i < board.height; i += SQUARE_SIZE) {
            ctxBoard.beginPath()
            ctxBoard.moveTo(0, i)
            ctxBoard.lineTo(board.width, i)
            ctxBoard.closePath()
            ctxBoard.stroke()
        }
    }

    function drawSnake() {
        ctxBoard.fillStyle = 'rgb(71, 53, 53)'
        snake.partsPos.forEach(part => {
            let { x, y } = positionToCoordinates(part)
            ctxBoard.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
        })
    }

    function moveSnake() {
        let positions = snake.partsPos
        for (let i = positions.length - 1; i >= 1; i--) {
            let currBodyPart = positions[i]
            let nextBodyPart = positions[i - 1]
            currBodyPart.r = nextBodyPart.r
            currBodyPart.c = nextBodyPart.c
        }
        let head = positions[0]
        switch (nextDir) {
            case 'right':
                head.c++
                break
            case 'left':
                head.c--
                break
            case 'down':
                head.r++
                break
            case 'up':
                head.r--
                break
        }
        snake.dir = nextDir
    }

    function detectCollision() {
        let [head, ...body] = snake.partsPos
        if (head.c > COLS || head.c < 1 || head.r > ROWS || head.r < 1) {
            localStorage.setItem('snakeResult', 'GAME OVER!!')
            stop = true
        }
        if (body.some(part => part.c === head.c && part.r === head.r)) {
            localStorage.setItem('snakeResult', 'STOP EATING YOURSELF!')
            stop = true
        }
        if (head.c === food.c && head.r === food.r) {
            snake.partsPos.push(Object.assign({}, food))
            food = null
            localStorage.setItem('snakeScore', ++score)
            if (score && score % 3 === 0) {
                snake.speed = snake.speed + snake.speed * 0.2
            }
        }
    }

    function getRandomSquare() {
        let r = Math.floor(Math.random() * ROWS + 1)
        let c = Math.floor(Math.random() * COLS + 1)
        let isValid = snake.partsPos.every(part => {
            return Math.abs(part.r - r) > 1
                || Math.abs(part.c - c) > 1
        })
        return isValid ? { r, c } : getRandomSquare()
    }

    function drawFood() {
        food = food || getRandomSquare()
        ctxBoard.fillStyle = 'rgb(71, 53, 53)'
        let { x, y } = positionToCoordinates(food)
        ctxBoard.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE)
    }

    function update(timestamp) {
        ctxBoard.clearRect(0, 0, board.width, board.height)
        start = start || timestamp
        const elapsed = timestamp - start
        if (elapsed >= 600 / snake.speed) {
            if (!pause) moveSnake()
            detectCollision()
            start = timestamp
        }
        drawFood()
        drawSnake()
        drawBoard()
        let frame = requestAnimationFrame(update)
        if (stop) cancelAnimationFrame(frame)
    }

    localStorage.setItem('snakeScore', 0)
    localStorage.setItem('snakeResult', '')

    document.addEventListener('keydown', ({ code }) => {
        if (snake.dir === 'up' || snake.dir === 'down') {
            if (code === 'ArrowLeft') nextDir = 'left'
            if (code === 'ArrowRight') nextDir = 'right'
        }
        if (snake.dir === 'left' || snake.dir === 'right') {
            if (code === 'ArrowUp') nextDir = 'up'
            if (code === 'ArrowDown') nextDir = 'down'
        }
        if (code === 'Space') pause = !pause
    })

    update()

}()