# News API Project

Welcome to the News API! This API allows you to access articles, comments, users and topic databases - the full list of available endpoints incl. their descriptions and expected outcomes can be found in the endpoints.json file in the top level of the directory or by following the link below. 

Live version can be accessed here https://newsapp-api-project.onrender.com/api/

##Instructions

- Fork this repository
- Clone your forked repository
- Use the command 'npm install' and install dependencies: Node.js (min version 9.5.1), PostgreSQL(16.0), express (^4.18.2), node-postgres(^0.6.2), pg (^8.11.3) and dotenv(^16.3.1)
- In order to connect to the databases locally, add two .env.<name> files containing PGDATABASE=<database_name> (database names can be found in the setup.sql file)
- then set up the database by running 'npm run setup-dbs' and start seeding by running 'npm run seed'
- to run the tests you'll need to install dev-dependencies jest (^27.5.1) and jest-sorted(^1.0.14) by using 'npm install' again. Make sure to update your package.json file, so that dev dependencies include "jest": "version no.",
    "jest-extended": "version no.",
    "jest-sorted": "version no"
- once these are installed run 'npm test' to trigger the test suite 

