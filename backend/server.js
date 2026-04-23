const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./src/routes/authRoutes')
const plannerRoutes = require('./src/routes/plannerRoutes')
const pyqRoutes = require('./src/routes/pyqRoutes')
const doubtRoutes = require('./src/routes/doubtRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/pyq', pyqRoutes)
app.use('/api/doubt', doubtRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'PrepSync backend is running 🚀' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} ✅`)
    })
  })
  .catch((err) => {
    console.log('DB connection error ❌:', err.message)
  })