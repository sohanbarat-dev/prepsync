const express = require('express')
const router = express.Router()
const multer = require('multer')
const { protect } = require('../middlewares/authMiddleware')
const { uploadPYQ, getPYQs, deletePYQ } = require('../controllers/pyqController')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', protect, upload.array('pyqFiles', 10), uploadPYQ)
router.get('/', protect, getPYQs)
router.delete('/:id', protect, deletePYQ)

module.exports = router