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
    return new Promise(function (res, rej) {
        db.query({ sql: 'SELECT JSON_ARRAYAGG(name) FROM department;', rowsAsArray: true },
            (err, result) => {
                if (err) {
                    rej(err)
                }
                const roles = [];
                result[0][0].forEach(role => roles.push(role))

                // console.log (result); 
                res(roles);
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
            const sql = `INSERT INTO department (name) VALUES ("${res.name}")`;
            db.promise().query(sql)
                .then(start())
                .catch((err) =>
                    console.error(err));
        });
};

//View all roles function
function viewAllRoles() {
    db.query('SELECT role.id, title, department.name AS department, salary FROM role INNER JOIN department ON role.department_id = department.id;', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        start();
    });
};

async function addRole() {
    getDepartmentNames().then((departmentNames) => {
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
                name: "department",
                type: "list",
                message: "Which department does the role belong to?",

                choices: departmentNames
            }
        ])
            .then((res) => {
                var department_id = 0;
                for (var i = 0; i < departmentNames.length; i++) {
                    if (departmentNames[i] == res.department) {
                        department_id = i + 1;
                        break
                    }
                }
                const sql = `INSERT INTO role (title, salary, department_id) VALUES
                            ("${res.title}","${res.salary}","${department_id}");`;
                db.promise().query(sql)
                    .then(start())
                    .catch((err) =>
                        console.error(err));
            });

    })
  
};

// View all employees function
function viewAllEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON manager.id = employee.manager_id JOIN department ON role.department_id=department.id;', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        start();
    });
}

function addEmployee() {
    getEmployeeNames().then((employeeNames) => {
        getRoleNames().then((roleNames) => {
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
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roleNames
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: [...employeeNames, "None"]
                }
            ])
                .then((res) => {
                    var role_id = 0;
                    var manager_id = 0;
                    if (res.manager == "None") {
                        manager_id = null
                    }
                    else {
                        for (var i = 0; i < employeeNames.length; i++) {
                            if (employeeNames[i] == res.manager) {
                                manager_id = i + 1;
                                break
                            }
                        }

                    }
                    for (var i = 0; i < roleNames.length; i++) {
                        if (roleNames[i] == res.role) {
                            role_id = i + 1;
                            break
                        }
                    }
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
                            ("${res.firstName}","${res.lastName}",${role_id}, ${manager_id});`;
                    db.promise().query(sql)
                        .then(start())
                        .catch((err) =>
                            console.error(err));
                });

        })
    })


};

function updateEmployeeRole() {
    getEmployeeNames().then((employeeNames) => {
        getRoleNames().then((roleNames) => {
            inquirer.prompt([

                {
                    name: "employee",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeNames
                },
                {
                    name: "role",
                    type: "list",
                    message: "What's the employee's new role?",
                    choices: roleNames
                }

            ])
                .then((res) => {
                    var role_id = 0;
                    var manager_id = 0;
                    for (var i = 0; i < employeeNames.length; i++) {
                        if (employeeNames[i] == res.manager) {
                            manager_id = i + 1;
                            break
                        }
                    }


                    for (var i = 0; i < roleNames.length; i++) {
                        if (roleNames[i] == res.role) {
                            role_id = i + 1;
                            break
                        }
                    }
                    const sql = `UPDATE employee SET role_id = "${role_id}"
                    WHERE id = "${manager_id}";`;
                    db.promise().query(sql)
                        .then(start())
                        .catch((err) =>
                            console.error(err));
                });

        })
    })


};

function getRoleNames() {
    return new Promise(function (res, rej) {
        db.query({ sql: 'SELECT JSON_ARRAYAGG(title) FROM role;', rowsAsArray: true },
            (err, result) => {
                if (err) {
                    rej(err)
                }
                const roles = [];
                result[0][0].forEach(role => roles.push(role))

                res(roles);
            }

        )
    })
}

function getEmployeeNames() {
    return new Promise(function (res, rej) {
        db.query({ sql: 'SELECT JSON_ARRAYAGG(CONCAT(first_name," ", last_name)) FROM employee;', rowsAsArray: true },
            (err, result) => {
                if (err) {
                    rej(err)
                }
                const roles = [];
                result[0][0].forEach(role => roles.push(role))
                res(roles);
            }

        )
    })
}



start();
