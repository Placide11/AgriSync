# 🌾 AgriSync Lite – A Farm Operations Platform

AgriSync Lite is a simplified farm management web application designed to help farmers efficiently manage daily farm operations such as crop tracking, task assignment, and finance monitoring.

## 🚀 Tech Stack

### 🖥️ Frontend (React)
- React + Vite
- Tailwind CSS
- React Router
- Axios
- JWT Authentication

### 🛠 Backend (Django)
- Django
- Django REST Framework
- PostgreSQL
- JWT (via `djangorestframework-simplejwt`)
- CORS Headers

## 📁 Project Structure

### 📂 Frontend – `agrisync-frontend/`
```
src/
├── components/
├── pages/
├── hooks/
├── services/
├── App.jsx
├── main.jsx
```

### 📂 Backend – `agrisync-backend/`
```
agrisync/
├── core/ → Auth & common models
├── crops/ → Crop CRUD APIs
├── tasks/ → Task assignment APIs
├── finance/ → Income/Expense management
├── inventory/ → Inventory management 
```

## ✅ Features Implemented

- 🔐 JWT-based login
- 🧑‍🌾 Role-based access: Admin vs Worker
- 🌱 Crop management (CRUD)
- 📋 Task assignment + tracking
- 💰 Finance tracking
- 🧭 Navigation dashboard with dynamic views
- 📦 Modular architecture (Django apps + React components)

## 🛠 Setup Instructions

### ⚙️ Backend Setup

1. **Create and activate virtual environment:**
   ```bash
   python -m venv env
   source env/bin/activate  # or env\Scripts\activate on Windows
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run server:**
   ```bash
   python manage.py runserver
   ```

### 🖼 Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd agrisync-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

- JWT tokens are stored in localStorage
- Protected routes are handled with React Router + role-based rendering
- Login endpoint: `/api/auth/login/`

<!-- ## 🧪 Testing

- Django unit tests: `python manage.py test`
- React testing with Testing Library (if set up) -->

## 🧠 Future Improvements

- ✅ Better UI and mobile responsiveness
- 📱 Add PWA features or mobile app
- 🧾 Report export (PDF, CSV)
- 📊 Dashboards with analytics
- 🌐 Deployment (Netlify + Railway/Vercel)

## 👤 Author

**Placide Shema**  
BSc. Software Engineering, African Leadership University  

---

*Built with ❤️ for the farming community*
#
