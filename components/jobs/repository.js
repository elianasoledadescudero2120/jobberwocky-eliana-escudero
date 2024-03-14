import config from '../../config.js';
import getExternalJobs from '../../services/external-jobs.js';
import sendEmails from '../../services/send-emails.js';
import { allEmpty, isEmpty } from '../../common/helpers/data-helpers.js';
import { filterJob, joinJobs, orderJobs, retrieveJobs, saveJobs } from './helpers.js';
import { getAllSubscriptionsMatchingJob } from '../subscriptions/repository.js';

const { errorMessages } = config;

export const getAllJobs = async ({ query: filters = {} }) => {
  let external = [];
  let local = [];

  if(isEmpty(filters.source) || filters.source === 'external'){
    external = await getExternalJobs(filters);
  }

  if(isEmpty(filters.source) || filters.source === 'local'){
    const jobs = await retrieveJobs();
    local = jobs.filter(job => filterJob(job, filters));
  }

  const all = joinJobs(local, external);
  return { data: orderJobs(all, filters) } ;
}

export const findJob = async ({ query: filters = {} }) => {
  if(allEmpty(filters, ['name', 'salary_min', 'salary_max', 'country', 'skills', 'order_by', 'source', 'order_direction'])) {
    throw { message: errorMessages.filterJobValuesMissing};
  }

  const allFilteredJobs = await getAllJobs({ query: filters });
  return { data: allFilteredJobs.data[0] || {} };
}

export const createJob = async ({ body }) => {
  const jobs = await retrieveJobs();

  if(jobs.find(job => job.name.toLowerCase() === body.name.toLowerCase())) {
    throw { message: errorMessages.repeatedJob};
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
      throw { message: errorMessages.updateJobValuesMissing};
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
  if(!job) throw { message: errorMessages.missingJob};

  const newJobs = jobs.filter(job => job.name.toLowerCase() !== name.toLowerCase());
  await saveJobs(newJobs);

  return { data: job };
}

export const deleteAllJobs = async () => {
  await saveJobs([]);
  return { data: [] };
}

