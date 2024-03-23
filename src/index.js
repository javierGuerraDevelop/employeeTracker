const inquirer = require('inquirer');
const db = require('./db');

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Exit':
          db.end();
          break;
      }
    });
}

function viewDepartments() {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function viewAllRoles() {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function viewAllEmployees() {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department you would like to make?',
      },
    ])
    .then((answer) => {
      db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], (err, results) => {
        if (err) throw err;
        console.log(`Added ${answer.departmentName} to the database`);
        mainMenu();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'What is the department ID?',
      },
    ])
    .then((answers) => {
      db.query('SELECT * FROM department WHERE id = ?', [answers.departmentId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          db.query(
            'INSERT INTO role (name, salary, department_id) VALUES (?, ?, ?)',
            [answers.roleName, answers.roleSalary, answers.departmentId],
            (err, results) => {
              if (err) throw err;
              console.log(`Added new role: ${answers.roleName}`);
              mainMenu();
            },
          );
        } else {
          console.log('The department ID provided does not exist. Please try again with a valid department ID.');
          mainMenu();
        }
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
      },
      {
        type: 'input',
        name: 'roleId',
        message: "What is the employee's role ID?",
      },
    ])
    .then((answers) => {
      const query = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
      const values = [answers.firstName, answers.lastName, answers.roleId];

      db.query(query, values, (err, results) => {
        if (err) throw err;
        console.log(`Added new employee: ${answers.firstName} ${answers.lastName}`);
        mainMenu();
      });
    });
}

mainMenu();
