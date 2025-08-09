const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const fileUpload = require('express-fileupload')
const router = require('./routes')

const app = express()

app.use(cors({
    origin:"*"
}))

app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
    useTempFiles : true
}));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router)



let connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})

connection.connect((err) => {
    if(err) console.log(err);
    app.listen(process.env.PORT,() => {
        console.log(`⌦⌦⌦ Server Listening on Port: ${process.env.PORT} ⌫⌫⌫`);
    })
})