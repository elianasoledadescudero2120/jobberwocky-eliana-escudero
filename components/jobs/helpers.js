import config from '../../config.js';
import converter from 'json-2-csv';
import { JobsSchema } from './schema.js';
import { isEmpty, orderByIntegerValue, orderByStringValue, parseToWorkWith ,parseToSave } from "../../common/helpers/data-helpers.js";
import { isValidData } from '../../common/middlewares/SchemaValidation.js';;
import { readFile, writeFile } from '../../common/helpers/file-helpers.js';

const { errorMessages, storagePaths } = config;

export const retrieveJobs = async () => {
    const data = await readFile(storagePaths.jobs)
    .then(data => !isEmpty(data) ? converter.csv2json(data) : [])
    .catch(err => {
      throw {...err, message: errorMessages.readJobs};
    })
  
    if(!isValidData(data, JobsSchema)) {
      throw { message: errorMessages.corruptedData};
    }
  
    return parseToWorkWith(data);
}
  
export const saveJobs = async (jobs) => {
    const orderedJobs = orderByStringValue(jobs, 'name');
    
    const csv = await converter.json2csv(parseToSave(orderedJobs));
    await writeFile(storagePaths.jobs, csv)
    .catch(err => {
      throw {...err, message: errorMessages.saveJob};
    });
}

  
export const filterJob = (job, reqFilters) => {
    const filters = parseToWorkWith(reqFilters);
    const filterSkills = filters.skills.map(skill => skill.toLowerCase())
    const jobSkills = job.skills.map(skill => skill.toLowerCase());

    return (filters.name === undefined || job.name.toLowerCase().includes(filters.name.toLowerCase()))
        && (filters.salary_min === undefined || job.salary >= filters.salary_min)
        && (filters.salary_max === undefined || job.salary <= filters.salary_max)
        && (filters.country === undefined || job.country.toLowerCase() === filters.country.toLowerCase())
        && (filters.skills === undefined || filterSkills.every(s => jobSkills.includes(s)))
}

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