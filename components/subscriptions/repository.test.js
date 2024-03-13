import * as helpers from "./helpers";
import { createSusbcription, deleteAllSubscriptions, deleteSubscription, findSubscription, getAllSubscriptions, getAllSubscriptionsMatchingJob, updateSubscription } from "./repository";
import { expectError, getSubscription } from "../../common/helpers/test-helpers";

helpers.retrieveSubscriptions = jest.fn().mockReturnValue([
    getSubscription(4), getSubscription(1), getSubscription(2)
]);

helpers.saveSubscriptions = jest.fn().mockReturnValue();

describe('getAllSubscriptions', () => {
    test('It should return all subscriptions stored. They should be ordered by name.', async () => {
        const expected = {
            data: [
                getSubscription(1), getSubscription(2), getSubscription(4)
            ],
        };

        const subs = await getAllSubscriptions({ query: {} });
        expect(subs).toStrictEqual(expected);
    });

    test('It should apply the filters specified in query.', async () => {
        const testFilters = { country: 'jobcountry4'};
        const expected = {
            data: [
                getSubscription(4),
            ],
        };

        const subs = await getAllSubscriptions({ query: testFilters });
        expect(subs).toStrictEqual(expected);

        const testFilters2 = { salary: 998 };
        const expected2 = {
            data: [
                getSubscription(2), getSubscription(4),
            ],
        };

        const subs2 = await getAllSubscriptions({ query: testFilters2 });
        expect(subs2).toStrictEqual(expected2);
    });
  });

  describe('getAllSubscriptionsMatchingJob', () => {
    test('It should return subscriptions that match to the job specified.', async () => {
        const job = { salary: 997, skills: []};
        const expected = {
            data: [
                getSubscription(4),
            ],
        };

        const subs = await getAllSubscriptionsMatchingJob(job);
        expect(subs).toStrictEqual(expected);

        const job2 = { skills: ['java1']};
        const expected2 = {
            data: [
                getSubscription(1),
            ],
        };

        const subs2 = await getAllSubscriptionsMatchingJob(job2);
        expect(subs2).toStrictEqual(expected2);

        const job3 = { name: 'jobName1 jobName4', skills: [] };
        const expected3 = {
            data: [
                getSubscription(4), getSubscription(1),
            ],
        };

        const subs3 = await getAllSubscriptionsMatchingJob(job3);
        expect(subs3).toStrictEqual(expected3);

        const job4 = { country: 'jobCountry2', skills: []};
        const expected4 = {
            data: [
                getSubscription(2),
            ],
        };

        const subs4 = await getAllSubscriptionsMatchingJob(job4);
        expect(subs4).toStrictEqual(expected4);
    });
  });

  describe('createSubscriptions', () => {
    test('It should return subscription created if everything is ok', async () => {
        const body = getSubscription(6);
        const expected = {
            data: getSubscription(6),
        };

        const sub = await createSusbcription({ body });
        expect(sub).toStrictEqual(expected);
    });

    test('It should reject if another subscription with the same email is already in storage', async () => {
        const body = getSubscription(4);
        expectError(createSusbcription, 'repeatedSubscription', { body }); 
    });
  });

  describe('findSubscription', () => {
    test('It should return first subscription of list resulting ordering by email and filtering', async () => {
        const testFilters = { name: 'name2'};
        const expected = {
            data: getSubscription(2),
        };

        const sub = await findSubscription({ query: testFilters });
        expect(sub).toStrictEqual(expected);
    });
  });

  describe('updateSubscription', () => {
    test('It should return subscription updated if everything is ok', async () => {
        const body = {...getSubscription(4), salary_min: 123};
        const expected = {
            data: body,
        };

        const sub = await updateSubscription({ body });
        expect(sub).toStrictEqual(expected);
    });
  });

  describe('deleteSubscription', () => {
    test('It should return subscription deleted if everything is ok', async () => {
        const body = getSubscription(4);
        const expected = {
            data: body,
        };

        const sub = await deleteSubscription({ body });
        expect(sub).toStrictEqual(expected);
    });

    test('It should reject if subscription isnt found in storage', async () => {
        const body = getSubscription(7);
        expectError(deleteSubscription, 'missingSubscription', { body }); 
    });
  });

  describe('deleteAllSubscriptions', () => {
    test('It should return empty array if everything is ok', async () => {
        const job = await deleteAllSubscriptions();
        expect(job).toStrictEqual({ data: []});
    });
  });