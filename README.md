# RippleSync Frontend

[![Docker Image CI](https://github.com/JKMN-Projects/ripple_sync_frontend/actions/workflows/build-image.yml/badge.svg)](https://github.com/JKMN-Projects/ripple_sync_frontend/actions/workflows/build-image.yml)

A powerful and intuitive Angular web client for **RippleSync**, the cross-platform social media management platform.  
Designed for scheduling, publishing, and analyzing content across multiple social media channels.

---

## 🚀 Features

- **Cross-Platform Publishing**  
  Create and schedule posts for X (Twitter), LinkedIn, Facebook, Instagram, and Threads.

- **Real-Time Dashboard**  
  See upcoming posts, engagement metrics, and historical analytics in an interactive UI.

- **Secure Authentication**  
  Login and session handling through JWT tokens issued by the RippleSync Backend.

- **Responsive & Mobile-First**  
  Clean, modern UI built to work seamlessly on desktop and mobile.

- **Media Upload Support**  
  Upload and attach images/videos when composing posts.

- **Integration Management**  
  Connect and manage your social media accounts directly from the application.

- **Analytics Visualization**  
  Charts and graphs showing reach, impressions, engagement, and platform performance.

---

## 📋 Prerequisites

- [**Node.js** ≥ 24](https://nodejs.org/en/download)
- **npm**
- [**Angular CLI** ≥ 20](https://www.npmjs.com/package/@angular/cli)
- A running instance of the **RippleSync Backend**  
- A modern desktop or mobile browser

---

## 🏗️ Architecture

```
src/
├── app/
│ ├── components/ # Independent components, reusable
│ ├── interceptors/ # security and auth based
│ ├── interfaces/ # interfaces
│ ├── pages/ # Main pages for the site
│ ├── services/ # Application layer for site
│ ├── utility/ # Utilities
│ └── app.ts # Root Angular module
├── assets/ # Icons, images, fonts, static files, styles for global components
├── environments/ # environment.ts and environment.prod.ts
└── styles.scss # Global SCSS styles
```

---

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jkmn-projects/ripple_sync_frontend.git
cd ripple_sync_frontend
```

### 2. Install Dependencies

```bash
   npm install
```

### 3. Configure Environment Variables
Update src/environments/environment.ts:

```ts
   export const environment = {
      production: false,
      apiBaseUrl: 'http://localhost:7275/api'
    };
```
Update environment.prod.ts as needed for your production environment.


### 📡 Backend Integration

RippleSync Frontend communicates with the Backend through the following API groups:
- Authentication → `/api/authentication`
- Post Management → `/api/post`
- Platform Integrations → `/api/integration`
- Analytics Dashboard → `/api/dashboard/total`

Ensure CORS and environment settings match your backend configuration.



## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Jukman** - Initial work and maintenance

## 🔗 Related Projects

- [RippleSync Backend](https://github.com/JKMN-Projects/ripple_sync_backend) - .NET based API

## 📧 Contact

For questions or support, please reach out to the development team.

---

Built by **Jukman** with ❤️ — bringing smarter, unified social media workflows to life.


