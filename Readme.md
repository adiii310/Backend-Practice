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

 - EXPORT THE   FUCNTION

- imoport it inside the index.js and call it


