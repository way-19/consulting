const mysql = require('mysql')
const path = require('path')

let connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})


const create = (req,res) => {
    let resim = req.files.gorsel

}


module.exports = {
    create
}