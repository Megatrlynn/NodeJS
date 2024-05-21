import { default as fetch } from 'node-fetch';
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000';

async function insertStudent(token, studentData) {
  try {
    const response = await fetch(`${baseUrl}/students`, {
      method: 'POST',
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
      console.error('Error inserting student:', errorData.message);
    } catch (parseError) {
      console.error('Error inserting student:', error.message);
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
    rl.question('Enter username for new student: ', (username) => {
      rl.question('Enter password for new student: ', (password) => {
        rl.question('Enter institution ID: ', (institutionId) => {
          rl.question('Enter student name: ', (name) => {
            rl.question('Enter registration number: ', (regNo) => {
              resolve({ username, password, institutionId, name, regNo });
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

    // Prompt for admin username and password
    rl.question('Enter admin username: ', async (adminUsername) => {
      rl.question('Enter admin password: ', async (adminPassword) => {
        // Log in as admin to get token
        const adminToken = await login(adminUsername, adminPassword);
        if (!adminToken) {
          console.error('Admin login failed');
          rl.close();
          return;
        }

        // Prompt for new student data
        const userData = await promptUser();
        const studentData = {
          username: userData.username,
          password: userData.password,
          institution_id: parseInt(userData.institutionId),
          name: userData.name,
          reg_no: userData.regNo
        };

        // Insert new student data using admin token
        await insertStudent(adminToken, studentData);

        // Close readline interface
        rl.close();
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
  }
}

main();
