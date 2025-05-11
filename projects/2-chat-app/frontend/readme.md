# Chat App project buiding steps

## setup

1. install React Router, axios, and lucide-react, react-hot-toast, zustand, socket.io-client,
2. install and configure TailwindCSS V3;
3. install and configure DaisyUI
   don't forget to add daisy ui to the tailwind.config.js
4. create a basic structure of the project:

   - src
     - components
     - pages: create a set of pages here
     - store
     - utils

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

## Signup and Login page

1. create state to store form data
2. create validate function and submit function
3. create UI for the signing in
4. create a reisable component for the right side
5. configure Toast
6. implement the validation logic
7. implement the submiting logic with zustand based on the result of validation
   create login function in useAuthStore
   create login page
   create UI and function
   create logout function in store
   create navnar, then implememt logout functionality
   create login page, the same state as signup

## Profile page

1. read file from local environment;
2. use the FileReader api which provide by Browser;
3. transform the image to string base64 format
   this is suitable for small image, and it can simplify the operation of backend;
   base 64 will increase the size compare to original image, and the default limitation of Express is 100KB, so we need to expand the limit of image size to 5MB in the backend;
4. expand the limit of image size to 5MB in the backend
5. update the Cloudinary configuration:
   in the previously, we use the old version of Cloudinary, now we use the new version, so we can upload file to specific folder;

## Settings page

1. create a theme store to manage the theme state
2. create a constant files to store the all the themes from Daisy UI
3. use the theme store to apply the theme state in the App.jsx file
4. create a settings page
   iterate the themes and create a button for each theme;
   using a click event handler to change the theme setter function from the theme store;
