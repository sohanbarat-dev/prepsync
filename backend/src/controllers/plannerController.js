const Planner = require('../models/Planner')
const pdfParse = require('pdf-parse')
const { extractTopicsFromSyllabus, generateStudyPlan } = require('../services/claudeService')

const uploadSyllabus = async (req, res) => {
  try {
    const { examDate, hoursPerDay, mode, subjectNames, examScopes } = req.body
    const files = req.files
    const names = JSON.parse(subjectNames)
    const scopes = JSON.parse(examScopes)

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const subjects = []
    for (let i = 0; i < files.length; i++) {
      const pdfData = await pdfParse(files[i].buffer)
      const pdfText = pdfData.text
      console.log(`Extracting topics for ${names[i]} | Scope: ${scopes[i]}`)
      const topics = await extractTopicsFromSyllabus(pdfText, names[i], scopes[i])
      console.log(`Found ${topics.length} topics for ${names[i]}`)
      subjects.push({ name: names[i], topics })
    }

    console.log('Generating study plan...')
    const dayWisePlan = await generateStudyPlan(
      subjects, examDate, hoursPerDay, mode
    )

    const existingPlanner = await Planner.findOne({ user: req.user.id })
    if (existingPlanner) {
      await Planner.findByIdAndDelete(existingPlanner._id)
    }

    const planner = await Planner.create({
      user: req.user.id,
      examDate,
      hoursPerDay,
      mode,
      subjects: subjects.map(s => ({
        name: s.name,
        topics: s.topics.map(t => ({ name: t }))
      })),
      dayWisePlan
    })

    res.status(201).json({ planner, dayWisePlan })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getPlanner = async (req, res) => {
  try {
    const planner = await Planner.findOne({ user: req.user.id })
    if (!planner) return res.status(404).json({ message: 'No planner found' })
    res.json(planner)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const deletePlanner = async (req, res) => {
  try {
    await Planner.findOneAndDelete({ user: req.user.id })
    res.json({ message: 'Planner deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { uploadSyllabus, getPlanner, deletePlanner }