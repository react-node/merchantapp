const ProductModel = require('../Models/Product.model')

class TestController{
    async testSearch(req,res,next){
        try{
            // execute regular expression in query and return matched data
            const products = await ProductModel.aggregate([{
                $project: {
                    match: {
                        $ne :[{$regexFind: {
                            input: "andro",
                            regex: "$regExp",
                        }},null]
                        
                    },
                    name:1,
                   
                },
                
            },{
                $match : {
                    match:true
                }
            }])
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
    "TestController":new TestController()
}