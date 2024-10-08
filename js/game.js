const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

const scoreEl = document.getElementById('score')
const livesEl = document.getElementById('lives')
const restartButton = document.getElementById('restart-button')
const startButton = document.getElementById('start-button')
const coverScreen = document.getElementById('cover-screen')
const gameScreen = document.getElementById('game-screen')

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas to avoid artifacts
}

// Call the resize function initially and on window resize
window.addEventListener('resize', resizeCanvas)
resizeCanvas() // Initial call to set up the canvas size

const SHOOT_SOUND = new Audio('../assets/sounds/shoot.wav')
SHOOT_SOUND.volume = 0.4

const PLAYER_HIT_INVADER_SOUND = new Audio('../assets/sounds/alien-death.wav')
PLAYER_HIT_INVADER_SOUND.volume = 0.4

const INVADER_HIT_PLAYER_SOUND = new Audio('../assets/sounds/player-death.wav')
INVADER_HIT_PLAYER_SOUND.volume = 0.5

const GAME_OVER_MUSIC = new Audio('../assets/sounds/game-over.mp3')
GAME_OVER_MUSIC.volume = 0.7

const PLAYER_SPEED = 7
const PLAYER_ROTATION_ANGLE = 0.15
const PROJECTILE_SPEED = -10
const PLAYER_SCALE = 0.07
const INVADER_SCALE = 0.07

class Player {
	constructor() {
		this.velocity = {
			x: 0,
			y: 0,
		}

		this.rotation = 0
		this.opacity = 1
		this.position = { x: canvas.width / 2, y: canvas.height }
		this.loadImage()
	}

