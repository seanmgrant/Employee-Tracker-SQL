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


//first action
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
                'Add an employees',
                'Update an employees role',
                'Update an employees manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employees',
                'View department budgets',
                'No Action']
        }
    ])
        .then((answers) => {
            const { task } = answers;

            if (task === "View employees") {
                showEmployees();
            }

            if (task === "View roles") {
                showRoles();
            }
            if (task === "View departments") {
                showDepartments();
            }

            if (task === "View department budgets") {
                viewBudget();
            }

            if (task === "Add employees") {
                addEmployee();
            }

            if (task === "Add role") {
                addRole();
            }

            if (task === "Add department") {
                addDepartment();
            }

            if (task === "Update an employees manager") {
                updateManager();
            }

            if (task === "Update an employees role") {
                updateEmployee();
            }

            if (task === "View employees by department") {
                employeeDepartment();
            }

            if (task === "Delete employee") {
                deleteEmployee();
            }

            if (task === "Delete roles") {
                deleteRole();
            }

            if (task === "Delete department") {
                deleteDepartment();
            }

            if (task === "No Action") {
                connection.end()
            };
        });
};

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        firstPrompt();
    });
};

showRoles = () => {
    console.log('Showing all roles...\n');

    const sql = `SELECT roles.id, roles.title, department.name AS department
                 FROM roles
                 INNER JOIN department ON roles.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        firstPrompt();
    })
};

// function to show all employees 
showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql = `SELECT employees.id, 
                        employees.first_name, 
                        employees.last_name, 
                        roles.title, 
                        department.name AS department,
                        roles.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employees
                        LEFT JOIN roles ON employees.roles_id = roles.id
                        LEFT JOIN department ON roles.department_id = department.id
                        LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What department do you want to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
                    VALUES (?)`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.addDept + " to departments!");

                showDepartments();
            });
        });
};
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role do you want to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
            validate: addSalary => {
                if (isNAN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.role, answer.salary];
            const roleSql = `SELECT name, id FROM department`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: "What department is this role in?",
                        choices: dept
                    }
                ])
                    .then(deptChoice => {
                        const dept = deptChoice.dept;
                        params.push(dept);

                        const sql = `INSERT INTO roles (title, salary, department_id)
                          VALUES (?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Added' + answer.role + " to roles!");

                            showRoles();
                        });
                    });
            });
        });
};

// add an employee 
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]

            const roleSql = `SELECT roles.id, roles.title FROM roles`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employees`;

                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id)
                      VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employees added.")

                                        showEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

updateEmployee = () => {
    const employeeSql = `SELECT * FROM employees`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employees would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM roles`;

                connection.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee


                            const sql = `UPDATE employees SET roles_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

// update an employee 
updateManager = () => {
    
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employees`;

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee


                            // console.log(params)

                            const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

employeeDepartment = () => {
    console.log('Showing employees by departments...\n');
    const sql = `SELECT employees.first_name, 
                        employees.last_name, 
                        department.name AS department
                 FROM employees 
                 LEFT JOIN roles ON employees.roles_id = roles.id 
                 LEFT JOIN department ON roles.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//delete department
deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    connection.query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                const sql = `DELETE FROM department WHERE id = ?`;

                connection.query(sql, dept, (err, result) => {
                    if (err) throw err;
                    console.log("Deleted!");

                    showDepartments();
                });
            });
    });
};

deleteRole = () => {
    const roleSql = `SELECT * FROM roles`;

    connection.query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete?",
                choices: role
            }
        ])
            .then(roleChoice => {
                const role = roleChoice.role;
                const sql = `DELETE FROM roles WHERE id = ?`;

                connection.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Deleted!");

                    showRoles();
                });
            });
    });
};

// delete employees
deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;

                const sql = `DELETE FROM employees WHERE id = ?`;

                connection.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Deleted!");

                    showEmployees();
                });
            });
    });
};

// view department budget 
viewBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  roles  
                 JOIN department ON roles.department_id = department.id GROUP BY  department_id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};

