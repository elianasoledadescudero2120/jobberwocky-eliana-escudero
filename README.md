# Jobberwocky API - Eliana Soledad Escudero

This project was created using Node .js under the Express .js framework.

Additionally, the following libraries were used:

- **ajv JSON schema validator**: to ensure data validation.
- **json-2-csv**: to convert json to csv format, and viceversa.
- **dotenv**: to load environment variables from a .env file into process.env
- **nodemon**: automatically restars the application when file changes in the directory are detected.

## Instalation and setup

Please use node v18.0 or higher

- `git clone https://github.com/elianasoledadescudero2120/jobberwocky-eliana-escudero.git`
- `npm install`

Create a file .env in root directory to store basic configuration (ask admin about suggested content).

- `npm run server`

Now, you can access [http://localhost:3002/job/all](http://localhost:3002/job/all) (or any other PORT you may have configured in your .env file) to view the list of all available jobs.

## Description

This API provides two endpoints: jobs and subscriptions.

# JOBS
