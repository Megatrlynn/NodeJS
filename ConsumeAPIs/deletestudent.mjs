import { default as fetch } from 'node-fetch';
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000';

async function deleteStudent(token, studentId) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    try {
      const errorData = await error.response.json();
      console.error('Error deleting student:', errorData.message);
    } catch (parseError) {
      console.error('Error deleting student:', error.message);
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

function promptStudentId() {
  return new Promise((resolve, reject) => {
    rl.question('Enter student ID to delete: ', (studentId) => {
      resolve(studentId);
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
        const token = await login(adminUsername, adminPassword);
        if (token) {
          const studentId = await promptStudentId();
          deleteStudent(token, studentId);
        }
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

main();
