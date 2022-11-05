//Imports mysql2, console.table, inquirer
const mysql2 = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
// import mysql2 from 'mysql2'
//Connection to database
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('succefully connected to a database')
});

