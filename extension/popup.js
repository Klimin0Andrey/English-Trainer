// Логика всплывающего окна

const API_URL = 'http://localhost:8000';

// DOM элементы
const unauthorizedDiv = document.getElementById('unauthorized');
const authorizedDiv = document.getElementById('authorized');
const userEmailSpan = document.getElementById('user-email');
const wordInput = document.getElementById('word-input');
const addWordBtn = document.getElementById('add-word-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const statusMessage = document.getElementById('status-message');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// Проверка авторизации
const checkAuth = async () => {
  const result = await chrome.storage.local.get(['access_token', 'user_email']);
  const token = result.access_token;
  const email = result.user_email;
  
  if (token && email) {
    unauthorizedDiv.classList.add('hidden');
    authorizedDiv.classList.remove('hidden');
    userEmailSpan.textContent = email;
    return true;
  } else {
    unauthorizedDiv.classList.remove('hidden');
    authorizedDiv.classList.add('hidden');
    return false;
  }
};

// Показать сообщение
const showMessage = (text, isError = false) => {
  statusMessage.textContent = text;
  statusMessage.className = isError ? 'status-error' : 'status-success';
  statusMessage.classList.remove('hidden');
  
  setTimeout(() => {
    statusMessage.classList.add('hidden');
  }, 3000);
};

// Добавление слова
const addWord = async () => {
  const word = wordInput.value.trim();
  if (!word) {
    showMessage('Введите слово', true);
    return;
  }
  
  const token = await chrome.storage.local.get('access_token').then(r => r.access_token);
  
  if (!token) {
    showMessage('Не авторизован', true);
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ english: word })
    });
    
    if (response.ok) {
      showMessage(`✅ Слово "${word}" добавлено!`);
      wordInput.value = '';
    } else {
      const error = await response.json();
      showMessage(`❌ ${error.detail || 'Ошибка'}`, true);
    }
  } catch (error) {
    showMessage('❌ Ошибка соединения', true);
  }
};

// Логин
const login = async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  if (!email || !password) {
    showMessage('Введите email и пароль', true);
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      await chrome.storage.local.set({
        access_token: data.access_token,
        user_id: data.user_id,
        user_email: data.email
      });
      
      showMessage('✅ Авторизация успешна!');
      setTimeout(() => checkAuth(), 1000);
    } else {
      const error = await response.json();
      showMessage(`❌ ${error.detail || 'Ошибка входа'}`, true);
    }
  } catch (error) {
    showMessage('❌ Ошибка соединения', true);
  }
};

// Выход
const logout = async () => {
  await chrome.storage.local.remove(['access_token', 'user_id', 'user_email']);
  showMessage('Вы вышли');
  checkAuth();
};

// Обработчики событий
addWordBtn.addEventListener('click', addWord);

wordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addWord();
});

loginBtn.addEventListener('click', login);

loginPassword.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

logoutBtn.addEventListener('click', logout);

// Инициализация
checkAuth();