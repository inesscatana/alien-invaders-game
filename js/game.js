const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

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

const player = new Player()
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
