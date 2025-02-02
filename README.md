
# File Service

## Опис проекту
Цей проект є сервісом для роботи з файлами, що використовує JWT-аутентифікацію та підтримує інтеграцію з Google OAuth 2.0.  

---

## Встановлення та запуск

### 1. Клонуйте репозиторій:
```bash
git clone https://github.com/Zak-Roz/file-service.git
cd file-service
```

### 2. Налаштуйте середовище:
Перейменуйте файл `.env.example` в `.env`:
```bash
cp .env.example .env
```
Відредагуйте `.env`, вказавши необхідні параметри підключення до бази даних, Redis і OAuth.

### 3. Запустіть Docker:
```bash
sudo docker-compose up
```

### 4. Перейдіть за посиланням для аутентифікації:
Відкрийте у браузері:
```
http://localhost:3000/auth/google
```
Виберіть Google-акаунт для входу. Після цього відбудеться переадресація на Swagger UI, де в URL можна знайти JWT токен для роботи з API.
