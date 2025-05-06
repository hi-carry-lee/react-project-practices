# Project Name

Chat App

## Project Introduction

A fullstack practice project based on ExpressJS and Vite React. This project implements real-time chat functionality using Socket.io, and using JWT for authentication.

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Node.js + ExpressJS
- **Database:** MongoDB + Mongoose
- **Real-time communication:** Socket.io
- **Authentication:** JWT
- **Styling:** TailwindCSS + DaisyUI
- **Cloudinary:** For image storage

## Project Structure

```
/frontend     # Frontend (Vite + React)
/backend     # Backend (ExpressJS)

```

## Getting Started

### Requirements

- Node.js 18+

### Configure TailwindCSS

1. we use V3 here, so we should specify the version in command

```
pnpm add -D tailwindcss@3 postcss autoprefixer
pnpm exec tailwindcss init -p
```

2. For the remaining steps, follow the tailwind docs

### Start the Backend and Frontend

Since this is a monorepo project, you can start the backend server and frontend server by running:

```bash
pnpm install
pnpm --filter 2-back dev
pnpm --filter 2-front dev
```

## Environment Variables

You need to create a `.env` file in the root of the 1-mern-crash project and add the following variables:

```
MONGO_URI=
PORT=
JWT_SECRET=
NODE_ENV=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

For the MONGO_URI, you can create an account at MongoDB Atlas, create a new cluster, and get the connection string.
For the JWT_SECRET, you can use any random string in the development environment.
For the CLOUDINARY_NAME, CLOUDINARY_KEY, and CLOUDINARY_SECRET, you can create an account at Cloudinary and get the relevant information from the dashboard.

## Project Features

### Authentication

1. User registration

   - Use bcrypt to hash the password.
   - Use JWT to generate a token for the user and store the token in the cookie.

2. User login

   - Use bcrypt to compare the password.
   - Use JWT to generate a token for the user and store the token in the cookie.

3. User logout

   - Empty the "jwt" in the cookie, set the maxAge to 0.

4. Route protection
   - Use the protectRoute middleware to protect the routes that need to be authenticated.
   - Check if the token exists in the cookie, check if the token is valid, and check if the user exists in the database.

### Image Upload

1. Create an account on Cloudinary.
2. Copy Cloudinary name, key, and secret from Cloudinary and store them in the .env file.
3. Create a Cloudinary config file in the lib folder to configure the Cloudinary instance.
4. Use Cloudinary to upload images to Cloudinary; it will return the file URL and public_id.
5. Store the file URL and public_id in the database.
6. If you want to delete the file, use the Cloudinary API and pass the public_id as the parameter.

### Real-time Chat

## FAQ

- Why not TailwindCSS V4?
  Since this is a practice project, I don't want to spend time experimenting with new stuff, and this is also not a TailwindCSS practice project. So I use V3 here.

## TODO

- [ ] Waiting for more features
