// Фоновый скрипт для обработки контекстного меню и запросов

const API_URL = 'http://localhost:8000';

// Создаём контекстное меню при установке
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addWordToEnglishTrainer',
    title: '📚 Добавить в English Trainer',
    contexts: ['selection']
  });
  console.log('✅ Контекстное меню создано');
});

// Обработка клика по контекстному меню
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('🔍 Клик по контекстному меню', info.selectionText);
  
  if (info.menuItemId === 'addWordToEnglishTrainer') {
    const selectedText = info.selectionText.trim();
    
    if (selectedText && selectedText.length > 0) {
      addWordToDictionary(selectedText);
    }
  }
});

// Получение токена из хранилища
const getToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['access_token'], (result) => {
      console.log('🔑 Токен из хранилища:', result.access_token ? 'Есть' : 'Нет');
      resolve(result.access_token);
    });
  });
};

// Добавление слова в словарь
const addWordToDictionary = async (word) => {
  console.log(`📝 Добавление слова: "${word}"`);
  
  try {
    const token = await getToken();
    
    if (!token) {
      console.error('❌ Нет токена');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'English Trainer',
        message: '❌ Не авторизован. Войдите в приложение.'
      });
      return { success: false, error: 'Войдите в приложение' };
    }
    
    console.log('📤 Отправка запроса к API...');
    
    const response = await fetch(`${API_URL}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ english: word })
    });
    
    console.log('📥 Ответ от API:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ Ошибка API:', error);
      
      if (response.status === 401) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'English Trainer',
          message: '❌ Сессия истекла. Войдите заново.'
        });
        chrome.storage.local.remove(['access_token', 'user_id', 'user_email']);
        return { success: false, error: 'Сессия истекла' };
      }
      
      const errorText = error.detail || 'Не удалось добавить слово';
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'English Trainer',
        message: `❌ Ошибка: ${errorText}`
      });
      return { success: false, error: errorText };
    }
    
    const data = await response.json();
    console.log('✅ Слово добавлено:', data);
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'English Trainer',
      message: `✅ Слово "${word}" добавлено!`
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Ошибка соединения:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'English Trainer',
      message: '❌ Ошибка соединения с сервером'
    });
    return { success: false, error: 'Ошибка соединения' };
  }
};

// Слушаем сообщения от попапа и контент-скрипта
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Получено сообщение:', request);
  
  if (request.action === 'addWord') {
    addWordToDictionary(request.word)
      .then((result) => {
        console.log('📨 Отправка ответа:', result);
        sendResponse(result);
      })
      .catch((err) => {
        console.error('❌ Ошибка:', err);
        sendResponse({ success: false, error: err.message || 'Внутренняя ошибка' });
      });
    return true;
  }
  
  if (request.action === 'getToken') {
    getToken().then(token => sendResponse({ token }));
    return true;
  }
  
  if (request.action === 'saveToken') {
    chrome.storage.local.set({ 
      access_token: request.token,
      user_email: request.email,
      user_id: request.userId
    }, () => {
      console.log('💾 Токен сохранён');
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('🚀 English Trainer Extension запущен');