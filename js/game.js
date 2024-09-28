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
		if (this.image) {
			ctx.drawImage(
				this.image,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			)
		}
	}
}

const player = new Player()

function animate() {
	requestAnimationFrame(animate)
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	player.draw()
}

animate()
