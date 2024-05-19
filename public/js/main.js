document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          const result = await response.json();
          alert(result.message);
          window.location.href = '/login.html';
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          const result = await response.json();
          if (result.token) {
            localStorage.setItem('token', result.token);
            alert('Login successful!');
            window.location.href = '/upload.html';
          } else {
            alert('Login failed: ' + result.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  
    if (uploadForm) {
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const image = document.getElementById('image').files[0];
        const formData = new FormData();
        formData.append('image', image);
  
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/images/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });
          const result = await response.json();
          alert(result.message);
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  });
  