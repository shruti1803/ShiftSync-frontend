# ShiftSync — Frontend

> 🌐 **Live App:** https://shift-sync-frontend-lemon.vercel.app
> 📖 **Backend API:** https://shiftsync-backend-zco3.onrender.com/swagger-ui.html
> 💻 **Backend Repo:** https://github.com/shruti1803/ShiftSync

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)

---

## About

React frontend for ShiftSync — an Internal HR Operations Portal for 
shift-based teams. Connects to a Spring Boot 3 backend API.

---

## Pages

| Page | Description |
|---|---|
| 🔐 Login | Mock authentication — enter any name and email |
| 📊 Dashboard | Leave balances, WFH quota, holiday banner, stat cards |
| 🗓️ Shifts | My shift schedule with holiday overlays |
| 🌴 Leave | Apply/cancel leave, view history and balances |
| 🏠 WFH | Request WFH, track monthly balance |
| 🔄 Shift Swap | Request swaps, respond to incoming requests |
| ⏰ Comp-Off | View active comp-off credits |
| 📞 On-Call | View roster, acknowledge duties |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | TailwindCSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Backend running on port 8080

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/shruti1803/shiftsync-frontend.git
cd shiftsync-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env.local`**
VITE_API_URL=http://localhost:8080/api/v1

**4. Run dev server**
```bash
npm run dev
```

**5. Open browser**
http://localhost:5173
---

## Project Structure
src/
├── api/ # Axios instance + API service files
│ ├── axios.js # Base config with JWT interceptor
│ ├── authApi.js
│ ├── leaveApi.js
│ ├── wfhApi.js
│ ├── shiftApi.js
│ ├── swapApi.js
│ ├── compOffApi.js
│ ├── holidayApi.js
│ └── onCallApi.js
├── components/
│ └── layout/
│ ├── Sidebar.jsx
│ └── Layout.jsx
├── context/
│ └── AuthContext.jsx # Login/logout state management
└── pages/
├── Login.jsx
├── Dashboard.jsx
├── Leaves.jsx
├── Wfh.jsx
├── Shifts.jsx
├── ShiftSwap.jsx
├── CompOff.jsx
└── OnCall.jsx
---

## Environment Variables

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API base URL |

For production this is set to:
https://shiftsync-backend-zco3.onrender.com/api/v1
---

## Note on Backend

The backend is hosted on Render free tier which spins down after 
15 minutes of inactivity. First request may take 30-60 seconds 
to wake up. This is expected behaviour on free tier hosting.

---

## Author

**Shruti** — Linux Administrator transitioning to Java Backend Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/YOUR_PROFILE)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat-square&logo=github)](https://github.com/shruti1803)
