import config from "../../config.js";
import converter from 'json-2-csv';
import { SubscriptionSchema, SubscriptionsSchema } from './schema.js';
import { filterObject, isEmpty, orderByStringValue, parseToSave, parseToWorkWith } from '../../common/helpers/data-helpers.js';
import { isValidData } from '../../common/middlewares/SchemaValidation.js';
import { readFile, writeFile } from '../../common/helpers/file-helpers.js';

const { errorMessages, storagePaths } = config;

export const retrieveSubscriptions = async () => {
    const data = await readFile(storagePaths.subscriptions)
    .then(data => !isEmpty(data) ? converter.csv2json(data) : [])
    .catch(err => {
      throw {...err, message: errorMessages.readSubscriptions, code: 500 };
    })
  
    if(!isValidData(data, SubscriptionsSchema)) {
      throw { message: errorMessages.corruptedData, code: 500};
    }
  
    return parseToWorkWith(data);
}
  
export const saveSubscriptions = async (subscriptions) => {
    const orderedSubscriptions = orderByStringValue(subscriptions, 'email');
    
    const csv = await converter.json2csv(parseToSave(orderedSubscriptions));
    await writeFile(storagePaths.subscriptions, csv)
    .catch(err => {
      throw {...err, message: errorMessages.saveSubscription, code: 500 };
    });
}

export const filterSubscription = (sub, filters) => filterObject(SubscriptionSchema, sub, filters);

export const filterSubscriptionForJob = (sub, job) => {
    const jobData = parseToWorkWith(job);
    const jobSkills = jobData.skills.map(skill => skill.toLowerCase())
    const subSkills = sub.skills.map(skill => skill.toLowerCase());
    
    return (isEmpty(sub.name) || isEmpty(jobData.name) || jobData.name.toLowerCase().includes(sub.name.toLowerCase()))
        && (isEmpty(sub.country) || isEmpty(jobData.country) || jobData.country.toLowerCase() === sub.country.toLowerCase())
        && (isEmpty(subSkills) || isEmpty(jobSkills) || subSkills.some(s => jobSkills.includes(s)))
        && (isEmpty(sub.salary_min) || isEmpty(jobData.salary) || sub.salary_min <= jobData.salary)
}