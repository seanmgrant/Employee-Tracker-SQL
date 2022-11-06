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
connection.connect(err => {
    if(err) throw err;
    console.log('succefully connected to a database'+ connection.threadId);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`);
    firstPrompt();
});


// inquirer prompt for first action
const firstPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'No Action']
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                showDepartments();
            }

            if (choices === "View all roles") {
                showRoles();
            }

            if (choices === "View all employees") {
                showEmployees();
            }

            if (choices === "Add a department") {
                addDepartment();
            }

            if (choices === "Add a role") {
                addRole();
            }

            if (choices === "Add an employee") {
                addEmployee();
            }

            if (choices === "Update an employee role") {
                updateEmployee();
            }

            if (choices === "Update an employee manager") {
                updateManager();
            }

            if (choices === "View employees by department") {
                employeeDepartment();
            }

            if (choices === "Delete a department") {
                deleteDepartment();
            }

            if (choices === "Delete a role") {
                deleteRole();
            }

            if (choices === "Delete an employee") {
                deleteEmployee();
            }

            if (choices === "View department budgets") {
                viewBudget();
            }

            if (choices === "No Action") {
                connection.end()
            };
        });
};

