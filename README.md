# LearnBridge
*A platform that bridges learners with tutors for efficient and effective learning experiences.*

---

## 📌 Overview
LearnBridge is a full-stack learning support platform where students can search, connect, and collaborate with tutors based on skills and academic needs. The system supports communication, resource sharing, and feedback to build a healthy learning journey.

---

## ✨ Features
- 🔐 Google OAuth Login & Registration
- 👥 Separate roles for Students & Tutors
- 👤 User Profiles (bio, credentials, ratings & comments)
- ⭐ Review & Rating System
- ❤️ Favorites (Tutors & Learning Materials)
- 💬 Messaging between learners and tutors
- 📚 Upload & favorite learning materials
- 🔔 Notification & interaction feedback system

---

## 🏗️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 13+ |
| Backend | Node.js (Express) |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth |
| UI | TailwindCSS |

---

## 🚀 Installation & Setup

### ✅ Requirements
- Node.js (v18+ recommended)
- MongoDB (local or online through MongoDB Atlas)
- NPM or Yarn

### 🛠️ Setup Instructions
```bash
# Clone repository
git clone https://github.com/Kyu020/LearnBridge.git
cd LearnBridge

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 🔑 Environment Variables
Create your `.env` file using the following template:
```
MONGO_URI=your_database_url_here
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📂 Project Structure
```
/src
  /app
  /components
  /models
  /controllers
  /routes
  /middleware
```

---

## ✅ Current Implemented Features
- ✅ User Authentication
- ✅ Google Sign-In
- ✅ Profile Model Structure
- ✅ Rating / Favorites System Design
- 🛠️ Messaging Feature (in progress)
- 🛠️ Notifications (in progress)

---

## 🔥 Future Enhancements
- AI-powered tutor recommendations
- Real-time chat using sockets
- Video tutoring sessions
- Secure online payments & premium features
- Mobile version

---

## 🤝 Contributing
Help is always welcome!
1. Fork the project
2. Create your new feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add something cool"`
4. Push: `git push origin feature-name`
5. Submit Pull Request ✅

---

## 👨‍💻 Contributors
- **Aaron Jan Estacio** — Full Stack Developer
- **Aakim Catbagan** - Frontend Designer
# elective2-learnbridge
