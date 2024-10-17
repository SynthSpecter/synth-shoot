// Game entities
// Entités du jeu

class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 40
    this.height = 60
  }

  draw(ctx) {
    ctx.fillStyle = '#00ffff'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  move(dx, canvasWidth) {
    this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x + dx))
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 5
    this.width = 5
    this.height = 15
  }

  draw(ctx) {
    ctx.fillStyle = '#ff00ff'
    ctx.fillRect(this.x, this.y, this.width, this.height)
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

  draw(ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(this.x, this.y, this.width, this.height)
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

  draw(ctx) {
    ctx.fillStyle = '#ffff00'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.y += this.speed
  }
}
