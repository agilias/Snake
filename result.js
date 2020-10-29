const resultBoard = document.querySelector('#result')
const ctxResult = resultBoard.getContext('2d')
resultBoard.width = 400
resultBoard.height = 50

function drawResult() {
    const result = localStorage.getItem('snakeResult')
    ctxResult.font = '30px Arial'
    ctxResult.fillStyle = 'rgb(71, 53, 53)'
    // ctxResult.fillText('STOP EATING YOURSELF!', 11, 35)
    if(result !== '') resultBoard.style.opacity = 1
    switch(result) {
        case 'GAME OVER!!':
            ctxResult.fillText(result, 105, 35)
            break
        case 'STOP EATING YOURSELF!':
            ctxResult.fillText(result, 11, 35)
            break
    }
}

function update() {
    ctxResult.clearRect(0, 0, resultBoard.width, resultBoard.height)
    drawResult()
    requestAnimationFrame(update)
}

update()