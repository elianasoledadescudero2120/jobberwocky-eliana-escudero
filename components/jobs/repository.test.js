import * as helpers from "./helpers";
import * as subscriptionHelpers from "../subscriptions/helpers";
import config from "../../config";
import { createJob, deleteAllJobs, deleteJob, findJob, getAllJobs, updateJob } from "./repository";
import { getLocalJob, getExternalJob } from "../../common/helpers/test-helpers";

const { errorMessages } = config;

helpers.retrieveJobs = jest.fn().mockReturnValue([
    getLocalJob(4), getLocalJob(1), getLocalJob(2)
]);

helpers.saveJobs = jest.fn().mockReturnValue();

subscriptionHelpers.retrieveSubscriptions = jest.fn().mockReturnValue([
    { email: 'sub1@gmail.com', country: 'country4', skills: []},
    { email: 'sub2@gmail.com', country: 'country5', skills: []},
    { email: 'sub3@gmail.com', salary_min: 90, skills: [] },
    { email: 'sub4@gmail.com', skills: ['phyton']}
]);

process.env = { EXTERNAL_JOBS_SOURCE: 'https://gmail.com' };
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
        getExternalJob(5),  getExternalJob(4),
    ]),
  })
);

describe('getAllJobs', () => {
    test('It should return only local jobs if specified. They should be ordered by name.', async () => {
        const testFilters = { source: 'local'};
        const expected = {
            data: [
                { ...getLocalJob(1), source: 'local' },
                { ...getLocalJob(2), source: 'local' },
                { ...getLocalJob(4), source: 'local' },
            ],
        };

        const jobs = await getAllJobs({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });

    test('It should return only external jobs if specified. They should be ordered by name.', async () => {
        const testFilters = { source: 'external'};
        const expected = {
            data: [
                { ...getLocalJob(4), source: 'external' }, //External job matches to local job after parsing inside external-jobs.js
                { ...getLocalJob(5), source: 'external' },
            ],
        };

        const jobs = await getAllJobs({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });

    test('It should return joined jobs if no source is specified. They should be ordered according to filter.', async () => {
        const testFilters = { order_by: 'salary'};
        const expected = {
            data: [
                { ...getLocalJob(5), source: 'external' },
                { ...getLocalJob(4), source: 'local', externalRelated: {
                    country: 'country4',
                    salary: 100-4,
                    skills: ['node4', 'java4'],
                    } 
                },
                { ...getLocalJob(2), source: 'local' },
                { ...getLocalJob(1), source: 'local' },
            ],
        };

        const jobs = await getAllJobs({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });

    test('It should return joined jobs if no source is specified. They should be filtered according to filter.', async () => {
        const testFilters = { country: 'country4', source: 'local'};
        const expected = {
            data: [
                { ...getLocalJob(4), source: 'local' },
            ],
        };

        const jobs = await getAllJobs({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });
  });

  describe('findJob', () => {
    test('It should return first job of list resulting of filtering, joining and ordering', async () => {
        const testFilters = { order_by: 'salary'};
        const expected = {
            data: { ...getLocalJob(5), source: 'external' },
        };

        const jobs = await findJob({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });
  });

  describe('createJob', () => {
    test('It should return job created if everything is ok', async () => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
        const body = getLocalJob(3);
        const expected = {
            data: getLocalJob(3),
        };

        const job = await createJob({ body });
        expect(job).toStrictEqual(expected);
    });

    test('It should reject if another job with the same name is already in storage', async () => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
        const body = getLocalJob(4);

        const errorCatch = jest.fn();
        await createJob({ body }).catch(errorCatch);
        expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.repeatedJob}); 
    });

    test('It should log matching subscriptions for the job', async () => {
        const mockConsole = jest.fn();
        jest.spyOn(console, 'log').mockImplementation(mockConsole);
        const body = getLocalJob(5);

        await createJob({ body });

        expect(mockConsole).toHaveBeenCalledWith([
            'sub2@gmail.com', 'sub3@gmail.com'
        ]); 
    });
  });

  describe('findJob', () => {
    test('It should return first job of list resulting of filtering, joining and ordering', async () => {
        const testFilters = { order_by: 'salary'};
        const expected = {
            data: { ...getLocalJob(5), source: 'external' },
        };

        const jobs = await findJob({ query: testFilters });
        expect(jobs).toStrictEqual(expected);
    });
  });

  describe('updateJob', () => {
    test('It should return job updated if everything is ok', async () => {
        const body = {...getLocalJob(4), salary: 123};
        const expected = {
            data: body,
        };

        const job = await updateJob({ body });
        expect(job).toStrictEqual(expected);
    });

    test('It should reject if missing fields and job is going to be created', async () => {
        const body = { name: 'name6', country: 'country6' };

        const errorCatch = jest.fn();
        await updateJob({ body }).catch(errorCatch);
        expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.updateJobValuesMissing}); 
    });
  });

  describe('deleteJob', () => {
    test('It should return job deleted if everything is ok', async () => {
        const body = getLocalJob(4);
        const expected = {
            data: body,
        };

        const job = await deleteJob({ body });
        expect(job).toStrictEqual(expected);
    });

    test('It should reject if job isnt found in storage', async () => {
        const body = getLocalJob(7);

        const errorCatch = jest.fn();
        await deleteJob({ body }).catch(errorCatch);
        expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.missingJob}); 
    });
  });

  describe('deleteAllJobs', () => {
    test('It should return empty array if everything is ok', async () => {
        const job = await deleteAllJobs();
        expect(job).toStrictEqual({ data: []});
    });
  });