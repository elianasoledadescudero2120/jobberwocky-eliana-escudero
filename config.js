const contactMessage = 'Please contact for more information.';

const config = {
  errorMessages: {
    corruptedData: `Corrupted data encountered in the server. ${contactMessage}`,
    dataFormatError: `Error while processing data format. ${contactMessage}`,
    externalServerError: 'Error while connecting to the external server',
    filterJobValuesMissing: 'Please provide at least one filter for the job. It could be name, salary, country and/or skills',
    filterSubscriptionValuesMissing: 'Please provide at least one filter for the subscription. It could be emaiil, name, country and/or skills',
    missingJob: 'There isnt a job with the name provided. Please try with another one.',
    missingSubscription: 'There isnt a subscription with the email provided',
    readJobs: `Error while reading local job offers. ${contactMessage}`,
    readSubscriptions: `Error while reading local subscriptions. ${contactMessage}`,
    repeatedJob: 'A job is already stored with the same name. Please provide another one.',
    repeatedSubscription: 'A subscription is already stored with the same email. Please provide another one.',
    saveJob: 'Error while saving the job. Please try again.',
    saveSubscription: 'Error while saving the subscription. Please try again.',
    schemaNotProvided: `Schema not provided. ${contactMessage}`,
    serverError: 'Server error. Possible invalid route.',
    updateJobValuesMissing: 'There isnt a job with the name provided. To create a new one please provide the salary, country and skills',
  },
  infoMessages: {
    externalJobsMissing: `The external jobs couldn't be retrieved. ${contactMessage}`,
  },
  externalJobsSource: 'http://localhost:8080/jobs',
  port: 3002,
  storagePaths: {
    jobs: 'components/jobs/data.csv',
    subscriptions: 'components/subscriptions/data.csv',
  }
}
export default config;

