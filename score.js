!function() {
    const scoreBoard = document.querySelector('#score')
    const ctxScore = scoreBoard.getContext('2d')
    scoreBoard.width = 200
    scoreBoard.height = 50

    function drawScore() {
        const score = localStorage.getItem('snakeScore')
        ctxScore.font = '30px Arial'
        ctxScore.fillStyle = 'rgb(71, 53, 53)'
        ctxScore.fillText(`Score: ${score}`, 40, 35)
    }

    function update() {
        ctxScore.clearRect(0, 0, scoreBoard.width, scoreBoard.height)
        drawScore()
        requestAnimationFrame(update)
    }

    update()
    
}()