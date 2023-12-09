const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const db = require('./db')

const port = process.env.PORT || 3000

app.use(express.json()) // Middleware to parse JSON bodies

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Scores API',
    version: '1.0.0',
    description: 'A simple Express Scores API',
  },
}

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./app.js'], // Adjust this path to your routes
}

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

// Use bodyParser middleware
app.use(bodyParser.json())

// Dynamic Swagger setup
app.use(
  '/api-docs',
  (req, res, next) => {
    swaggerSpec.servers = [
      {
        url: `${req.protocol}://${req.get('host')}`,
        description: 'Dynamic Host/Port',
      },
    ]
    req.swaggerDoc = swaggerSpec
    next()
  },
  swaggerUi.serve,
  swaggerUi.setup()
)

// Define routes here

// Example route with OpenAPI documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     Score:
 *       type: object
 *       required:
 *         - timestamp
 *         - score
 *         - address
 *       properties:
 *         timestamp:
 *           type: integer
 *           description: Unix timestamp of the score.
 *         score:
 *           type: integer
 *           description: Score value.
 *         address:
 *           type: string
 *           description: Address related to the score.
 */

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: Add a new score
 *     description: Add a new score to the scores list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Score'
 *     responses:
 *       201:
 *         description: Score added successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Retrieve all scores
 *     description: Get a list of all scores.
 *     responses:
 *       200:
 *         description: A list of scores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Score'
 *       500:
 *         description: Internal server error
 */
app
  .route('/scores')
  .post(async (req, res) => {
    try {
      const { timestamp, score, address } = req.body
      await db.addScore({ timestamp, score, address })
      res.status(201).json({ message: 'Score added successfully' })
    } catch (error) {
      console.error('Error adding score:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get(async (req, res) => {
    try {
      const scores = await db.getAllScores()
      res.json(scores)
    } catch (error) {
      console.error('Error fetching scores:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
