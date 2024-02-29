# Inroduction

## Project Name

`SnpaTube`

description: This is a website just like youtube.
# Table of Contents

1. [Introduction](#introduction)
   - [Project Name](#project-name)
   - [Description](#description)
2. [Setting Up Files and Folders](#setting-up-files-and-folders)
   - [Public and Src Folders](#public-and-src-folders)
   - [Initializing NPM](#initializing-npm)
   - [Creating .env and .gitignore Files](#creating-env-and-gitignore-files)
3. [Connecting to MongoDB Atlas](#connecting-to-mongodb-atlas)
   - [Importing .env File](#importing-env-file)
   - [Changing package.json](#changing-packagejson)
   - [Setting package.json for .env File](#setting-packagejson-for-env-file)
   - [Creating ConnectionDB Function](#creating-connectiondb-function)
   - [Inside the Try-Catch Block](#inside-the-try-catch-block)
   - [Exporting the Function](#exporting-the-function)
   - [Importing and Calling ConnectionDB](#importing-and-calling-connectiondb)
4. [Server Entry Point Documentation](#server-entry-point-documentation)
   - [Dependencies](#dependencies)
   - [Environment Configuration](#environment-configuration)
   - [Database Connection](#database-connection)
   - [Server Configuration](#server-configuration)
   - [Routing](#routing)
   - [Usage](#usage)
5. [Express Application Setup Documentation](#express-application-setup-documentation)
   - [Dependencies](#dependencies)
   - [Application Initialization](#application-initialization)
   - [Middleware Configuration](#middleware-configuration)
   - [Environment Variables](#environment-variables)
   - [Exporting the Application](#exporting-the-application)
   - [Usage](#usage)
6. [Utils Folder](#utils-folder)
   - [Custom Classes](#custom-classes)
   - [AsyncHandler](#asynchandler)
   - [ApiError](#apierror)
   - [ApiResponse](#apiresponse)
7. [User Model Documentation](#user-model-documentation)
   - [Schema Definition](#schema-definition)
   - [Middleware](#middleware)
   - [Methods](#methods)
   - [Environment Variables](#environment-variables)
   - [Exporting the Model](#exporting-the-model)
   - [Usage](#usage)
8. [Video Model Documentation](#video-model-documentation)
   - [Schema Definition](#schema-definition)
   - [Plugins](#plugins)
   - [Exporting the Model](#exporting-the-model)
   - [Usage](#usage)


# setting up files and folders

### public and src are the two main folders which will contains all the folders

### initializing npm

> npm inti

### making .env file & .gitignore file

# Connecting to the MongoDb atlas

## first import .env file to load

dotenv.configure({path: './env'})

> changing packagae.json

- this is the experimaental featrue

## setting package.json for .evn file

dev :"ndoemon -r dotenv/config --experimental-json-modules src/index.js

# inside src/db

### make a function ConnectionDB()

> connectionDB wiill initialize the connection with mongodb atlsas

- this is an async funtion.

- the code is wrapped inside the try cattch block.

### inside the try catch block

- maek connection

  > await mongooose.connect('${MONGODBURL}/${DatabseName})

- EXPORT THE FUCNTION

- imoport it inside the index.js and call it

# Server Entry Point Documentation

This document provides an overview of the server entry point, which is responsible for configuring and starting the Express application server.

## Dependencies

The entry point uses the following dependencies:

- `dotenv`: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- `connectDB`: A function that connects to the MongoDB database.
- `app`: The configured Express application instance.

## Environment Configuration

The `dotenv` package is used to load environment variables from a `.env` file located in the `./env` directory. This allows sensitive information, such as database credentials and server configuration, to be stored securely and separated from the codebase.


## Database Connection

The `connectDB` function is called to establish a connection to the MongoDB database. This function should return a promise that resolves when the connection is successful.


## Server Configuration

The server is configured to listen on the port specified by the `PORT` environment variable. An error event listener is added to the `app` instance to log any errors that occur while the server is running.


## Routing

A simple root route is defined to respond with a message indicating the server's port.


## Usage

To start the server, run the entry point file. This will initialize the environment variables, connect to the database, and start the Express application server.


# Express Application Setup Documentation

This document provides an overview of the Express application setup, which is used to configure the server for handling HTTP requests in the application.

## Dependencies

The application uses the following dependencies:

- `express`: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- `cookie-parser`: A middleware to parse Cookie header and populate `req.cookies` with an object keyed by the cookie names.
- `cors`: A package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Application Initialization

The Express application is initialized with the following code:


## Middleware Configuration

The application uses several middleware functions for various purposes:

- `cors`: Configured with the `origin` option set to `process.env.CORS_ORIGIN` and `credentials` set to `true`. This allows the server to accept cross-origin requests and handle cookies.
- `express.json`: Configured with a limit of "10kb" to parse incoming requests with JSON payloads.
- `express.urlencoded`: Configured with `extended: true` and a limit of "10kb" to parse incoming requests with URL-encoded payloads.
- `express.static`: Serves static files from the "public" directory.
- `cookieParser`: Parses Cookie header and populates `req.cookies` with an object keyed by the cookie names.

## Environment Variables

The application uses the following environment variables:

- `process.env.port`: The port on which the server will listen for incoming requests.
- `process.env.CORS_ORIGIN`: The origin that is allowed to make cross-origin requests to the server.

## Exporting the Application

The configured Express application is exported as `app`, which can be used in other parts of the application to set up routes and start the server.

## Usage

To use the exported `app`, you would typically import it into your server entry point file and start the server with the following code:




# UTILS Folder

### making custom classed for 

- asyncHandler
  > this is a wrapper function which wrap any functio into async await format
- ApiError
  > this is the custom error calass which extends the node error class,

  > it have construcctor which overrides the error method
- ApiResponse
  > this is the custom class for api response , this also use the constructor to override the metohds.

# User Model Documentation

This document provides an overview of the `User` model in the application, which is used to manage user data in the MongoDB database. The `User` model is defined using Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment.

## Schema Definition

The `User` schema is defined with the following fields:

- `userName`: A unique, lowercase, trimmed string that represents the user's chosen username.
- `email`: A unique, lowercase, trimmed string that represents the user's email address.
- `fullName`: A string that represents the user's full name.
- `avatar`: A string that represents the URL to the user's avatar image.
- `coverImage`: A string that represents the URL to the user's cover image.
- `password`: A string that represents the user's hashed password.
- `watchHistory`: An array of ObjectIds referencing the `Video` model, representing the videos the user has watched.
- `refreshToken`: A string that represents the user's refresh token for authentication purposes.

The schema also includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the documents.

## Middleware

The `pre('save')` middleware is used to hash the user's password before saving the document to the database. This ensures that the plain-text password is never stored.

## Methods

The `User` model includes several methods for handling authentication and token generation:

- `isPasswordCorrect(password)`: An asynchronous method that compares a given password with the stored hashed password to determine if they match.
- `generateAccessToken()`: A method that generates a JSON Web Token (JWT) for access authentication. The token includes the user's `_id`, `userName`, `email`, and `fullName`. The token's expiration time is set by the `EXPIRY_ACCESS_TOKEN` environment variable.
- `generateRefreshToken()`: A method that generates a JWT for refresh authentication. The token includes the same information as the access token. The token's expiration time is set by the `EXPIRY_REFRESH_TOKEN` environment variable.

## Environment Variables

The `generateAccessToken` and `generateRefreshToken` methods rely on the following environment variables:

- `SECRET_ACCESS_TOKEN`: The secret key used to sign the access token.
- `SECRET_REFRESH_TOKEN`: The secret key used to sign the refresh token.
- `EXPIRY_ACCESS_TOKEN`: The duration for which the access token is valid.
- `EXPIRY_REFRESH_TOKEN`: The duration for which the refresh token is valid.

## Exporting the Model

The `User` model is exported as a Mongoose model, which can be used to create, read, update, and delete documents in the MongoDB database.

## Usage

To use the `User` model, you would typically import it into your application code and use it to interact with the user data. For example, to create a new user, you would instantiate a new `User` object with the required fields and call the `save` method.

# Video Model Documentation

This document provides an overview of the `Video` model in the application, which is used to manage video data in the MongoDB database. The `Video` model is defined using Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment.

## Schema Definition

The `Video` schema is defined with the following fields:

- `videofile`: A string that represents the URL or path to the video file.
- `thumbnail`: A string that represents the URL or path to the video thumbnail image.
- `title`: A string that represents the title of the video.
- `description`: A string that represents the description of the video.
- `isPublished`: A string that indicates whether the video is published or not.
- `duration`: A number that represents the duration of the video in seconds.
- `views`: A number that represents the number of views the video has received, with a default value of  0.
- `owner`: An ObjectId that references the `User` model, representing the user who owns the video.

The schema also includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the documents.

## Plugins

The `mongoose-aggregate-paginate-v2` plugin is used to add pagination capabilities to the `Video` model. This allows for efficient retrieval of paginated results when querying the database.

## Exporting the Model

The `Video` model is exported as a Mongoose model, which can be used to create, read, update, and delete documents in the MongoDB database.

## Usage

To use the `Video` model, you would typically import it into your application code and use it to interact with the video data. For example, to create a new video, you would instantiate a new `Video` object with the required fields and call the `save` method.

# File Upload to Cloudinary with Multer

## Description

This project demonstrates how to upload files to Cloudinary using the Multer middleware in a Node.js application. It includes a setup for Cloudinary configuration and a Multer storage engine to handle file uploads.

## Dependencies

- `cloudinary`: A cloud-based service that offers an end-to-end solution for uploading, storing, managing, manipulating, and delivering images and videos.
- `multer`: A middleware for handling `multipart/form-data`, which is primarily used for uploading files.

## Installation

To install the dependencies, run the following command in your terminal:

bash npm install cloudinary multer

## Usage

1. Set the environment variables `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your `.env` file or your environment.
2. Use the `upload` middleware in your Express routes to handle file uploads.
3. Call the `uploadOnCloudinary` function with the local file path to upload the file to Cloudinary.

## Cloudinary Configuration

The Cloudinary configuration is done using the `cloudinary.config` method. You need to provide your Cloudinary `cloud_name`, `api_key`, and `api_secret` as environment variables.

## Multer Configuration

The Multer storage engine is configured to save uploaded files temporarily in the `../public/temp` directory with their original filenames.

## Uploading Files to Cloudinary

The `uploadOnCloudinary` function is an asynchronous function that takes a local file path as an argument. It uploads the file to Cloudinary and returns the response from Cloudinary, which includes the URL of the uploaded file.

## Error Handling

In case of an error during the upload, the local file is deleted using `fs.unlinkSync`, and the function returns `null`.

## Example Usage

To use the `upload` middleware in an Express route, you can do the following:

javascript import express from 'express'; import { upload } from './multerConfig'; import { uploadOnCloudinary } from './cloudinaryConfig';

const app = express();

app.post('/upload', upload.single('file'), async (req, res) => { try { const response = await uploadOnCloudinary(req.file.path); if (response) { res.json({ url: response.url }); } else { res.status(500).send('File upload failed'); } } catch (error) { res.status(500).send('File upload failed'); } });

app.listen(3000, () => { console.log('Server is running on port 3000'); });