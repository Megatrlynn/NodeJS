import { default as fetch } from 'node-fetch';
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000';

async function fetchStudent(token, studentId) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching student:', error);
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

async function promptAdminCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter admin username: ', (username) => {
      rl.question('Enter admin password: ', (password) => {
        resolve({ username, password });
      });
    });
  });
}

async function promptStudentId() {
  return new Promise((resolve) => {
    rl.question('Enter the ID of the student: ', (studentId) => {
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

    const { username, password } = await promptAdminCredentials();

    const token = await login(username, password);
    if (token) {
      const studentId = await promptStudentId();
      if (studentId) {
        fetchStudent(token, studentId);
      } else {
        console.log('No student ID provided.');
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

main();
