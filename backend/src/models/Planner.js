const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  name: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  day: Number
})

const subjectSchema = new mongoose.Schema({
  name: String,
  topics: [topicSchema]
})

const plannerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examDate: { type: Date, required: true },
  hoursPerDay: { type: Number, default: 6 },
  mode: { type: String, enum: ['first-time', 'revision'], default: 'first-time' },
  subjects: [subjectSchema],
  dayWisePlan: { type: Array, default: [] },
  examReadiness: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Planner', plannerSchema)