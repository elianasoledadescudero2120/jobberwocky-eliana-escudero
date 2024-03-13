import config from '../../config.js';
const { errorMessages } = config;

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

export const expectError = async (functionToCall, errorMessage, parameters = null) => {
    const errorCatch = jest.fn();
    await functionToCall(parameters).catch(errorCatch);
    expect(errorCatch).toHaveBeenCalledWith({message: errorMessages[errorMessage]}); 
}

export const expectNotError = async (functionToCall, parameters = null) => {
    const errorCatch = jest.fn();
    await functionToCall(parameters).catch(errorCatch);
    expect(errorCatch).not.toHaveBeenCalled(); 
}