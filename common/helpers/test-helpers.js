export const getLocalJob = (index) => ({
    name: `name${index}`,
    country: `country${index}`,
    salary: 100-index,
    skills: [`node${index}`,`java${index}`],
});

export const getExternalJob = (index) => ([
    `name${index}`,
    100-index,
    `country${index}`,
    [`node${index}`,`java${index}`]
]);

export const getSubscription = (index) => ({
    email: `someemail@gmail.com${index}`,
    name: `jobName${index}`,
    country: `jobCountry${index}`,
    salary_min: 1000-index,
    skills: [`node${index}`,`java${index}`],
});