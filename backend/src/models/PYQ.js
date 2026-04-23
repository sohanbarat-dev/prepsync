const mongoose = require('mongoose')

const pyqSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectName: { type: String, required: true },
  importantTopics: [
    {
      topic: String,
      frequency: Number,
      importance: { type: String, enum: ['Very High', 'High', 'Medium', 'Low'] },
      reason: String
    }
  ],
  summary: String
}, { timestamps: true })

module.exports = mongoose.model('PYQ', pyqSchema)