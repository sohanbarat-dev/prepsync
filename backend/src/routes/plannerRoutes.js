const express = require('express')
const router = express.Router()
const multer = require('multer')
const { protect } = require('../middlewares/authMiddleware')
const { uploadSyllabus, getPlanner, deletePlanner } = require('../controllers/plannerController')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', protect, upload.array('syllabusFiles', 10), uploadSyllabus)
router.get('/', protect, getPlanner)
router.delete('/', protect, deletePlanner)

module.exports = router