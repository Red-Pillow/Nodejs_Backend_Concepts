const path  = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const shopsController = require('../controllers/shop');


router.get('/',shopsController.shopsController);

module.exports = router;
 