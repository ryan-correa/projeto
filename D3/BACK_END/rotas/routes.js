const express = require('express');
const router = express.Router();
const contatos = require('./contatos');

router.use('/contatos', contatos);

module.exports = router;
