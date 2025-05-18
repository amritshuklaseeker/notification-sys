# 🚀 Notification Service

## 🎯 Objective
Build a robust system to send notifications via Email, SMS, and In-App channels with queue-based processing and automatic retries.

---

## ✨ Features
- **Multi-channel Delivery**:
  - 📧 Email notifications
  - 📱 SMS alerts
  - 🔔 In-app messages
- **Queue Processing**: RabbitMQ for async handling
- **Retry Mechanism**: 3 attempts with delay for failed deliveries
- **Tracking**: MongoDB stores all notification states
- **REST API**:
  - `POST /notifications` - Queue new notifications
  - `GET /users/{id}/notifications` - Retrieve user notifications

---

## 🧰 Tech Stack
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Queue**: RabbitMQ
- **Environment**: dotenv

---

## 🛠️ Setup Guide

### Prerequisites
- Node.js v14+
- MongoDB instance
- RabbitMQ server

### Installation
```bash
# Clone repository
git clone https://github.com/abhimanyusingh1413/notification-service
cd notification-service

# Install dependencies
npm install

# Configure environment (create .env file)
cp .env.example .env

Configuration (.env)


# Add email/SMS provider keys when ready


Running the Service
bash
# Start API server
node index.js

# In separate terminal - start worker
node notificationWorker.js

 API Documentation


Send Notification
Endpoint: POST /notifications

{
  "userId": "user123",
  "type": "email",
  "content": "Your order has shipped!"
}

Success Response:
{
  "message": "Notification queued",
  "notification": {
    "_id": "60e9f2c5f0c5e827f0abc123",
    "status": "queued",
    "createdAt": "2025-05-17T12:00:00.000Z"
  }
}

👨‍💻 Author

AMRIT PRAKASH SHUKLA
amritprakashshukla123@gmail.com


