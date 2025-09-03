const express = require('express')
const router = express.Router()
const bankController = require('./controllers/bankService')
const imageController = require('./controllers/imageController')

//bank services routes
router.get('/services/:cid',bankController.getServices)
router.get('/countries',bankController.getCountries)
router.get('/packages',bankController.getPackages)
router.get('/package-items/:id',bankController.getItems)
router.get('/additional-services/:cid',bankController.additionalServices)
router.post('/add-new-image',imageController.create)
router.post('/save-payment',bankController.savePayment)



module.exports = router;