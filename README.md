# 📝 Task Tracker (HTML, CSS, JavaScript)

A simple and responsive **Task Tracker Web Application** built using **HTML**, **CSS**, and **JavaScript**, featuring LocalStorage persistence, dynamic task filtering, and seamless deployment on **Microsoft Azure** via **GitHub CI/CD**.

---

## 🔧 Technologies Used

* HTML5
* CSS3 (Flexbox & Grid)
* JavaScript (ES6+)
* LocalStorage (Data Persistence)
* Visual Studio Code
* Git & GitHub (Version Control)
* Azure Static Web Apps (Cloud Hosting)
* GitHub Actions (CI/CD Integration)
* Google AdSense (Ad Integration)

---

## ✅ Features

* Add, Edit, Delete, and Complete Tasks
* Task Filters: All, Active, Completed, and Priority-based
* Real-time Task Statistics (Total, Completed, Active)
* Toast Notifications for user actions
* Persistent storage using **LocalStorage**
* Responsive design using **Flexbox** and **Grid**
* Integrated **AdSense** with fallback placeholder
* Automatic Deployment via **GitHub → Azure CI/CD**

---

📢 **Notes**

* All task data is saved in the browser’s **LocalStorage**
* App works offline once loaded
* Fallback message appears if AdSense is blocked or disabled
* Responsive design adapts to mobile and desktop screens
* Deployment pipeline automatically redeploys when pushing to `main` branch

---

## 🛠 How to Run Locally

1. Clone this repository or download the ZIP

   ```bash
   git clone https://github.com/kvvr0076/task-tracker.git
   ```
2. Open the folder in **Visual Studio Code**
3. Launch `index.html` in your browser
4. (Optional) Replace your AdSense client ID:

   ```html
   <script data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"></script>
   ```
5. Make changes, commit, and push to GitHub:

   ```bash
   git add .
   git commit -m "Updated task UI and logic"
   git push origin main
   ```
6. Azure automatically rebuilds and redeploys the app using GitHub Actions.

---

## ☁️ Cloud Deployment Details

* **Cloud Platform:** Microsoft Azure Static Web Apps
* **CI/CD Pipeline:** GitHub Actions → Azure
* **Trigger:** Auto-deploys on each `main` branch commit
* **Workflow File:** `azure-static-web-apps-lemon-ocean-04ec7fd10.yml`
* **Hosting Type:** Static Web App (Zero Downtime Deployments)

🔗 **Live Website:** [https://lemon-ocean-04ec7fd10.3.azurestaticapps.net/](https://lemon-ocean-04ec7fd10.3.azurestaticapps.net/)
🔗 **GitHub Repository:** [https://github.com/kvvr0076/task-tracker](https://github.com/kvvr0076/task-tracker)

---

## 📊 Deployment Status

[![Azure Static Web Apps CI/CD](https://github.com/kvvr0076/task-tracker/actions/workflows/azure-static-web-apps-lemon-ocean-04ec7fd10.yml/badge.svg)](https://github.com/kvvr0076/task-tracker/actions/workflows/azure-static-web-apps-lemon-ocean-04ec7fd10.yml)

🔗 **View Workflow Logs:** [Click Here](https://github.com/kvvr0076/task-tracker/actions/workflows/azure-static-web-apps-lemon-ocean-04ec7fd10.yml)
🔗 **Live Website:** [https://lemon-ocean-04ec7fd10.3.azurestaticapps.net/](https://lemon-ocean-04ec7fd10.3.azurestaticapps.net/)

---

## 📁 Folder Structure

```
TaskTracker/
├── index.html        # Main Interface and AdSense Integration
├── style.css         # Layout, Theme, and Responsive Design
├── script.js         # Core Task Logic (CRUD, Stats, Filters)
└── ads.txt           # AdSense Authorization File
```

---

## Optional Step

* Run locally using Live Server in VS Code for auto-refresh
* For testing webhooks: use `ngrok http <portnumber>`
* Azure redeploys automatically after each push to GitHub

---

* Created by **Vishnuvardhan Reddy Komatireddy**
* Year: **2025**
