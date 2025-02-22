# MindKraft Backend

This is the backend for the MindKraft project.

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication

## 🚀 Getting Started

### Prerequisites

- **Node.js** (>= v14)
- **npm** (Node Package Manager)
- **MongoDB** (Running locally or a cloud instance)

### 🔧 Setup Instructions

1. **Clone the repository**

```sh
git clone <repository-url>
cd mindkraft_backend
```

2. **Copy the environment variables**

```sh
cp .env.example .env
```

3. **Configure the `.env` file**

Fill in the required values:

```env
PORT=3001
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=238u49hkj324
```

4. **Install dependencies**

```sh
npm install
```

5. **Run the server**

```sh
npm run dev
```

The server should now be running on `http://localhost:3001`.
