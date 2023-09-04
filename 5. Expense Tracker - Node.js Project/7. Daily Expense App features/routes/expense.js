const express = require('express')

const expenseController = require('../controllers/expenses');
//const expenseController = require('../controllers/expenses');
//const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense',expenseController.addExpense)
router.get('/get-expense',expenseController.getExpense)
router.delete('/delete-expense/:expenseid',expenseController.deleteExpense)
//router.post('/login',userController.login)
//router.post('/addexpense',authenticatemiddleware.authenticate, expenseController.authenticate)
//router.get('/getexpense',authenticatemiddleware.authenticate, )


module.exports = router;