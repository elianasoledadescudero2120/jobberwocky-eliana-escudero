import config from '../../config.js';
import { allEmpty, isEmpty, orderByStringValue } from '../../common/helpers/data-helpers.js';
import { filterSubscription, filterSubscriptionForJob, retrieveSubscriptions, saveSubscriptions } from './helpers.js';

const { errorMessages } = config;

export const getAllSubscriptions = async ({ query: filters = '' }) => {
  
  const subscriptions = await retrieveSubscriptions();
  const filteredSubscriptions = subscriptions.filter(sub => filterSubscription(sub, filters));
  return { data: orderByStringValue(filteredSubscriptions, 'email')};
}

export const getAllSubscriptionsMatchingJob = async (jobData) => {
  const subscriptions = await retrieveSubscriptions();
  return { data: subscriptions.filter(sub => filterSubscriptionForJob(sub, jobData))};
}

export const findSubscription = async ({ query: filters = {} }) => {
  if(allEmpty(filters, ['name', 'email', 'country', 'skills'])) {
    throw { message: errorMessages.filterSubscriptionValueMissing};
  }

  const subscriptions = await retrieveSubscriptions();
  const orderedSubscriptions = orderByStringValue(subscriptions, 'email');
  const subscription = orderedSubscriptions.find(sub => filterSubscription(sub, filters)) || {};
  return { data: subscription};
}

export const createSusbcription = async ({ body }) => {
  const { email, name = '', country = '', skills = '', salary_min = 0} = body;
  const subscriptions = await retrieveSubscriptions();
  
  if(subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase())) {
    throw { message: errorMessages.repeatedSubscription};
  }

  await saveSubscriptions([...subscriptions, { email, name, country, skills, salary_min}]);

  return { data: body };
}

export const updateSubscription = async ({ body }) => {
  const { email, name, salary_min : salaryMin, country, skills } = body;
  const subscriptions = await retrieveSubscriptions();
  
  let sub = subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if(!sub) sub = { email };

  const updatedSub = {
    ...sub,
    ...(!isEmpty(name) && {name}),
    ...(!isEmpty(salaryMin) && {salary_min : salaryMin}),
    ...(!isEmpty(country) && {country}),
    ...(!isEmpty(skills) && {skills})
  } 

  const newSusbcriptions = [...subscriptions.filter(sub => sub.email.toLowerCase() !== email.toLowerCase()), updatedSub];
  await saveSubscriptions(newSusbcriptions);

  return { data: updatedSub };
}

export const deleteSubscription = async ({body: { email }}) => {
  const subscriptions = await retrieveSubscriptions();
  
  const sub = subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if(!sub) throw { message: errorMessages.missingSubscription};

  const newSubscriptions = subscriptions.filter(sub => sub.email.toLowerCase() !== email.toLowerCase());
  await saveSubscriptions(newSubscriptions);

  return { data: sub };
}

export const deleteAllSubscriptions = async () => {
  await saveSubscriptions([]);
  return { data: [] };
}

