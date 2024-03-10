import config from "../../config.js";
import converter from 'json-2-csv';
import { SubscriptionsSchema } from './schema.js';
import { isEmpty, orderByStringValue, parseToSave, parseToWorkWith } from '../../common/helpers/data-helpers.js';
import { isValidData } from '../../common/middlewares/SchemaValidation.js';
import { readFile, writeFile } from '../../common/helpers/file-helpers.js';

const { errorMessages, storagePaths } = config;

export const retrieveSubscriptions = async () => {
    const data = await readFile(storagePaths.subscriptions)
    .then(data => !isEmpty(data) ? converter.csv2json(data) : [])
    .catch(err => {
      throw {...err, message: errorMessages.readSubscriptions};
    })
  
    if(!isValidData(data, SubscriptionsSchema)) {
      throw { message: errorMessages.corruptedData};
    }
  
    return parseToWorkWith(data);
}
  
export const saveSubscriptions = async (subscriptions) => {
    const orderedSubscriptions = orderByStringValue(subscriptions, 'email');
    
    const csv = await converter.json2csv(parseToSave(orderedSubscriptions));
    await writeFile(storagePaths.subscriptions, csv)
    .catch(err => {
      throw {...err, message: errorMessages.saveSubscription};
    });
}

export const filterSubscription = (sub, reqFilters) => {
    const filters = parseToWorkWith(reqFilters);
    const filterSkills = filters.skills.map(skill => skill.toLowerCase())
    const subSkills = sub.skills.map(skill => skill.toLowerCase());

    return (filters.email === undefined || sub.email.toLowerCase().includes(filters.email.toLowerCase()))
        && (filters.name === undefined || sub.name.toLowerCase().includes(filters.name.toLowerCase()))
        && (filters.country === undefined || sub.country.toLowerCase() === filters.country.toLowerCase())
        && (filters.skills === undefined || filterSkills.every(s => subSkills.includes(s)))
        && (filters.salary === undefined || sub.salary_min <= filters.salary)
}

export const filterSubscriptionForJob = (sub, job) => {
    const jobData = parseToWorkWith(job);
    const jobSkills = jobData.skills.map(skill => skill.toLowerCase())
    const subSkills = sub.skills.map(skill => skill.toLowerCase());
    
    return (isEmpty(sub.name) || isEmpty(jobData.name) || jobData.name.toLowerCase().includes(sub.name.toLowerCase()))
        && (isEmpty(sub.country) || isEmpty(jobData.country) || jobData.country.toLowerCase() === sub.country.toLowerCase())
        && (isEmpty(subSkills) || isEmpty(jobSkills) || subSkills.some(s => jobSkills.includes(s)))
        && (isEmpty(sub.salary_min) || isEmpty(jobData.salary) || sub.salary_min <= jobData.salary)
}