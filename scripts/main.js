// Main entry point
// Point d'entrée principal

// Get the canvas and context
// Obtenir le canevas et le contexte
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// Create a new game instance
// Créer une nouvelle instance de jeu
const game = new Game(canvas, ctx)

// Create a new UI instance
// Créer une nouvelle instance d'interface utilisateur
const ui = new UI(game)

// Initialize the game state
// Initialiser l'état du jeu
game.init()

// Show the menu overlay at the start
// Afficher la superposition du menu au démarrage
ui.menuOverlay.style.display = 'flex'
ui.gameOverOverlay.style.display = 'none'

// Clear the canvas at startup
// Effacer le canevas au démarrage
ctx.clearRect(0, 0, canvas.width, canvas.height)

game.setGameOverCallback((score) => {
  ui.showGameOver(score)
})
