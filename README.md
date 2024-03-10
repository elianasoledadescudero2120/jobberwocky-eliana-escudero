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
- `cd jobberwocky-eliana-escudero`
- `npm install`

Create a file .env in root directory to store basic configuration (ask admin about suggested content).

- `npm run server`

Now, you can access [http://localhost:3002/job/all](http://localhost:3002/job/all) (or any other PORT you may have configured in your .env file) to view the list of all available jobs.

**IMPORTANT:**

Make sure you have runing in your localhost the JobberwockyExteneralJobs API.
It should be accessible through: [http://localhost:8080/jobs](http://localhost:8080/jobs).
The following repository offers more information on this: [jobberwocky-extra-source](https://github.com/avatureta/jobberwocky-extra-source).

## Description

This API provides two endpoints: [JOBS](#1-jobs) and [SUBSCRIPTIONS](#2-subscriptions).

All the API responses are JSON-formatted.

All data is stored inside the application using .csv files. The path of the files can be modified through config.js

### 1 JOBS

A job is made up of the following all required fields:

- **name** (string)
- **salary** (integer)
- **country** (string)
- **skills** (array of strings)

Our API exposes the following methods to work with jobs:

#### A. ALL (GET)

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

**Url**: [http://localhost:3002/job/all?name=jr java developer](http://localhost:3002/job/all?name=jr%20java%20developer)

**Local jobs**:

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

**Response**:

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

**Url**: [http://localhost:3002/job/all?name=java&origin=external](http://localhost:3002/job/all?name=java&origin=external)

**Response**:

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

#### B. FIND (GET)

Accessible through [http://localhost:3002/job/find](http://localhost:3002/job/find)

Accepts the same query parameters as ALL method (**requires at least one of them**). Works exactly like it, but returns the first job of the resulting set.

#### C. CREATE (POST)

Accessible through [http://localhost:3002/job/create](http://localhost:3002/job/create)

Expects the body to contain (all required fields):

- name
- salary
- country
- skills ------------ (value: string with skills comma separated)

After creating the job successfully, **it looks up for possible subscriptions matching the job. Retrieves and console the set of emails of that subscriptions**.
_Email sending was not implemented, but a file is included for that purpose._

If creation is successful it returns the job created.

#### D. UPDATE (POST)

Accessible through [http://localhost:3002/job/update](http://localhost:3002/job/update)

Expects the body to contain (only name is required):

- name
- salary
- country
- skills ------------ (value: string with skills comma separated)

If a job with the name entered is not found, a new one is created. This action requires the user to enter the country, skills and salary.

If update is successful it returns the job updated.

#### E. DELETE (POST)

Accessible through [http://localhost:3002/job/delete](http://localhost:3002/job/delete)

Expects the body to contain (all required):

- name

Deletes the job stored in application with name equal to name parameter.

If deletion is successful it returns the job deleted.

#### F. DELETEALL (POST)

Accessible through [http://localhost:3002/job/deleteAll](http://localhost:3002/job/deleteAll)

Deletes all jobs stored in the application.

If deletion is successful it returns an empty set.

---

### 2 SUBSCRIPTIONS

A subscription is made up of the following required fields (only email is required):

- **email** (string)
- **name** (string)
- **salary_min** (integer)
- **country** (string)
- **skills** (array of strings)

Our API exposes the following methods to work with subscriptions:

#### A. ALL (GET)

Accessible through [http://localhost:3002/subscription/all](http://localhost:3002/subscription/all)

Accepts the following query parameters:

- email
- name
- salary ------------ (filter logic: subscription.salary_min <= salary)
- country
- skills ------------ (value: string with skills comma separated)

Offers a list of subscriptions, filtered by query parameters. The email acts as a key and its unique.

----- **EXAMPLE** -----

**Url**: [http://localhost:3002/subscription/all](http://localhost:3002/subscription/all)

**Response**:

```json
[
  {
    "email": "federico@gmail.com",
    "name": "Developer",
    "salary_min": 6000,
    "country": "Argentina",
    "skills": ["node"]
  }
]
```

#### B. FIND (GET)

Accessible through [http://localhost:3002/subscription/find](http://localhost:3002/subscription/find)

Accepts the same query parameters as ALL method (**requires at least one of them**). Works exactly like it, but returns the first subscription of the resulting set.

#### C. CREATE (POST)

Accessible through [http://localhost:3002/subscription/create](http://localhost:3002/subscription/create)

Expects the body to contain (only email is required):

- email
- name
- salary_min
- country
- skills ------------ (value: string with skills comma separated)

If creation is successful it returns the subscription created.

#### D. UPDATE (POST)

Accessible through [http://localhost:3002/subscription/update](http://localhost:3002/subscription/update)

Expects the body to contain (only email is required):

- email
- name
- salary_min
- country
- skills ------------ (value: string with skills comma separated)

If a subscription with the email entered is not found, a new one is created.

If update is successful it returns the subscription updated.

#### E. DELETE (POST)

Accessible through [http://localhost:3002/subscription/delete](http://localhost:3002/subscription/delete)

Expects the body to contain (all required):

- email

Deletes the subscription stored in application with email equal to email parameter.

If deletion is successful it returns the subscription deleted.

#### F. DELETEALL (POST)

Accessible through [http://localhost:3002/subscription/deleteAll](http://localhost:3002/subscription/deleteAll)

Deletes all subscriptions stored in the application.

If deletion is successful it returns an empty set.
