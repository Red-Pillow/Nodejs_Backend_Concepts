const Expense = require('../models/expense');

const addExpense = async (req,res)=>{
    try{
        const amount = req.body.expenseAmount;
        const description = req.body.description;
        const category = req.body.category;
        console.log(amount,description,category)
    if ((!amount)|| (!description)||(!category)){
        return res.status(400).json({err:"Something is missing"})
        }

        await Expense.create({amount,description,category}).then((expense)=>{
            return res.status(201).json({expense,success:true})
        })
    }
    catch(err){
        res.status(500).json(err)
    }
    

}



const getExpense = async(req,res)=>{
    try{
        const expense = await Expense.findAll()
        const formattedExpense = expense.map(expense=>({
            id: expense.id,
            amount: expense.amount,
            description: expense.description,
            category: expense.category
        }))
        //console.log(formattedExpense , " !@#$")
        res.status(200).json({'allExpenses': formattedExpense})
    }
    catch(error){  
        res.status(500).json({error: error})
    }
    
}

const deleteExpense = async(req,res)=>{
    try{
        if (req.params.expenseid=='undefined'){
            return res.status(400).json({err:'ID is missing'})
        }
        const uId = req.params.expenseid;
        
        
        Expense.findByPk(uId)
        .then(()=>{
            Expense.destroy({where:{id:uId}})
        })
        .then(()=>{
            res.status(200).json({"message":"deleted Successfully"})
        })
    }
    catch(err){
        res.status(500).json(err)
    }
    
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}