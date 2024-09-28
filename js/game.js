const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const shootSound = new Audio('../assets/sounds/shoot.wav')

class Player {
	constructor() {
		this.velocity = {
			x: 0,
			y: 0,
		}

		this.rotation = 0

		const image = new Image()
		image.src = '../assets/spaceship.png'
		image.onload = () => {
			const scale = 0.05
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height,
			}
		}
	}

	draw() {
		ctx.save()
		ctx.translate(
			player.position.x + player.width / 2,
			player.position.y + player.height / 2
		)

		ctx.rotate(this.rotation)

		ctx.translate(
			-player.position.x - player.width / 2,
			-player.position.y - player.height / 2
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

const player = new Player()
const projectiles = []
const keys = {
	ArrowLeft: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	space: {
		pressed: false,
	},
}

function animate() {
	requestAnimationFrame(animate)
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	player.update()

	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0)
		} else {
			projectile.update()
		}
	})

	if (keys.ArrowLeft.pressed && player.position.x >= 0) {
		player.velocity.x = -7
		player.rotation = -0.15
	} else if (
		keys.ArrowRight.pressed &&
		player.position.x + player.width <= canvas.width
	) {
		player.velocity.x = 7
		player.rotation = 0.15
	} else {
		player.velocity.x = 0
		player.rotation = 0
	}
}

animate()

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			break
		case ' ':
			projectiles.push(
				new Projectile(
					{
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					{
						x: 0,
						y: -10,
					}
				)
			)
			shootSound.play()

			break
	}
})

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case ' ':
			break
	}
})
