const Expense = require('../models/expense');
const User = require('../models/users');

const addExpense = async (req,res)=>{
    try{
        const amount = req.body.expenseAmount;
        const description = req.body.description;
        const category = req.body.category;
        
        
    if ((!amount)|| (!description)||(!category)){
        return res.status(400).json({err:"Something is missing"})
        }

        Expense.create({amount,description,category,userId: req.user.id}).then((expense)=>{
            const totalExpense = Number(req.user.totalExpenses)+Number(amount)
            console.log(totalExpense)
            User.update({
                totalExpenses: totalExpense
            },{
                where: {id: req.user.id}
            }).then(async()=>{
                res.status(201).json({expense,success:true})
            })
            .catch(async(err)=>{
                return res.status(500).json({success: false, error: err})
            })
            
        }).catch(async(err)=>{
            return res.status(500).json({success: false, error: err})
        })
    }
    catch(err){
        res.status(500).json(err)
    }
    

}



const getExpense = async(req,res)=>{
    try{
        const expenses = await Expense.findAll({where : {userId: req.user.id}})
        
        
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

        const expense = await Expense.findByPk(uId);
        
        amount = expense.amount
        id = expense.userId
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        user.totalExpenses -= amount;
        await user.save();

        
    
        
        
        // Save the updated user's record
        
        await expense.destroy();

        res.json({ message: 'Expense deleted and user totalExpenses updated' });
    }
    catch(err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}