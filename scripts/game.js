// Main game logic
// Logique principale du jeu

class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.player = null
    this.bullets = []
    this.enemies = []
    this.powerUps = []
    this.score = 0
    this.gameState = 'menu'
    this.animationId = null
    this.tripleShotActive = false
    this.tripleShotTimer = null
    this.onGameOver = null
  }

  // Initialize the game
  // Initialiser le jeu
  init() {
    this.canvas.width = 800
    this.canvas.height = 600
    this.player = new Player(
      this.canvas.width / 2 - 20,
      this.canvas.height - 80
    )
  }

  // Start the game
  // Démarrer le jeu
  start() {
    this.gameState = 'playing'
    this.bullets = []
    this.enemies = []
    this.powerUps = []
    this.score = 0
    this.gameLoop()
  }

  // Main game loop
  // Boucle principale du jeu
  gameLoop() {
    if (this.gameState !== 'playing') return

    this.update()
    this.draw()

    this.animationId = requestAnimationFrame(() => this.gameLoop())
  }

  // Update game state
  // Mettre à jour l'état du jeu
  update() {
    this.updateEntities()
    this.checkCollisions()
    this.spawnEntities()
  }

  // Draw game elements
  // Dessiner les éléments du jeu
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.player.draw(this.ctx)
    this.bullets.forEach((bullet) => bullet.draw(this.ctx))
    this.enemies.forEach((enemy) => enemy.draw(this.ctx))
    this.powerUps.forEach((powerUp) => powerUp.draw(this.ctx))
    this.drawScore()
  }

  // Update all game entities
  // Mettre à jour toutes les entités du jeu
  updateEntities() {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update()
      return bullet.y > 0
    })

    this.enemies = this.enemies.filter((enemy) => {
      enemy.update()
      return enemy.y < this.canvas.height
    })

    this.powerUps = this.powerUps.filter((powerUp) => {
      powerUp.update()
      return powerUp.y < this.canvas.height
    })
  }

  // Check for collisions between entities
  // Vérifier les collisions entre les entités
  checkCollisions() {
    // Check bullet-enemy collisions
    this.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (this.checkCollision(bullet, enemy)) {
          this.bullets.splice(bulletIndex, 1)
          this.enemies.splice(enemyIndex, 1)
          this.score += 10
        }
      })
    })

    // Check player-enemy collisions
    for (let enemy of this.enemies) {
      if (this.checkCollision(this.player, enemy)) {
        this.gameOver()
        return // Exit the function immediately after game over
      }
    }

    // Check player-powerup collisions
    this.powerUps.forEach((powerUp, index) => {
      if (this.checkCollision(this.player, powerUp)) {
        this.powerUps.splice(index, 1)
        this.activateTripleShot()
      }
    })
  }

  checkCollision(entity1, entity2) {
    // Add small tolerance to make collision detection more forgiving
    const tolerance = 5
    return (
      entity1.x + tolerance < entity2.x + entity2.width - tolerance &&
      entity1.x + entity1.width - tolerance > entity2.x + tolerance &&
      entity1.y + tolerance < entity2.y + entity2.height - tolerance &&
      entity1.y + entity1.height - tolerance > entity2.y + tolerance
    )
  }

  gameOver() {
    this.gameState = 'gameOver'
    cancelAnimationFrame(this.animationId)
    console.log('Game Over triggered!') // Add this line for debugging
    if (this.onGameOver) {
      this.onGameOver(this.score)
    }
  }

  setGameOverCallback(callback) {
    this.onGameOver = callback
  }

  // Spawn new entities
  // Faire apparaître de nouvelles entités
  spawnEntities() {
    if (Math.random() < 0.02) this.spawnEnemy()
    if (Math.random() < 0.005) this.spawnPowerUp()
  }

  // Spawn a new enemy
  // Faire apparaître un nouvel ennemi
  spawnEnemy() {
    const x = Math.random() * (this.canvas.width - 30)
    this.enemies.push(new Enemy(x, 0))
  }

  // Spawn a new power-up
  // Faire apparaître un nouveau power-up
  spawnPowerUp() {
    const x = Math.random() * (this.canvas.width - 20)
    this.powerUps.push(new PowerUp(x, 0))
  }

  // Draw the score
  // Dessiner le score
  drawScore() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText(`Score: ${this.score}`, 10, 30)
  }

  // Handle game over
  // Gérer la fin du jeu
  gameOver() {
    this.gameState = 'gameOver'
    cancelAnimationFrame(this.animationId)
    // Trigger game over UI
    // Déclencher l'interface utilisateur de fin de jeu
    if (this.onGameOver) {
      this.onGameOver(this.score)
    }
  }

  // Activate triple shot power-up
  // Activer le power-up de triple tir
  activateTripleShot() {
    this.tripleShotActive = true
    clearTimeout(this.tripleShotTimer)
    this.tripleShotTimer = setTimeout(() => {
      this.tripleShotActive = false
    }, 10000) // 10 seconds
  }

  // Set game over callback
  // Définir le callback de fin de jeu
  setGameOverCallback(callback) {
    this.onGameOver = callback
  }
}
