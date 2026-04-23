const { askDoubtBot } = require('../services/claudeService')

const askDoubt = async (req, res) => {
  try {
    const { question, subject, conversationHistory } = req.body

    if (!question) return res.status(400).json({ message: 'Question is required' })

    console.log(`Doubt asked: ${question.slice(0, 50)}...`)
    const answer = await askDoubtBot(question, subject, conversationHistory || [])

    res.json({ answer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { askDoubt }