	loadImage() {
		const image = new Image()
		image.src = '../assets/images/spaceship.png'
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

		ctx.globalAlpha = this.opacity

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

class Particle {
	constructor({ position, velocity, radius, color, fades }) {
		this.position = position
		this.velocity = velocity

		this.radius = radius
		this.color = color
		this.opacity = 1
		this.fades = fades
	}

	draw() {
		ctx.save()
		ctx.globalAlpha = this.opacity
		ctx.beginPath()
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.fades) this.opacity -= 0.01
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
		image.src = '../assets/images/alien1.png'
		image.onload = () => {
			this.image = image
			this.width = image.width * INVADER_SCALE
			this.height = image.height * INVADER_SCALE
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
const particles = []

const keys = {
	ArrowLeft: false,
	ArrowRight: false,
	space: false,
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
	over: false,
	active: true,
}
let score = 0
let canShoot = true
const shootCooldown = 500 // Time in milliseconds
let lives = 3

for (let i = 0; i < 100; i++) {
	particles.push(
		new Particle({
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
			},
			velocity: {
				x: 0,
				y: 0.3,
			},
			radius: Math.random() * 2,
			color: 'white',
		})
	)
}

function createParticles({ object, color, fades, particleCount = 15 }) {
	for (let i = 0; i < particleCount; i++) {
		particles.push(
			new Particle({
				position: {
					x: object.position.x + object.width / 2,
					y: object.position.y + object.height / 2,
				},
				velocity: {
					x: (Math.random() - 0.5) * 2,
					y: Math.random() - 0.5,
				},
				radius: Math.random() * 3,
				color: color || '#BAA0DE',
				fades,
			})
		)
	}
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

function updateLivesDisplay() {
	const lifeImages = livesEl.querySelectorAll('.life')
	lifeImages.forEach((life, index) => {
		life.style.display = index < lives ? 'inline' : 'none'
	})

	if (lives <= 0) {
		game.over = true
		showGameOverScreen()
	}
}

// async function getHighScore() {
// 	try {
// 		const response = await fetch('http://localhost:3000/highscore')
// 		const data = await response.json()
// 		return data.score
// 	} catch (error) {
// 		console.error('Erro ao obter o high score:', error)
// 	}
// }

// async function saveHighScore(score) {
// 	try {
// 		await fetch('http://localhost:3000/highscore', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ score }),
// 		})
// 	} catch (error) {
// 		console.error('Erro ao salvar o high score:', error)
// 	}
// }

// async function checkHighScore() {
// 	const highScore = await getHighScore()
// 	if (score > highScore) {
// 		await saveHighScore(score)
// 		alert('Novo high score!')
// 	}
// }

function saveHighScoreToLocalStorage(score) {
	const currentHighScore = localStorage.getItem('highScore') || 0
	if (score > currentHighScore) {
		localStorage.setItem('highScore', score)
	}
}

function showGameOverScreen() {
	// checkHighScore()
	const gameScreen = document.getElementById('game-screen')
	const gameOverScreen = document.getElementById('game-over-screen')
	const finalScoreEl = document.getElementById('final-score')
	const highScoreEl = document.getElementById('high-score')

	gameScreen.style.display = 'none'
	gameOverScreen.style.display = 'block'

	// Get current high score from localStorage
	const currentHighScore = localStorage.getItem('highScore') || 0

	finalScoreEl.textContent = `Final Score: ${score}`
	highScoreEl.textContent = `High Score: ${currentHighScore}`

	saveHighScoreToLocalStorage(score)

	GAME_OVER_MUSIC.play()
}

function animate() {
	if (!game.active) return
	requestAnimationFrame(animate)
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	player.update()

	particles.forEach((particle, i) => {
		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width
			particle.position.y = -particle.radius
		}

		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1)
			}, 0)
		} else {
			particle.update()
		}
	})

	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
		} else invaderProjectile.update()

		// Projectile hits player
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
				player.position.y &&
			invaderProjectile.position.x + invaderProjectile.width >=
				player.position.x &&
			invaderProjectile.position.x <= player.position.x + player.width
		) {
			invaderProjectiles.splice(index, 1)
			lives -= 1
			updateLivesDisplay()

			// Play sound effect for invader hitting the player
			INVADER_HIT_PLAYER_SOUND.play()
			createParticles({
				object: player,
				color: 'white',
				fades: true,
			})

			if (lives <= 0) {
				player.opacity = 0
				game.over = true
				setTimeout(() => {
					game.active = false
					showGameOverScreen()
				}, 1000)
			}
		}
	})

	handleProjectiles()

	grids.forEach((grid, gridIndex) => {
		grid.update()

		// Spawning projectiles
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles
			)
		}

		grid.invaders.forEach((invader, i) => {
			invader.update({ velocity: grid.velocity })

			// Projectiles hit enemy
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

						// Remove invader and projectile
						if (!game.over && invaderFound && projectileFound) {
							score += 100
							scoreEl.innerHTML = `Score: ${score}`

							// Play sound effect for player hitting invader
							PLAYER_HIT_INVADER_SOUND.play()

							createParticles({
								object: invader,
								fades: true,
							})

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

	// Spawning enemies
	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		randomInterval = Math.floor(Math.random() * 500 + 500)
		frames = 0
	}

	frames++
}

startButton.addEventListener('click', () => {
	coverScreen.style.display = 'none'
	gameScreen.style.display = 'block'
	animate()
})

function handleKeyDown(key) {
	if (game.over) return

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
			canShoot = false // Prevents rapid shooting

			projectiles.push(
				new Projectile({
					position: {
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					velocity: {
						x: 0,
						y: PROJECTILE_SPEED,
					},
				})
			)
			SHOOT_SOUND.play()

			// Allow shooting after a cooldown
			setTimeout(() => {
				canShoot = true
			}, shootCooldown)

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

restartButton.addEventListener('click', restartGame)
function restartGame() {
	lives = 3
	score = 0
	scoreEl.innerHTML = `Score: ${score}`
	player.opacity = 1
	game.over = false
	game.active = true
	updateLivesDisplay()

	invaderProjectiles.length = 0
	player.position = {
		x: canvas.width / 2 - player.width / 2,
		y: canvas.height - player.height - 10,
	}
	projectiles.length = 0
	grids.length = 0

	const gameOverScreen = document.getElementById('game-over-screen')
	const gameScreen = document.getElementById('game-screen')
	gameOverScreen.style.display = 'none'
	gameScreen.style.display = 'block'

	GAME_OVER_MUSIC.pause()
	GAME_OVER_MUSIC.currentTime = 0

	animate()
}
