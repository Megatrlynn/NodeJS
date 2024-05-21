import { default as fetch } from 'node-fetch';
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000';

async function updateStudent(token, studentId, studentData) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    try {
      const errorData = await error.response.json();
      console.error('Error updating student:', errorData.message);
    } catch (parseError) {
      console.error('Error updating student:', error.message);
    }
  }
}

async function login(username, password) {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const data = await response.json();
    if (data.accessToken) {
      console.log('Login successful!');
      return data.accessToken;
    } else {
      console.error('Login failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}

function promptUser() {
  return new Promise((resolve, reject) => {
    rl.question('Enter student ID to update: ', (studentId) => {
      rl.question('Enter institution ID: ', (institutionId) => {
        rl.question('Enter student name: ', (name) => {
          rl.question('Enter registration number: ', (regNo) => {
            rl.question('Enter role ID: ', (roleId) => {
              rl.question('Enter created by: ', (createdBy) => {
                resolve({ studentId, institutionId, name, regNo, roleId, createdBy });
              });
            });
          });
        });
      });
    });
  });
}

async function main() {
  try {
    // Execute app.js
    exec('node ../views/app.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing app.js:', error);
        return;
      }
      console.log('app.js executed successfully');
    });

    rl.question('Enter username: ', async (username) => {
      rl.question('Enter password: ', async (password) => {
        const token = await login(username, password);
        if (token) {
          const userData = await promptUser();
          const studentData = {
            name: userData.name,
            reg_no: userData.regNo,
            institution_id: parseInt(userData.institutionId),
            role_id: parseInt(userData.roleId),
            created_by: userData.createdBy
          };
          updateStudent(token, userData.studentId, studentData);
        }
        rl.close();
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
