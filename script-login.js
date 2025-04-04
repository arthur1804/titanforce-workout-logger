function getUsers() {
    return JSON.parse(localStorage.getItem('titanforce_users')) || [];
  }
  
  function saveUsers(users) {
    localStorage.setItem('titanforce_users', JSON.stringify(users));
  }
  
  function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const status = document.getElementById('loginStatus');
  
    const users = getUsers();
    const found = users.find(u => u.username === user && u.password === pass);
  
    if (found) {
      localStorage.setItem('titanforce_currentUser', user);
      window.location.href = 'index.html';
    } else {
      status.textContent = 'Usuário ou senha inválidos';
    }
  }
  
  function register() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const status = document.getElementById('loginStatus');
  
    if (!user || !pass) {
      status.textContent = 'Preencha todos os campos';
      return;
    }
  
    const users = getUsers();
    if (users.some(u => u.username === user)) {
      status.textContent = 'Usuário já existe';
      return;
    }
  
    users.push({ username: user, password: pass });
    saveUsers(users);
    status.style.color = '#4ade80';
    status.textContent = 'Usuário cadastrado com sucesso! Agora é só fazer login.';
  }
  