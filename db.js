// db.js

const knex = require('knex')
const knexConfig = require('./knexfile').shared // Adjust this path as needed

// Initialize knex instance
const db = knex(knexConfig)

// Function to get all scores
const getAllScores = async () => {
  try {
    const scores = await db('scores').select('*')
    return scores
  } catch (error) {
    console.error('Error fetching scores:', error)
    throw error
  }
}

// Function to add a new score
const addScore = async (scoreData) => {
  try {
    // Ensure that scoreData.timestamp is a Unix timestamp (integer)
    if (!Number.isInteger(scoreData.timestamp)) {
      throw new Error('Invalid timestamp - must be a Unix timestamp')
    }

    await db('scores').insert(scoreData)
  } catch (error) {
    console.error('Error adding score:', error)
    throw error
  }
}

// Function to delete a score
const deleteScore = async (id) => {
  try {
    await db('scores').where({ id }).del()
  } catch (error) {
    console.error('Error deleting score:', error)
    throw error
  }
}

module.exports = {
  getAllScores,
  addScore,
  deleteScore,
}
