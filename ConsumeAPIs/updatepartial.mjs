import { default as fetch } from 'node-fetch';
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000';

async function partialUpdateStudent(token, studentId, studentData) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}`, {
      method: 'PATCH',
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
      rl.question('Enter student name (Leave empty to skip): ', (name) => {
        rl.question('Enter registration number (Leave empty to skip): ', (regNo) => {
          rl.question('Enter institution ID (Leave empty to skip): ', (institutionId) => {
            rl.question('Enter role ID (Leave empty to skip): ', (roleId) => {
              rl.question('Enter created by (Leave empty to skip): ', (createdBy) => {
                resolve({ studentId, name, regNo, institutionId, roleId, createdBy });
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

    rl.question('Enter admin username: ', async (username) => {
      rl.question('Enter admin password: ', async (password) => {
        const token = await login(username, password);
        if (token) {
          const userData = await promptUser();
          const studentData = {};
          if (userData.name) studentData.name = userData.name;
          if (userData.regNo) studentData.reg_no = userData.regNo;
          if (userData.institutionId) studentData.institution_id = parseInt(userData.institutionId);
          if (userData.roleId) studentData.role_id = parseInt(userData.roleId);
          if (userData.createdBy) studentData.created_by = userData.createdBy;
          partialUpdateStudent(token, userData.studentId, studentData);
        }
        rl.close();
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
