# Upskill Progress Tracking App

This is a full-stack application designed to help users track their learning progress. It features a React frontend and a Node.js backend.

## Running the Application

To run the application, you will need Docker and Node.js installed on your machine.

### Backend

The backend runs in a Docker container. To start the backend:

1.  Navigate to the root of the project.
2.  Run `docker-compose up`.

This will start the backend server on port 5001.

### Frontend

To start the frontend:

1.  Navigate to the `frontend` directory.
2.  Run `npm install` to install the dependencies.
3.  Run `npm start`.

This will start the frontend development server on port 3001.

The frontend is configured to proxy API requests to the backend server running on port 5001.