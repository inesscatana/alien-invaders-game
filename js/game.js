const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const SHOOT_SOUND = new Audio('../assets/sounds/shoot.wav')
const PLAYER_SPEED = 7
const PLAYER_ROTATION_ANGLE = 0.15
const PROJECTILE_SPEED = -10
const PLAYER_SCALE = 0.05

class Player {
	constructor() {
		this.velocity = {
			x: 0,
			y: 0,
		}

		this.rotation = 0
		this.position = { x: canvas.width / 2, y: canvas.height }
		this.loadImage()
	}

	loadImage() {
		const image = new Image()
		image.src = '../assets/spaceship.png'
		image.onload = () => {
			this.image = image
			this.width = image.width * PLAYER_SCALE
			this.height = image.height * PLAYER_SCALE
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height,
			}
		}
	}

	draw() {
		ctx.save()
		ctx.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		)
		ctx.rotate(this.rotation)
		ctx.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		)
		ctx.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
		ctx.restore()
	}

	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
	}
}

class Projectile {
	constructor(position, velocity) {
		this.position = position
		this.velocity = velocity
		this.radius = 3
	}

	draw() {
		ctx.beginPath()
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = 'red'
		ctx.fill()
		ctx.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Invader {
	constructor({ position }) {
		this.velocity = {
			x: 0,
			y: 0,
		}

		this.position = position
		this.loadImage()
	}

	loadImage() {
		const image = new Image()
		image.src = '../assets/alien1.png'
		image.onload = () => {
			const scale = 0.07
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: this.position.x,
				y: this.position.y,
			}
		}
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update({ velocity }) {
		if (this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}
}

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0,
		}

		this.velocity = {
			x: 3,
			y: 0,
		}

		this.invaders = []

		const columns = Math.floor(Math.random() * 10 + 5)
		const rows = Math.floor(Math.random() * 5 + 2)

		this.width = columns * 30

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(
					new Invader({
						position: {
							x: x * 30,
							y: y * 30,
						},
					})
				)
			}
		}
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30
		}
	}
}

const player = new Player()
const projectiles = []
const grids = [new Grid()]

const keys = {
	ArrowLeft: false,
	ArrowRight: false,
	space: false,
}

function handleProjectiles() {
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			projectiles.splice(index, 1)
		} else {
			projectile.update()
		}
	})
}

function handlePlayerMovement() {
	if (keys.ArrowLeft && player.position.x >= 0) {
		player.velocity.x = -PLAYER_SPEED
		player.rotation = -PLAYER_ROTATION_ANGLE
	} else if (
		keys.ArrowRight &&
		player.position.x + player.width <= canvas.width
	) {
		player.velocity.x = PLAYER_SPEED
		player.rotation = PLAYER_ROTATION_ANGLE
	} else {
		player.velocity.x = 0
		player.rotation = 0
	}
}

function animate() {
	requestAnimationFrame(animate)
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	player.update()
	handleProjectiles()

	grids.forEach((grid) => {
		grid.update()
		grid.invaders.forEach((invader) => {
			invader.update({ velocity: grid.velocity })
		})
	})

	handlePlayerMovement()
}

animate()

function handleKeyDown(key) {
	switch (key) {
		case 'ArrowLeft':
			keys.ArrowLeft = true
			break
		case 'ArrowRight':
			keys.ArrowRight = true
			break
		case ' ':
			if (keys.space) return
			keys.space = true
			projectiles.push(
				new Projectile(
					{
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					{
						x: 0,
						y: PROJECTILE_SPEED,
					}
				)
			)
			SHOOT_SOUND.play()
			break
	}
}

function handleKeyUp(key) {
	switch (key) {
		case 'ArrowLeft':
			keys.ArrowLeft = false
			break
		case 'ArrowRight':
			keys.ArrowRight = false
			break
		case ' ':
			keys.space = false
			break
	}
}

addEventListener('keydown', (event) => handleKeyDown(event.key))
addEventListener('keyup', (event) => handleKeyUp(event.key))
