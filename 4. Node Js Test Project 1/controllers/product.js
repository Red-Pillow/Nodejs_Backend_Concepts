const Product = require('../models/product');
//const { use } = require('../routes/expense');

const addProduct = async(req,res)=>{
    console.log("we are in add product")
    //console.log(req.body)
    try
    {
        if (!req.body.amount){
            throw new Error('Amount is mandatory')
        }
    const amount = req.body.amount;
    const productName = req.body.productName;
    const categoryType = req.body.categoryType;
    const data = await Product.create({amount:amount, productName:productName, categoryType:categoryType});
    res.status(201).json({newProductDetail: data});

} catch (err) {
    console.log(err)
    res.status(500).json({
        error: err
    })
}
}

 const getProduct = async (req,res, next) =>{
    try {
        console.log("we are in getProduct controllers")
        const product = await Product.findAll();
        res.status(200).json({"allProducts":product});
    } catch (error){
        console.log('Get product is failing', JSON.stringify(error));
        res.status(500).json({error: error});
    }
};

const deleteProduct  = async(req,res, next)=>{
    try{
        if (req.params.id=='undefined'){
            return res.status(400).json({err:'ID is missing'});
        }
        const uId = req.params.id;
        
        Product.findByPk(uId)
        .then(product =>{
            console.log(product)
            category = product.categoryType;
            console.log("hello world 2")
        })
        .then(()=>{
        console.log(category)
        Product.destroy({where:{id:uId}});
        })
        .then(()=>{
            res.status(200).json({"deleted_category":category});
        })
        
        
        

        

    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    addProduct,
    getProduct,
    deleteProduct,
}