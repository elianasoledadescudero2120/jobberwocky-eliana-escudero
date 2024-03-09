const getExternalJobs = async (filters = '') => {
  let url = new URL(process.env.EXTERNAL_JOBS_SOURCE)
  url.search = new URLSearchParams(filters)

  const jobs = await fetch(url)
  .then(data => {
    return data.json();
  })
  .then(data => {
    return data.map(job => ({
      name: job[0],
      salary: job[1],
      country: job[2],
      skills: job[3] || [],
    }));
  })
  .catch(err => {
    console.log('-- ERROR --', err.message);
    return {};
  });

  return jobs;
}

export default getExternalJobs;