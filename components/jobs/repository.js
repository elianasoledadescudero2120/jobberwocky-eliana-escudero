import config from '../../config.js';
import getExternalJobs from '../../services/external-jobs.js';
import sendEmails from '../../services/send-emails.js';
import { allEmpty, filterBy, isEmpty, parseToWorkWith } from '../../common/helpers/data-helpers.js';
import { filterJob, joinJobs, orderJobs, retrieveJobs, saveJobs } from './helpers.js';
import { getAllSubscriptionsMatchingJob } from '../subscriptions/repository.js';

const { errorMessages, infoMessages } = config;

export const getAllJobs = async ({ query: filters = {} }) => {
  const { source } = filters;
  let response = {};
  let external = [];
  let local = [];
  
  if(isEmpty(source) || source === 'external'){
    external = await getExternalJobs(filters);
    if(external === null ) {
      response.code = 206;
      response.extra= infoMessages.externalJobsMissing;
      external = [];
    }
    //Filter by skills -- Not included in provided service
    external = external.filter(externalJob => filterBy('includesAll', externalJob.skills, filters.skills));
  }

  if(isEmpty(source) || source === 'local'){
    const jobs = await retrieveJobs();
    local = jobs.filter(job => filterJob(job, filters));
  }
  
  response.data = orderJobs(joinJobs(local, external), filters);
  return response;
}

export const findJob = async ({ query: filters = {} }) => {
  if(allEmpty(filters, ['name', 'salary_min', 'salary_max', 'country', 'skills', 'order_by', 'source', 'order_direction'])) {
    throw { message: errorMessages.filterJobValuesMissing, code: 400 };
  }

  const allFilteredJobs = await getAllJobs({ query: filters });
  return { data: allFilteredJobs.data[0] || {} };
}

export const createJob = async ({ body }) => {
  const jobs = await retrieveJobs();

  if(jobs.find(job => job.name.toLowerCase() === body.name.toLowerCase())) {
    throw { message: errorMessages.repeatedJob, code: 400 };
  }
 
  await saveJobs([...jobs, body]);

  const subscriptions = await getAllSubscriptionsMatchingJob(body);
  const emails = subscriptions.data.map(({email}) => email);
  sendEmails(emails);

  return { data: body };
}

export const updateJob = async ({ body }) => {
  const { name, salary, country, skills } = body;
  const jobs = await retrieveJobs();
  
  let job = jobs.find(job => job.name.toLowerCase() === name.toLowerCase());
  if(!job) {
    if(isEmpty(skills) || isEmpty(country) || isEmpty(salary))
    {
      throw { message: errorMessages.updateJobValuesMissing, code: 400 };
    }
    else {
      job = { name };
    }
  }

  const updatedJob = {
    ...job, 
    ...(!isEmpty(salary) && {salary}),
    ...(!isEmpty(country) && {country}),
    ...(!isEmpty(skills) && {skills})
  } 

  const newJobs = [...jobs.filter(job => job.name.toLowerCase() !== name.toLowerCase()), updatedJob];
  await saveJobs(newJobs);

  return { data: updatedJob };
}

export const deleteJob = async ({body: { name }}) => {
  const jobs = await retrieveJobs();
  
  const job = jobs.find(job => job.name.toLowerCase() === name.toLowerCase());
  if(!job) throw { message: errorMessages.missingJob, code: 400 };

  const newJobs = jobs.filter(job => job.name.toLowerCase() !== name.toLowerCase());
  await saveJobs(newJobs);

  return { data: job };
}

export const deleteAllJobs = async () => {
  await saveJobs([]);
  return { data: [] };
}

