# Hybrid Marketplace
NodeJS BE Application for E-Commerce Marketplace
Author - Gaurav Bansal

## Tech Stack
----
NodeJs, MySQL

## Tested Environment Configuration
----
- Node: v16.15.1+
- MySQL: v8.0.28+
- MySQL Workbench: For DB operations

## Instructions
----
To run the project in local, follow below steps:-
1. **Make sure you have Node and MySQL installed and running**.
2. Open terminal and switch to the cloned repository folder.
3. Run below command to install dependencies-
```bash
npm install
```
4. Open `.env` file and update SQL DB connection parameters like user, password etc (For more details, see **MySQL section** below).
5. Update other variables in `.env` if you want custom settings.
6. Run one of the below commands to run project (`start.js` is the project root): 
```bash
node start.js
```
or
```bash
npm run start
```
7. By default - All required DB tables are created or synced by app itself on start (Verify in MySQL GUI or CLI).
8. Use tool like **Postman** to test application (For more details, see **API Section** below).
9. Basic Server Health-Check API -
```bash
curl --location 'http://localhost:6000/api/v1/health-check/get-status'
```
## API Collection
----
- Refer **Hybrid-Marketplace.postman_collection.json** file added in project root directory.
- Import this in postman. This contains all APIs implemented in project with sample request bodies for reference.
- **Strongly recommended to go through APIs and View Documentation to understand request body, params, headers required.**

Important points:-
- Make sure to add **Authorization** header in seller and buyer APIs for authentication.
- Login/Register APIs will give **Authorization** token.

## MySQL Requirements
----
- **MySQL server is required and should be running before running the project.**
- Prefer to use any MySQL GUI tool, ex- **MySQL Workbench** to easily opearte on DB.
- If don't have, then make sure to create a user with enough admin privileges to read/write/delete on DB schema.
- Create an empty schema with `name = MYSQL_DB_NAME` as mentioned in `.env` file. Or you can update name in .env accordingly.
- Update the MySQL configuration in `.env`.
- Your marketplace application is ready to start.
- No need to create tables. Those will be created automatically when project runs.