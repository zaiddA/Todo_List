# Todo Application

A full-stack Todo application built with React, Node.js, and MongoDB. This application allows users to manage their tasks with features like authentication, task statistics, and role-based access control.

## Features

- 🔐 User Authentication (Login/Register)
- 📝 Create, Read, Update, and Delete Todos
- 📊 Todo Statistics Dashboard
- 👥 Role-based Access Control (Admin/User)
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

- **Frontend:**

  - React.js
  - Tailwind CSS
  - Axios for API calls
  - React Router for navigation
  - Context API for state management

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/zaiddA/Todo_List
cd Todo_List
```

2. Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create environment variables:

   - Create a `.env` file in the server directory
   - Add the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:

```bash
# Start the server
cd server
npm run dev

# Start the client (in a new terminal)
cd client
npm start
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main application component
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Server entry point
│
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/todos/my` - Get user's todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/todos/stats` - Get todo statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Project Link: [(https://github.com/zaiddA/Todo_List)](https://github.com/zaiddA/Todo_List)
