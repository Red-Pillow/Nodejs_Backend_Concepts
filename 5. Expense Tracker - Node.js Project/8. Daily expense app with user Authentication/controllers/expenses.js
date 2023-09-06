const Expense = require('../models/expense');

const addExpense = async (req,res)=>{
    try{
        const amount = req.body.expenseAmount;
        const description = req.body.description;
        const category = req.body.category;
        //console.log(amount,description,category)
    if ((!amount)|| (!description)||(!category)){
        return res.status(400).json({err:"Something is missing"})
        }

        await Expense.create({amount,description,category,userId: req.user.id}).then((expense)=>{
            return res.status(201).json({expense,success:true})
        })
    }
    catch(err){
        res.status(500).json(err)
    }
    

}



const getExpense = async(req,res)=>{
    try{
        console.log("#####get expense")
        //console.log(req,"##req")
        console.log(req.user.id)
        const expenses = await Expense.findAll({where : {userId: req.user.id}})
        console.log("expenses",expenses)
        if (expenses) {
            return res.status(200).json({expenses, success: true})
            }
        
    
    }
    catch(error){  
        res.status(500).json({error: error, success: false})
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