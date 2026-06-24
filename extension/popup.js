// Логика всплывающего окна

const API_URL = 'https://english-trainer-rg8f.onrender.com';

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


// =====================
// Проверка авторизации
// =====================
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


// =====================
// UI сообщение
// =====================
const showMessage = (text, isError = false) => {
  statusMessage.textContent = text;
  statusMessage.className = isError ? 'status-error' : 'status-success';
  statusMessage.classList.remove('hidden');

  setTimeout(() => {
    statusMessage.classList.add('hidden');
  }, 3000);
};


// =====================
// Добавление слова
// =====================
const addWord = async () => {
  const word = wordInput.value.trim();
  if (!word) return showMessage('Введите слово', true);

  const { access_token: token } = await chrome.storage.local.get('access_token');

  console.log('TOKEN:', token);

  if (!token) {
    return showMessage('Не авторизован', true);
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

    const data = await response.json().catch(() => ({}));
    console.log('ADD WORD RESPONSE:', data);

    if (response.ok) {
      showMessage(`✅ Слово "${word}" добавлено!`);
      wordInput.value = '';
    } else {
      showMessage(`❌ ${data.detail || 'Ошибка'}`, true);
    }

  } catch (error) {
    console.error(error);
    showMessage('❌ Ошибка соединения', true);
  }
};


// =====================
// Логин
// =====================
const login = async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    return showMessage('Введите email и пароль', true);
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));

    console.log('LOGIN RESPONSE:', data);

    if (!response.ok) {
      return showMessage(`❌ ${data.detail || 'Ошибка входа'}`, true);
    }

    // 🔥 ГИБКАЯ ОБРАБОТКА (важно!)
    const token = data.access_token || data.token || data.accessToken;
    const emailResp = data.email || email;

    if (!token) {
      console.error('❌ Backend не вернул токен:', data);
      return showMessage('❌ Ошибка: нет токена от сервера', true);
    }

    await chrome.storage.local.set({
      access_token: token,
      user_id: data.user_id || null,
      user_email: emailResp
    });

    showMessage('✅ Авторизация успешна!');
    setTimeout(checkAuth, 500);

  } catch (error) {
    console.error(error);
    showMessage('❌ Ошибка соединения', true);
  }
};


// =====================
// Выход
// =====================
const logout = async () => {
  await chrome.storage.local.remove(['access_token', 'user_id', 'user_email']);
  showMessage('Вы вышли');
  checkAuth();
};


// =====================
// Events
// =====================
addWordBtn.addEventListener('click', addWord);

wordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addWord();
});

loginBtn.addEventListener('click', login);

loginPassword.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

logoutBtn.addEventListener('click', logout);


// =====================
// Init
// =====================
checkAuth();