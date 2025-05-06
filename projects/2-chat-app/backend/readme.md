# cloudinary

## config cloudinary

1. create an account on cloudinary
2. copy cloudinary name, key and secret from cloudinary and store them in .env file
3. create a cloudinary config file in lib folder, to config cloudinary instance

## upload file to cloudinary

1. use cloudinary to upload images to cloudinary，it will return the file url and public_ic,;
2. store the file url and public_id in the database;

## delete file in cloudinary

1. if you want to delete the file, use the Cloudinary api and pass the public_id as the param;
