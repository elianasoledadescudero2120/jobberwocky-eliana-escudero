import config from '../../config.js';
import converter from 'json-2-csv';
import { JobSchema, JobsSchema } from './schema.js';
import { isEmpty, orderByIntegerValue, orderByStringValue, parseToWorkWith ,parseToSave, filterObject } from "../../common/helpers/data-helpers.js";
import { isValidData } from '../../common/middlewares/SchemaValidation.js';;
import { readFile, writeFile } from '../../common/helpers/file-helpers.js';

const { errorMessages, storagePaths } = config;

export const retrieveJobs = async () => {
    const data = await readFile(storagePaths.jobs)
    .then(data => !isEmpty(data) ? converter.csv2json(data) : [])
    .catch(err => {
      throw {...err, message: errorMessages.readJobs, code: 500};
    })
  
    if(!isValidData(data, JobsSchema)) {
      throw { message: errorMessages.corruptedData, code: 500 };
    }
  
    return parseToWorkWith(data);
}
  
export const saveJobs = async (jobs) => {
    const orderedJobs = orderByStringValue(jobs, 'name');
    
    const csv = await converter.json2csv(parseToSave(orderedJobs));
    await writeFile(storagePaths.jobs, csv)
    .catch(err => {
      throw {...err, message: errorMessages.saveJob, code: 500 };
    });
}

export const filterJob = (job, filters) => filterObject(JobSchema, job, filters);

export const orderJobs = (jobs, { order_by, order_direction = 'asc' }) => {
    if(isEmpty(order_by) || order_by === 'name') return orderByStringValue(jobs, 'name', order_direction);
    if(order_by === 'salary') return orderByIntegerValue(jobs, 'salary', order_direction);
    if(order_by === 'country') return orderByStringValue(jobs, 'country', order_direction);
}

export const joinJobs = (local, external) => {
    const names = Object.values(local).map(job => job.name);
    return [
        ...external.filter(job => !names.includes(job.name)).map(job => ({...job, source: 'external'})),
        ...local.map(job => {
            const externalRelated = external.find(item => item.name.toLowerCase() === job.name.toLowerCase());
            return({
                ...job, 
                source: 'local',
                ...(externalRelated && {
                    externalRelated: {
                        salary: externalRelated.salary,
                        country: externalRelated.country,
                        skills: externalRelated.skills,
                    }
                })
            })
        }),
    ];
}