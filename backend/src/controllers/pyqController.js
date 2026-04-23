const PYQ = require('../models/PYQ')
const pdfParse = require('pdf-parse')
const { analyzePYQ } = require('../services/claudeService')

const uploadPYQ = async (req, res) => {
  try {
    const { subjectName } = req.body
    const files = req.files

    if (!files || files.length === 0) return res.status(400).json({ message: 'No files uploaded' })
    if (!subjectName) return res.status(400).json({ message: 'Subject name required' })

    // Combine text from all PDFs
    let combinedText = ''
    for (let i = 0; i < files.length; i++) {
      const pdfData = await pdfParse(files[i].buffer)
      combinedText += `\n--- Paper ${i + 1} ---\n${pdfData.text}`
    }

    console.log(`Analyzing ${files.length} PYQ paper(s) for ${subjectName}...`)
    const analysis = await analyzePYQ(combinedText, subjectName)
    console.log(`Found ${analysis.topics.length} important topics`)

    await PYQ.findOneAndDelete({ user: req.user.id, subjectName })

    const pyq = await PYQ.create({
      user: req.user.id,
      subjectName,
      importantTopics: analysis.topics,
      summary: analysis.summary
    })

    res.status(201).json(pyq)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getPYQs = async (req, res) => {
  try {
    const pyqs = await PYQ.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(pyqs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const deletePYQ = async (req, res) => {
  try {
    await PYQ.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'PYQ deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { uploadPYQ, getPYQs, deletePYQ }