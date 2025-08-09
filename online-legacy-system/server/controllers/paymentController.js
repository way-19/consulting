const stripe = require('stripe')(process.env.STRIPE_KEY)
const asyncHandler = require('express-async-handler')
let connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})



const createPayment = asyncHandler(async(req,res) => {
    const {email,amount} = req.body
            file_uploaded = false
            file_name = ""
            sampleFile = req.files.passport;
            uploadPath = __dirname + '/public/' + sampleFile.name;
            file_name = sampleFile.name
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(uploadPath, function(err) {
               if(!err) file_uploaded = true
            });

        try{
            const musteri = await stripe.customers.create({
                email: email,
                // İsteğe bağlı: Diğer müşteri bilgilerini buraya ekleyebilirsiniz.
              });
    
          const odeme = await stripe.paymentIntents.create({
            amount: miktar, // Kuruş cinsinden ödeme miktarı (örn: 1000 kuruş = 10.00 TL)
            currency: 'USD', // Ödeme birimi (TRY, USD, EUR, vb.)
            description: "",
            customer: musteri.id,
          });
          //db ye kaydet
          sql = `INSERT INTO `
          return res.json({success:true,paymentId:odeme.id})
        }catch(err){
            return res.json({success:false,error:err.message})
        }

})



module.exports = {
    createPayment
}