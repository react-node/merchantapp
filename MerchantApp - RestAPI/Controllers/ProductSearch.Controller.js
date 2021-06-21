const ProductModel = require('../Models/Product.model')

class ProductSearchController{
    async searchProduct(req,res,next){
        try{
            const requestString = req.params.searchString
            // execute regular expression in query and return matched data
            const products = await ProductModel.aggregate([{
                $project: {
                    match: {
                        $ne :[{$regexFind: {
                            input: requestString,
                            regex: "$regExp",
                        }},null]
                        
                    },
                    name:1,
                    area: "$categoryName",
                    category : 1,
                    storeTypeID:1
                   
                },
                
            },{
                $match : {
                    match:true
                }
            },{
                $limit :10
            }
        ])
            //db.products.aggregate([{$match : {$expr : {regExp : "ipne"}}}])
            // const products = await ProductModel.find({},function(error,result) { 
            //    const data= result.map(item=>{
            //         const isValid = new RegExp(item.regExp).test('iphne')
            //         if(isValid){
            //             return {title : item.name}
            //         }
            //     })
            //     console.log(data)
            //     return data
            // })
            res.send(products)
        }catch(e){
            console.log(e)
        }
    }
    
}

module.exports = {
    "ProductController" : new ProductSearchController()
}