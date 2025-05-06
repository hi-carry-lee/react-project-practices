# Chat App

## setup

1. install React Router, axios, and lucide-react, react-hot-toast, zustand, socket.io-client,
2. install and configure TailwindCSS V3;
3. install and configure DaisyUI
4. create a basic structure of the project:
   - src
     - components
     - pages: create a set of pages here
     - store
     - utils
     - App.jsx
     - main.jsx
5. build the routes in App.jsx
6. configure proxy in vite.config.js
   - install cors in backend
   - add cors options in backend server.js
7. configure axios in lib/axios.js
   - create a basic axios instance
   - configure the base URL, add cookies to the request
8. create useAuthStore.js to manage the authentication state:

   - create a set of states to manage the authentication state
   - create a checkAuth function to check the authentication state

9. protect the routes in App.jsx based on authUser from useAuthStore
   - if authUser is not found, redirect to login page
   - if authUser is found, redirect to home page
   - if no authUser and isCheckingAuth is true, show a loading indicator from lucide-react
