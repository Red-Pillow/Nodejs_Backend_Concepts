const Expense = require('../models/Expense');
//const { use } = require('../routes/expense');

const addExpense = async(req,res)=>{
    console.log("we are in add expense")
    //console.log(req.body)
    try
    {
        if (!req.body.amount){
            throw new Error('Amount is mandatory')
        }
    const amount = req.body.amount;
    const description = req.body.description;
    const expenseType = req.body.expenseType;
    const data = await Expense.create({amount:amount, description:description, expenseType:expenseType});
    res.status(201).json({newExpenseDetail: data});

} catch (err) {
    console.log(err)
    res.status(500).json({
        error: err
    })
}
}

 const getExpense = async (req,res, next) =>{
    try {
        console.log("we are in getExpense controllers")
        const expense = await Expense.findAll();
        res.status(200).json({"allExpense":expense});
    } catch (error){
        console.log('Get expense is failing', JSON.stringify(error));
        res.status(500).json({error: error});
    }
};
const updateExpense = async(req, res, next)=>{
    try {
        if (req.params.id=='undefined'){
            return res.status(400).json({err:'ID is missing'});
        }
        const uId = req.params.id;
        const expense = await Expense.findByPk(uId);
        const new_amount = req.body.amount
        const new_description = req.body.description
        const new_expenseType = req.body.expenseType
        expense.amount = new_amount;
        expense.description = new_description;
        expense.expenseType = new_expenseType;
        await expense.save();
        res.json({"updated_expense":expense});
    } catch (error){
        console.log('Update expense failed', JSON.stringify(error));
        res.status(500).json({error: error});
    }
}
const deleteExpense  = async(req,res, next)=>{
    try{
        if (req.params.id=='undefined'){
            return res.status(400).json({err:'ID is missing'});
        }
        const uId = req.params.id;
        await Expense.destroy({where:{id:uId}});
        res.status(200).json({"deleted_expense":"successfull"});
        
        //return { success: true, message: 'Expense deleted successfully.' };

    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    updateExpense
}