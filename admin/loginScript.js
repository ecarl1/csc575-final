//user login
const form = document.getElementById('loginForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        //getting the inputed username and password
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
      
        //calling the login route for the entered info
        const res = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
      
        const data = await res.json();
      
        if (res.ok) {
            //grants logged in status to a user that is logged in
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = 'upload.html';
        } else {
          document.getElementById('message').innerText = (data.error || 'Login failed');
        }
      });
}

//locks the upload page if the user is not logged in
if (window.location.pathname.endsWith('upload.html')) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}
