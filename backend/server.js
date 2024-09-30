const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Connect to MongoDB (replace <DATABASE_URL> with the correct path to your database)
mongoose
	.connect('mongodb://localhost/alien-invaders')
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.error('Error connecting to MongoDB:', error))

// Define the schema and model for HighScore
const highScoreSchema = new mongoose.Schema({
	score: Number,
})

const HighScore = mongoose.model('HighScore', highScoreSchema)

// Route to get the high score
app.get('/highscore', async (req, res) => {
	try {
		const highScore = await HighScore.findOne().sort({ score: -1 })
		res.json(highScore || { score: 0 })
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving the high score' })
	}
})

// Route to save the high score
app.post('/highscore', async (req, res) => {
	const { score } = req.body
	try {
		const newHighScore = new HighScore({ score })
		await newHighScore.save()
		res.json({ message: 'High score saved successfully!' })
	} catch (error) {
		res.status(500).json({ message: 'Error saving the high score' })
	}
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
