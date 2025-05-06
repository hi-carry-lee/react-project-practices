# Project Name

Mern Crash project

## Project Introduction

A fullstack practice project based on ExpressJS and Vite React. This project implements various core features for learning and practice purposes.

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Node.js + ExpressJS
- **Database:** MongoDB + Mongoose

## Project Structure

```
/frontend     # Frontend (Vite + React)
/backend     # Backend (ExpressJS)

```

## Getting Started

### Requirements

- Node.js 18+

### Start the Backend and Frontend

Since this is a monorepo project, you can start the backend server and frontend server by running:

```bash
pnpm install
pnpm --filter 1-back dev
pnpm --filter 1-front dev
```

## Environment Variables

You need to create a `.env` file in the root of the 1-mern-crash project and add the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/test
```

For the MONGO_URI, you can create an account at MongoDB Atlas, create a new cluster, and get the connection string.

## FAQ

- Why this project?

This project is a simple fullstack practice project based on ExpressJS and Vite React. It helps refresh my knowledge of the MERN stack. As a fullstack developer, I have used React for the frontend for a long time, but I always feel there's a gap between me and professional frontend developers. This project is a great opportunity for me to practice and improve my frontend skills. It also provides a place for me to add more features in the future.

- Why monorepo?

Previously, I created every project as a separate repository, but I found that each project occupied a lot of space on my disk. Therefore, I decided to use a monorepo to manage all my projects. Since they can share the same dependencies, this saves a lot of space.
In big companies, they all use monorepos to manage their projects, so it's a good idea to get familiar with this approach.

## TODO

- [ ] Add user authentication
