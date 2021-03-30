const createError = require('http-errors')
var PaytmChecksum = require("../PaytmConfig/PaytmChecksum");
const formidable=require('formidable')

const {v4:uuidv4}=require('uuid')
const https=require('https')
const {SlotBookingController} = require('./SlotBooking.Controller');
class PaymentController{
    async checksumValidate(req,res,next){
        try{
                
            const{amount,bannerSearchData}=req.body;
            const ownerID = req.payload.aud
            let callabckURL = process.env.PAYTM_CALLBACK_URL
            if(bannerSearchData.banner){
                callabckURL += "/banner"
            }else{
                callabckURL += "/offer"
            }

            /* import checksum generation utility */
            const totalAmount=JSON.stringify(amount);
            var params = {};
            console.log(amount)

            /* initialize an array */
            params['MID'] = process.env.PAYTM_MID,
            params['WEBSITE'] = process.env.PAYTM_WEBSITE,
            params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID,
            params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID,
            params['ORDER_ID'] = uuidv4(),
            params['CUST_ID'] = ownerID,
            params['TXN_AMOUNT'] = totalAmount,
            params['CALLBACK_URL'] = callabckURL
            //  params['EMAIL'] ="",
            //  params['MOBILE_NO'] = ''

            /**
            * Generate checksum by parameters we have
            * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
            */
            var paytmChecksum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
            paytmChecksum.then(async function (checksum){
            let paytmParams={
                ...params,
                "CHECKSUMHASH":checksum
            }
            const selectStores =bannerSearchData.selectStore.map(({id,zipcode,selectedDates})=> ({id,zipcode,selectedDates}))
      
            let requestData = {
                orderID : params.ORDER_ID,
                ownerID : params.CUST_ID,
                selectStores : selectStores,
                totalPaid : params.TXN_AMOUNT
            }
            if(bannerSearchData.banner){
                requestData.bannerDetails = {
                id : bannerSearchData.banner._id,
                imagePath : bannerSearchData.banner.imagePath
                }
                const isSavedDB = await SlotBookingController.saveBookingInfo(requestData)
                if(isSavedDB)
                res.json(paytmParams)
                //await Services.saveBannerSlots(requestData)
            }else{
                requestData.offerDetails = {
                id : bannerSearchData.offer._id,
                name : bannerSearchData.offer.offerName
                }
                const isSavedDB = await SlotBookingController.saveOfferBookingInfo(requestData)
                if(isSavedDB)
                res.json(paytmParams)
                //await Services.saveOfferSlots(requestData)
            }
            
            }).catch(function(error){
            console.log(error);
            next(error)
            });

             
    }catch(err){
        console.log(err)
        next(error)
    }

    }
    async paymentCallback (req,res,next){
        try {
            const slotType = req.params.type
            
            const form=new formidable.IncomingForm();
            form.parse(req,(err,fields,file)=>
            {
            console.log(fields)
            
            let l_paytmChecksum = fields.CHECKSUMHASH;
            delete fields.CHECKSUMHASH;
            console.log(fields)
            var isVerifySignature = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, l_paytmChecksum);
            console.log(isVerifySignature)
            if (isVerifySignature) {

                var paytmParams = {};
                paytmParams["MID"]     = fields.MID;
                paytmParams["ORDERID"] = fields.ORDERID;
                
                /*
                * Generate checksum by parameters we have
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY).then(function(checksum){
                
                    paytmParams["CHECKSUMHASH"] = checksum;
                
                    var post_data = JSON.stringify(paytmParams);
                
                    var options = {
                
                        /* for Staging */
                        hostname: 'securegw-stage.paytm.in',
                
                        /* for Production */
                        // hostname: 'securegw.paytm.in',
                
                        port: 443,
                        path: '/order/status',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': post_data.length
                        }
                    };
                
                    var response = "";
                    var post_req = https.request(options, function(post_res) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });
                
                        post_res.on('end', async function(){
                            const responseData = JSON.parse(response)
                            const updateData = {
                                transactionID : responseData.TXNID,
                                orderID : responseData.ORDERID,
                                txn_status : responseData.STATUS,
                                txn_type : responseData.TXNTYPE,
                                txn_gateway : responseData.GATEWAYNAME,
                                txn_response_code : responseData.RESPCODE,
                                txn_res_msg : responseData.RESPMSG,
                                txn_bank_name : responseData.BANKNAME,
                                txn_payment_mode : responseData.PAYMENTMODE,
                                txn_refunt_amount : responseData.REFUNDAMT,
                                txn_date : responseData.TXNDATE,
                                txn_bank_id : responseData.BANKTXNID,
                            }
                            const isSavedDB = await SlotBookingController.updateBookingTXNID(updateData,slotType)
                            res.redirect(`${process.env.MERCHANT_APP_URI}/app/slot-booking-status/${slotType}/${responseData.ORDERID}`)


                           // res.json(response)
                        });
                    });
                
                    post_req.write(post_data);
                    post_req.end();
                });        
            
            } else {
                console.log("Checksum Mismatched");
            }

            })
        } catch (error) {
            console.log("payment failed....", error);
        }
    }
    async getOrderDetails (req,res,next){
        try {
            const orderID = req.params.orderID
            console.log(orderID)
            const type = req.params.type
            //let orderDetails = []
            const orderDetails = await SlotBookingController.getOrderDetails(orderID,type)
            res.send(orderDetails)
            
        } catch (error) {
            next(error)
        }

    }
}

module.exports = {
    "PaymentController":new PaymentController()
}