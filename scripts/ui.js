// User interface and event handling
// Interface utilisateur et gestion des événements

class UI {
  constructor(game) {
    this.game = game
    this.menuOverlay = document.getElementById('menuOverlay')
    this.gameOverOverlay = document.getElementById('gameOverOverlay')
    this.startButton = document.getElementById('startButton')
    this.restartButton = document.getElementById('restartButton')
    this.menuButton = document.getElementById('menuButton')
    this.finalScoreElement = document.getElementById('finalScore')

    this.initEventListeners()
  }

  // Initialize event listeners
  // Initialiser les écouteurs d'événements
  initEventListeners() {
    this.startButton.addEventListener('click', () => this.startGame())
    this.restartButton.addEventListener('click', () => this.startGame())
    this.menuButton.addEventListener('click', () => this.returnToMenu())

    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }

  // Start the game
  // Démarrer le jeu
  startGame() {
    this.game.start()
    this.menuOverlay.style.display = 'none'
    this.gameOverOverlay.style.display = 'none'
  }

  // Return to the main menu
  // Retourner au menu principal
  returnToMenu() {
    this.game.gameState = 'menu'
    this.menuOverlay.style.display = 'flex'
    this.gameOverOverlay.style.display = 'none'
  }

  // Handle key down events
  // Gérer les événements de touche enfoncée
  handleKeyDown(e) {
    if (this.game.gameState !== 'playing') return
    switch (e.key) {
      case 'ArrowLeft':
        this.game.player.move(-5, this.game.canvas.width)
        break
      case 'ArrowRight':
        this.game.player.move(5, this.game.canvas.width)
        break
      case ' ':
        this.shoot()
        break
    }
  }

  // Shoot bullets
  // Tirer des balles
  shoot() {
    if (this.game.tripleShotActive) {
      this.game.bullets.push(
        new Bullet(
          this.game.player.x + this.game.player.width / 2 - 2.5,
          this.game.player.y
        )
      )
      this.game.bullets.push(new Bullet(this.game.player.x, this.game.player.y))
      this.game.bullets.push(
        new Bullet(
          this.game.player.x + this.game.player.width - 5,
          this.game.player.y
        )
      )
    } else {
      this.game.bullets.push(
        new Bullet(
          this.game.player.x + this.game.player.width / 2 - 2.5,
          this.game.player.y
        )
      )
    }
  }

  // Show game over screen
  // Afficher l'écran de fin de jeu
  showGameOver() {
    this.gameOverOverlay.style.display = 'flex'
    this.finalScoreElement.textContent = `Final Score: ${this.game.score}`
  }
}
