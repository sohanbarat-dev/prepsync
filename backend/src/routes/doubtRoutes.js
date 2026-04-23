const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { askDoubt } = require('../controllers/doubtController')

router.post('/ask', protect, askDoubt)

module.exports = router