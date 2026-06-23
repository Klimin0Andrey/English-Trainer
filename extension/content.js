// Скрипт, внедряемый на страницы
// Показывает всплывающую подсказку при выделении слова

console.log('🚀 CONTENT SCRIPT ЗАГРУЖЕН!');

// Создаём контейнер для всплывающей подсказки
const tooltip = document.createElement('div');
tooltip.id = 'english-trainer-tooltip';
tooltip.style.cssText = `
  position: fixed;
  display: none;
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: system-ui, -apple-system, sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000000;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;
`;

tooltip.textContent = '📚 Добавить в English Trainer';
document.body.appendChild(tooltip);

let hideTimeout = null;
let currentWord = '';

// Обработка выделения текста
document.addEventListener('mouseup', (e) => {
  // Если кликнули на саму подсказку, не сбрасываем ее состояние
  if (e.target === tooltip) return;

  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  // Очищаем предыдущий таймер
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  
  if (text && text.length > 1 && text.length < 50) {
    // Проверяем, что выделение состоит только из букв
    const word = text.replace(/[^a-zA-Z']/g, '');
    if (word && word.length > 1) {
      currentWord = word;
      
      // Позиционируем подсказку над выделением
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      const x = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
      const y = rect.top - 40;
      
      tooltip.style.left = `${Math.max(10, x)}px`;
      tooltip.style.top = `${Math.max(10, y)}px`;
      tooltip.style.display = 'block';
      console.log('💡 Подсказка для:', currentWord);
    } else {
      tooltip.style.display = 'none';
    }
  } else {
    // Скрываем с задержкой, чтобы успели кликнуть
    hideTimeout = setTimeout(() => {
      tooltip.style.display = 'none';
    }, 300);
  }
});

// Обработка клика по подсказке
tooltip.addEventListener('click', () => {
  if (!currentWord) return;
  
  console.log('🖱️ КЛИК ПО ПОДСКАЗКЕ! Слово:', currentWord);
  
  tooltip.textContent = '⏳ Добавление...';
  tooltip.style.background = '#6366f1';
  
  // Отправляем сообщение в background.js
  chrome.runtime.sendMessage(
    { action: 'addWord', word: currentWord },
    (response) => {
      console.log('📨 ОТВЕТ ОТ BACKGROUND:', response);
      
      if (chrome.runtime.lastError) {
        console.error('❌ Ошибка расширения:', chrome.runtime.lastError);
        tooltip.textContent = '❌ Ошибка расширения';
        setTimeout(() => {
          tooltip.textContent = '📚 Добавить в English Trainer';
          tooltip.style.display = 'none';
        }, 2000);
        return;
      }

      if (response && response.success) {
        tooltip.textContent = '✅ Добавлено!';
        tooltip.style.background = '#22c55e';
        setTimeout(() => {
          tooltip.textContent = '📚 Добавить в English Trainer';
          tooltip.style.background = '#6366f1';
          tooltip.style.display = 'none';
        }, 1500);
      } else {
        const errorMsg = response && response.error ? response.error : 'Не удалось добавить';
        tooltip.textContent = `❌ ${errorMsg}`;
        tooltip.style.background = '#ef4444';
        setTimeout(() => {
          tooltip.textContent = '📚 Добавить в English Trainer';
          tooltip.style.background = '#6366f1';
          tooltip.style.display = 'none';
        }, 2500);
      }
    }
  );
});

// Скрываем при прокрутке
document.addEventListener('scroll', () => {
  tooltip.style.display = 'none';
});

// Скрываем при клике вне подсказки
document.addEventListener('mousedown', (e) => {
  if (e.target !== tooltip) {
    tooltip.style.display = 'none';
  }
});