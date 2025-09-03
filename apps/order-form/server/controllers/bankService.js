const mysql = require('mysql')
const path = require('path')

let connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})



// METHOD: @GET
// DESC: Get all bank services 
const getServices = (req,res) => {
    let country_id = req.params.cid;
    connection.query(`SELECT id,name,price,flag FROM bank_services WHERE country_id = ${country_id}`,function(err,results,fields){
        if(err) throw err
        res.json({status:200,data:results})  
    })
}

// METHOD: @GET
// DESC: Get all countries
const getCountries = (req,res) => {
    connection.query(`SELECT id,title,flag,recommended FROM countries`,function(err,results){
        if(err) return res.json({status:500,data:err.message})
        return res.json({status:200,data:results})
    })
}

// METHOD: @GET
// DESC: Get all packages
const getPackages = (req,res) => {
    connection.query(`SELECT id,title,price,active FROM packages`,function(err,results){
        if(err) return res.json({status:500,data:err.message})
        return res.json({status:200,data:results})
    })
}


// METHOD: @GET
// DESC: Get all packages

const getItems = (req,res) => {
    const package_id = req.params.id
    connection.query(`SELECT name FROM package_items WHERE package_id = ? `,[package_id
    ],function(err,results){
        if(err) return res.json({status:500,data:err.message})
        return res.json({status:200,data:results})
    })
}

const additionalServices = (req,res) => {
    let country_id = req.params.cid;
    connection.query(`SELECT id,title,image,price,checked FROM additional_services WHERE country = ${country_id} `,function(err,results){
        if(err) return res.json({status:500,data:err.message})
        return res.json({status:200,data:results})
    })
}


const savePayment = (req,res) => {
    return res.json({body:req.body})
}



module.exports = {
    getServices,
    getCountries,
    getPackages,
    getItems,
    additionalServices,
    savePayment
    
}