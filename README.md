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

**IMPORTANT:**

Make sure you have runing in your localhost the JobberwockyExteneralJobs API.
It should be accessible through: [http://localhost:8080/jobs](http://localhost:8080/jobs).
The following repository offers more information on this: [jobberwocky-extra-source](https://github.com/avatureta/jobberwocky-extra-source).

## Description

This API provides two endpoints: jobs and subscriptions.

All the API responses are JSON-formatted.

All data is stored inside the application using .csv files. The path of the files can be modified through config.js

### 1. JOBS

A job is made up of the following all required fields:

- **name** (string)
- **salary** (integer)
- **country** (string)
- **skills** (array of strings)

Our API exposes the following methods to work with jobs:

#### ALL (GET)

Accessible through [http://localhost:3002/job/all](http://localhost:3002/job/all)

Accepts the following query parameters:

- name
- salary_min
- salary_max
- country
- skills ------------ (value: string with skills comma separated)
- order_by ---------- (possible values: [name, salary, country, skills])
- order_direction --- (possible values: 'ASC', 'DESC')
- origin ------------ (possible values: [local, external])

Offers a list of jobs, filtered by query parameters. The name acts as a key and its unique.

In addition our job-searching service **consumes data from an external job opportunity source** accessible through: [jobberwocky-extra-source](http://localhost:8080/jobs). _(The port and url of external service may vary depending on configuration settings)_

----- **EXAMPLES** -----

URL: [http://localhost:3005/job/all?name=jr java developer](http://localhost:3005/job/all?name=jr%20java%20developer)

LOCAL JOBS:

```json
[
  {
    "name": "Jr Java Developer",
    "salary": 6000,
    "country": "Brasil",
    "skills": ["java", "android"]
  },
  {
    "name": "Node Senior Developer",
    "salary": 15000,
    "country": "Spain",
    "skills": ["node"]
  }
]
```

RESPONSE:

```json
[
  {
    "name": "Jr Java Developer",
    "salary": 6000,
    "country": "Brasil",
    "skills": ["java", "android"],
    "source": "local",
    "externalRelated": {
      "salary": 24000,
      "country": "Argentina",
      "skills": ["Java", "OOP"]
    }
  }
]
```

---

URL: [http://localhost:3005/job/all?name=java&origin=external](http://localhost:3005/job/all?name=java&origin=external)

RESPONSE:

```json
[
  {
    "name": "Jr PHP Developer",
    "salary": 24000,
    "country": "Spain",
    "skills": ["PHP", "OOP"],
    "source": "external"
  },
  {
    "name": "SSr PHP Developer",
    "salary": 34000,
    "country": "Spain",
    "skills": ["PHP", "OOP", "Design Patterns"],
    "source": "external"
  }
]
```
