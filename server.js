const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`employee_db database connected.`)
);


//Start function that prompts the user to choose an action
function start() {
    inquirer
        .prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
        })
        .then((answer) => {
            console.log('You selected the option', answer.menu);
            switch (answer.menu) {
                case 'View all departments':
                    console.log('switch ran');
                    viewAllDepartments();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'View all roles':
                    viewAllRoles();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee role':
                    updateEmployeeRole();
                    break;

                case 'Exit':
                    db.end();
                    break;

                default:
                    console.log(`Make it a great day!`);
                    break;
            }
        });
}


//View all departments function
function viewAllDepartments() {
    console.log('inside viewAllDepartments');
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        start();
    });
}

function getDepartmentNames() {
    return new Promise(function (res,rej) {
        db.query( { sql: 'SELECT JSON_ARRAYAGG(name) FROM department;', rowsAsArray: true }, 
        (err,result) => { 
            if (err) {
                console.log(err);
            return; 
            }
            // console.log (result); 
            return (result);
        }

        )
    }) 
}

function addDepartment() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?",
        }
    ])
        .then((res) => {
            const sql = `INSERT INTO departments (name) VALUES ("${res.name}")`;
            db.promise().query(sql)
                .then(start())
                .catch((err) =>
                    console.error(err));
        });
};

//View all roles function
function viewAllRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        start();
    });
};

async function addRole() {
    const departmentNames= await getDepartmentNames ();
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the new role?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?",
        },
        {
            name: "department_id",
            type: "list",
            message: "Which department does the role belong to?",

            choices: departmentNames
        }
    ])
        .then((res) => {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES
                        ("${res.title}","${res.salary}","${res.department_id}");`;
            db.promise().query(sql)
                .then(start())
                .catch((err) =>
                    console.error(err));
        });
};

// View all employees function
function viewAllEmployees() {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        start();
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "roleId",
            type: "input",
            message: "What is the employee's role?",
        },
        {
            name: "managerId",
            type: "input",
            message: "Who is the employee's manager?",
        }
    ])
        .then((res) => {
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
                        ("${res.firstName}","${res.lastName}","${res.roleId}","${res.managerId}");`;
            db.promise().query(sql)
                .then(mainPage())
                .catch((err) =>
                    console.error(err));
        });
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "input",
            message: "what is the employee id number would you like to update?"
        },
        {
            name: "roleId",
            type: "input",
            message: "Which employee's role do you want to update?"
        }
    ])
        .then((res) => {
            const sql = `UPDATE employees SET roleId = "${res.roleId}"
                        WHERE id = "${res.employeeId}";`;

            db.promise().query(sql)
                .then(mainPage())
                .catch((err) =>
                    console.error(err));
        });
};

start();
