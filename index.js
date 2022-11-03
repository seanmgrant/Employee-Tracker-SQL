const mysql2 = require('mysql2');
const cTable = require('console.table');
//const inquirer = require('inquirer');
//import mysql2 from 'mysql2'


const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db'
});
