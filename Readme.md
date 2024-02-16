# Inroduction

## Project Name

`SnpaTube`

description: This is a website just like youtube.

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

# Setting up index.js
### after writting connecion method in db file we will use that mehtod in index.js 

> importing the mehtod and using it

 ### connectDB()
 - this method will return promise so we will use .then() and .catch() method

 ```
 connectionDB()
 .then()
 .catch()

 ```
 ### connectDB.then()
  > we will write the express app here
  - app.on()

  - app.listen()
  
  - app.get() 

### connectDB.catch()
 > consoling the error

# app.js file

### we are using

- cookieParser package

  - using cookieparse method
    > cookieParse()

- cors package to solve cors origin

  - ti takes an object as argument
    - origin which shows what is the origin allowed here
    - credentials

- applying json limit

  > express.json({limit:""})

- Reading form the encoded url

  > express.urlencoded({extended: true, limit:""})

- defining the static file
  > express.static(file name/path)


# UTILS Folder

### making custom classed for 

- asyncHandler
  > this is a wrapper function which wrap any functio into async await format
- ApiError
  > this is the custom error calass which extends the node error class,

  > it have construcctor which overrides the error method
- ApiResponse
  > this is the custom class for api response , this also use the constructor to override the metohds.