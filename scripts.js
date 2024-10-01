const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

const backBuffer = document.createElement('canvas')
const backCtx = backBuffer.getContext('2d')

canvas.width = backBuffer.width = 800
canvas.height = backBuffer.height = 600

canvas.width = 800
canvas.height = 600

canvas.style.position = 'absolute'
canvas.style.left = '50%'
canvas.style.top = '50%'
canvas.style.transform = 'translate(-50%, -50%)'

const gameContainer = document.createElement('div')
gameContainer.style.position = 'relative'
gameContainer.style.width = `${canvas.width}px`
gameContainer.style.height = `${canvas.height}px`
gameContainer.style.margin = 'auto'

canvas.parentNode.insertBefore(gameContainer, canvas)
gameContainer.appendChild(canvas)

canvas.style.position = 'static'
canvas.style.left = 'auto'
canvas.style.top = 'auto'
canvas.style.transform = 'none'

const background = document.createElement('div')
background.className = 'background'
gameContainer.appendChild(background)

const stars = document.createElement('div')
stars.className = 'stars'
gameContainer.appendChild(stars)

let backgroundY = 0
background.style.display = 'none'
stars.style.display = 'none'

canvas.width = 800
canvas.height = 600

class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 40
    this.height = 60
  }

  draw(context) {
    context.fillStyle = '#00ffff'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  move(dx) {
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x + dx))
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 5
  }

  draw(context) {
    context.fillStyle = '#ff00ff'
    context.fillRect(this.x, this.y, 5, 15)
  }

  update() {
    this.y -= this.speed
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 30
    this.height = 30
    this.speed = 1
  }

  draw(context) {
    context.fillStyle = '#ff0000'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.y += this.speed
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 20
    this.height = 20
    this.speed = 1
  }

  draw(context) {
    context.fillStyle = '#ffff00'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.y += this.speed
  }
}

let player, bullets, enemies, score
let gameState = 'menu'
let animationId
let powerUps = []
let tripleShotActive = false
let tripleShotTimer = null

const menuOverlay = document.getElementById('menuOverlay')
const gameOverOverlay = document.getElementById('gameOverOverlay')
const startButton = document.getElementById('startButton')
const restartButton = document.getElementById('restartButton')
const menuButton = document.getElementById('menuButton')
const finalScoreElement = document.getElementById('finalScore')

function startGame() {
  gameState = 'playing'
  player = new Player(canvas.width / 2 - 20, canvas.height - 80)
  bullets = []
  enemies = []
  score = 0
  menuOverlay.style.display = 'none'
  gameOverOverlay.style.display = 'none'
  gameContainer.style.display = 'block'

  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height)

  gameLoop()
}

function updateBackground() {
  backgroundY = (backgroundY + 0.5) % (canvas.height / 2)
  background.style.transform = `translateY(${-backgroundY}px)`
  stars.style.transform = `translateY(${-backgroundY * 0.7}px)`
}

function gameOver() {
  gameState = 'gameOver'
  gameOverOverlay.style.display = 'flex'
  finalScoreElement.textContent = `Final Score: ${score}`
}

function returnToMenu() {
  gameState = 'menu'
  menuOverlay.style.display = 'flex'
  gameOverOverlay.style.display = 'none'
  gameContainer.style.display = 'none'
  cancelAnimationFrame(animationId)

  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height)
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30)
  enemies.push(new Enemy(x, 0))
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + 5 > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + 15 > enemy.y
      ) {
        bullets.splice(bulletIndex, 1)
        enemies.splice(enemyIndex, 1)
        score += 10
      }
    })
  })

  enemies.forEach((enemy) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver()
    }
  })

  powerUps.forEach((powerUp, index) => {
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      powerUps.splice(index, 1)
      activateTripleShot()
    }
  })
}

function drawScore(context) {
  context.fillStyle = '#ffffff'
  context.font = '20px Arial'
  context.fillText(`Score: ${score}`, 10, 30)
}

function gameLoop() {
  if (gameState !== 'playing') return

  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height)

  updateBackground()

  player.draw(backCtx)

  bullets.forEach((bullet, index) => {
    bullet.update()
    bullet.draw(backCtx)
    if (bullet.y < 0) bullets.splice(index, 1)
  })

  enemies.forEach((enemy, index) => {
    enemy.update()
    enemy.draw(backCtx)
    if (enemy.y > backBuffer.height) enemies.splice(index, 1)
  })

  powerUps.forEach((powerUp, index) => {
    powerUp.update()
    powerUp.draw(backCtx)
    if (powerUp.y > backBuffer.height) powerUps.splice(index, 1)
  })

  checkCollisions()
  drawScore(backCtx)

  if (Math.random() < 0.02) spawnEnemy()
  if (Math.random() < 0.005) spawnPowerUp()

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(backBuffer, 0, 0)

  animationId = requestAnimationFrame(gameLoop)
}

function spawnPowerUp() {
  const x = Math.random() * (canvas.width - 20)
  powerUps.push(new PowerUp(x, 0))
}

function shoot() {
  if (tripleShotActive) {
    bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y))
    bullets.push(new Bullet(player.x, player.y))
    bullets.push(new Bullet(player.x + player.width - 5, player.y))
  } else {
    bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y))
  }
}

function activateTripleShot() {
  tripleShotActive = true
  clearTimeout(tripleShotTimer)
  tripleShotTimer = setTimeout(() => {
    tripleShotActive = false
  }, 10000) // 10 secondes
}

startButton.addEventListener('click', startGame)
restartButton.addEventListener('click', startGame)
menuButton.addEventListener('click', returnToMenu)

document.addEventListener('keydown', (e) => {
  if (gameState !== 'playing') return
  switch (e.key) {
    case 'ArrowLeft':
      player.move(-5)
      break
    case 'ArrowRight':
      player.move(5)
      break
    case ' ':
      shoot()
      break
  }
})

// Initialiser l'état du jeu
gameState = 'menu'
menuOverlay.style.display = 'flex'
gameOverOverlay.style.display = 'none'

// Effacer le canvas au démarrage
ctx.clearRect(0, 0, canvas.width, canvas.height)
