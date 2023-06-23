const path  = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const successController = require('../controllers/success')


router.get('/',successController.successController);

module.exports = router;
