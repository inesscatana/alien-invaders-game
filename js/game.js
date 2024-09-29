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
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.radius = 4
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

class InvaderProjectile {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity

		this.width = 3
		this.height = 10
	}

	draw() {
		ctx.fillStyle = 'white'
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
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

	shoot(invaderProjectiles) {
		invaderProjectiles.push(
			new InvaderProjectile({
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height,
				},
				velocity: {
					x: 0,
					y: 5,
				},
			})
		)
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
const grids = []
const invaderProjectiles = []

const keys = {
	ArrowLeft: false,
	ArrowRight: false,
	space: false,
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)

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

	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
		} else invaderProjectile.update()

		if (
			invaderProjectile.position.y + invaderProjectile.height >=
				player.position.y &&
			invaderProjectile.position.x + invaderProjectile.width >=
				player.position.x &&
			invaderProjectile.position.x <= player.position.x + player.width
		) {
			console.log('you lose')
		}
	})

	handleProjectiles()

	grids.forEach((grid, gridIndex) => {
		grid.update()

		// spawning projectiles
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles
			)
		}

		grid.invaders.forEach((invader, i) => {
			invader.update({ velocity: grid.velocity })

			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <=
						invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <=
						invader.position.x + invader.width &&
					projectile.position.y + projectile.radius >= invader.position.y
				) {
					setTimeout(() => {
						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader
						)

						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile
						)

						// remove invader and projectile
						if (invaderFound && projectileFound) {
							grid.invaders.splice(i, 1)
							projectiles.splice(j, 1)

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0]
								const lastInvader = grid.invaders[grid.invaders.length - 1]

								grid.width =
									lastInvader.position.x -
									firstInvader.position.x +
									lastInvader.width
								grid.position.x = firstInvader.position.x
							} else {
								grids.splice(gridIndex, 1)
							}
						}
					}, 0)
				}
			})
		})
	})

	handlePlayerMovement()

	// spawning enemies
	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		randomInterval = Math.floor(Math.random() * 500 + 500)
		frames = 0
	}

	frames++
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
