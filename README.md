# Task-Project

Setps to Setup Project.

Prerequisite
1. Node (version 16)
2. Mysql (version 8)

Supported File consist poatman collection which can be used to test the apis and screen recording of functionality and er diagram.

Steps to setup Server.
make sure you are in Task-Project directory

Step 1:
Create .env file take reference from .env.example file

Step 2 :
run command "npm insatll" to install all the dependency packages.

Step 3:
create database user and database with you are using inside .env file and make sure you are giving all previlages to users.

Step 4:
run command " npm run migration " to create all table in database.

Step 5:
run command " node index.js" to run the server.

Super admin will be created with email and password given in .env file

Server start you can use now.

Thank you