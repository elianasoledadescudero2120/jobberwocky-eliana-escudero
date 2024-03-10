const config = {
  errorMessages: {
    corruptedData: 'Corrupted data! Please verify the storage state.',
    filterJobValuesMissing: 'Please provide at least one filter for the job. It could be name, salary, country and/or skills',
    filterSubscriptionValuesMissing: 'Please provide at least one filter for the subscription. It could be emaiil, name, country and/or skills',
    missingJob: 'There isnt a job with the name provided.',
    missingSubscription: 'There isnt a subscription with the email provided',
    readJobs: 'Error while reading local jobs',
    readSubscriptions: 'Error while reading local subscriptions',
    repeatedJob: 'A job is already stored with the same name. Please provide another one.',
    repeatedSubscription: 'A subscription is already stored with the same email. Please provide another one.',
    saveJob: 'Error while saving the job. Please try again.',
    saveSubscription: 'Error while saving the subscription. Please try again.',
    serverError: 'Server error. Possible invalid route.',
    updateJobValuesMissing: 'There isnt a job with the name provided. To create a new one please provide the salary, country and skills',
  },
  externalJobsSource: 'http://localhost:8080/jobs',
  port: 3002,
  storagePaths: {
    jobs: 'components/jobs/data.csv',
    subscriptions: 'components/subscriptions/data.csv',
  }
}
export default config;

