# 📚 English Trainer

> Полноценное приложение для изучения английского языка с интервальным повторением, викторинами и расширением для браузера.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.138.0-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql)](https://neon.tech/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=flat&logo=render)](https://render.com/)

---

## 🌟 Особенности

### 📖 Управление словами
- **Добавление слов** — введите слово на английском, перевод подтянется автоматически.
- **Транскрипция и примеры** — автоматическое получение произношения и контекста.
- **Категории** — группировка слов по темам (Еда, Путешествия, Работа и т.д.).
- **Уровни сложности** — Beginner 🟢, Intermediate 🟡, Advanced 🔴.
- **Редактирование** — изменение перевода, транскрипции, примеров и категории.

### 🧠 Интервальное повторение
- **SM-2 алгоритм** — эффективная система запоминания.
- **Оценка сложности** — Again / Hard / Good / Easy.
- **Автоматическое планирование** — слова показываются в оптимальное время.
- **Статистика** — отслеживание прогресса и точности.

### 🎯 Викторина
- **Выбор правильного перевода** — 4 варианта ответа.
- **Перемешивание** — вопросы и ответы каждый раз в разном порядке.
- **Выбор количества** — от 5 до 100 вопросов за сессию.

### 🃏 Карточки
- **Анимация переворота** — плавный 3D-переворот.
- **Выбор количества** — можно показывать все слова или ограниченное число.
- **Автоматическое перемешивание** — при достижении конца списка.

### 📝 Импорт из текста
- **Вставка текста** — система находит все уникальные слова.
- **Выборочное добавление** — можно добавить только нужные слова.
- **Автоматический перевод** — для всех новых слов.

### 🔌 Расширение для браузера
- **Выделение слова** — появляется подсказка для добавления.
- **Контекстное меню** — правый клик → "Добавить в English Trainer".
- **Попап** — ручное добавление слов.
- **Авторизация** — вход прямо из расширения.

### 🎨 Интерфейс
- **Тёмная тема** — комфортное использование в любое время суток.
- **Адаптивный дизайн** — работает на всех устройствах.
- **Плавные анимации** — приятное взаимодействие.
- **Реальная статистика** — отслеживание прогресса.

---

## 🏗️ Технологический стек

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| FastAPI | 0.138.0 | Веб-фреймворк |
| SQLAlchemy | 2.0.51 | ORM для работы с БД |
| PostgreSQL | 17+ | Основная база данных |
| Alembic | 1.18.4 | Миграции |
| Pydantic | 2.13.4 | Валидация данных |
| JWT | python-jose | Аутентификация |
| Passlib | 1.7.4 | Хеширование паролей |
| Deep Translator | 1.11.4 | Автоматический перевод |

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 19.2.6 | UI-библиотека |
| TypeScript | 6.0.2 | Типизация |
| Vite | 8.0.12 | Сборщик |
| Tailwind CSS | 4.3.1 | Стилизация |
| Framer Motion | 12.41.0 | Анимации |
| React Router | 7.18.0 | Маршрутизация |
| Axios | 1.18.1 | HTTP-клиент |

### Инфраструктура

| Сервис | Назначение |
|--------|------------|
| Neon | PostgreSQL в облаке |
| Render | Хостинг бэкенда и фронтенда |
| GitHub | Хранение кода |

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/Klimin0Andrey/English-Trainer.git
cd English-Trainer
```

### 2. Настройка бэкенда

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Создай файл `.env`:

```env
# PostgreSQL
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Примени миграции:

```bash
alembic upgrade head
```

Запусти бэкенд:

```bash
uvicorn app.main:app --reload
```

### 3. Настройка фронтенда

```bash
cd frontend
npm install
npm run dev -- --host
```

### 4. Настройка расширения

- Перейди на `chrome://extensions/`.
- Включи "Режим разработчика".
- Нажми "Загрузить распакованное расширение".
- Выбери папку `extension`.

---

## 📁 Структура проекта

```text
English-Trainer/
├── backend/
│   ├── app/
│   │   ├── api/              # API эндпоинты
│   │   │   ├── auth.py       # Авторизация
│   │   │   ├── words.py      # Слова
│   │   │   ├── categories.py # Категории
│   │   │   ├── review.py     # Повторение
│   │   │   └── quiz.py       # Викторина
│   │   ├── core/             # Настройки и безопасность
│   │   ├── db/               # Подключение к БД
│   │   ├── models/           # SQLAlchemy модели
│   │   ├── schemas/          # Pydantic схемы
│   │   ├── services/         # Бизнес-логика
│   │   └── main.py           # Точка входа
│   ├── alembic/              # Миграции
│   ├── requirements.txt      # Зависимости
│   └── .env                  # Переменные окружения
├── frontend/
│   ├── src/
│   │   ├── api/              # Клиенты API
│   │   ├── components/       # React компоненты
│   │   ├── context/          # React контексты
│   │   ├── hooks/            # Кастомные хуки
│   │   ├── pages/            # Страницы
│   │   ├── types/            # TypeScript типы
│   │   └── App.tsx           # Корневой компонент
│   ├── package.json          # Зависимости
│   └── vite.config.ts        # Настройки Vite
├── extension/
│   ├── background.js         # Фоновый скрипт
│   ├── content.js            # Внедряемый скрипт
│   ├── popup.html            # Всплывающее окно
│   ├── popup.js              # Логика попапа
│   ├── manifest.json         # Конфигурация расширения
│   └── icons/                # Иконки расширения
├── docker-compose.yml        # Docker для разработки
└── README.md                  # Документация
```

## 🧠 Как работает интервальное повторение

### Алгоритм SM-2

| Оценка | Изменение strength | Изменение интервала |
|--------|--------------------|---------------------|
| Again | -20% | Делится на 2 |
| Hard | -10% | Остаётся прежним |
| Good | +5% | Умножается на 2 |
| Easy | +15% | Умножается на 3 |

### Пример повторения слова `apple`
- В первый раз: `interval = 1 день`.
- Оценка `Good`: `interval = 2 дня`.
- Оценка `Good`: `interval = 4 дня`.
- Оценка `Good`: `interval = 8 дней`.
- Оценка `Good`: `interval = 16 дней`.
- ... пока `interval` не достигнет `30+ дней`.

### Условия "выученности"
Слово считается выученным, если:
- `strength >= 90%`.
- `interval_days >= 30`.
- `correct_count >= 5`.

---

## 📦 Продакшн

### Деплой на Render (бэкенд)

Создай `render.yaml` в корне:

```yaml
services:
  - type: web
    name: english-trainer-api
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Добавь переменные окружения в Render:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`

### Деплой на Render (фронтенд)

```yaml
services:
  - type: web
    name: english-trainer-frontend
    runtime: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

---

## 🔧 API Эндпоинты

### Авторизация

| Метод | Путь | Описание |
|------|------|----------|
| POST | `/auth/register` | Регистрация |
| POST | `/auth/login` | Вход (JWT) |
| GET | `/auth/me` | Информация о пользователе |

### Слова

| Метод | Путь | Описание |
|------|------|----------|
| GET | `/words` | Список слов |
| POST | `/words` | Создать слово |
| PUT | `/words/{id}` | Обновить слово |
| DELETE | `/words/{id}` | Удалить слово |

### Категории

| Метод | Путь | Описание |
|------|------|----------|
| GET | `/categories` | Список категорий |
| POST | `/categories` | Создать категорию |
| DELETE | `/categories/{id}` | Удалить категорию |

### Повторение

| Метод | Путь | Описание |
|------|------|----------|
| GET | `/review/due` | Слова для повторения |
| POST | `/review/{id}` | Оценить слово |
| GET | `/review/stats` | Статистика |

### Викторина

| Метод | Путь | Описание |
|------|------|----------|
| GET | `/quiz/questions` | Вопросы для викторины |
| POST | `/quiz/answer` | Проверить ответ |

---

## 🤝 Вклад в проект

- Форкни репозиторий.
- Создай ветку для фичи.
- Закоммить изменения.
- Отправь Pull Request.

---

## 📜 Лицензия

MIT License

---

## ✨ Автор

Климин Андрей

---

## 🙏 Благодарности

- [FastAPI](https://fastapi.tiangolo.com/) — за отличный фреймворк.
- [React](https://reactjs.org/) — за мощный UI.
- [Neon](https://neon.tech/) — за бесплатный PostgreSQL в облаке.
- [Render](https://render.com/) — за простой деплой.

---

## 🌐 Ссылки

- Демо: [English Trainer](https://english-trainer-frontend.onrender.com/)
- API Docs: [Swagger](https://english-trainer-rg8f.onrender.com/docs)
- Репозиторий: [GitHub](https://github.com/Klimin0Andrey/English-Trainer)