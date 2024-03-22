import config from '../config.js';

const getExternalJobs = async (filters = '') => {
  const { EXTERNAL_JOBS_SOURCE } = process.env;
  let url = EXTERNAL_JOBS_SOURCE ? new URL(EXTERNAL_JOBS_SOURCE) : new URL(config.externalJobsSource);
  url.search = new URLSearchParams(filters)

  const jobs = await fetch(url)
  .then(data => {
    return data.json();
  })
  .then(data => {
    return data.map(([ name, salary, country, skills = []]) => ({ name, salary, country, skills }));
  })
  .catch(() => {
    console.log('-- ERROR --', config.errorMessages.externalServerError);
    return null;
  });

  return jobs;
}

export default getExternalJobs;