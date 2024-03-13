import { parseToWorkWith } from '../../common/helpers/data-helpers.js';
import * as fileHelpers from '../../common/helpers/file-helpers.js';
import { filterSubscription, filterSubscriptionForJob, retrieveSubscriptions, saveSubscriptions } from './helpers';
import { expectNotError, expectToCatchError, getSubscription } from '../../common/helpers/test-helpers.js';

const csv = "somecsv";
const subscriptions = [
    {
        email: 'someemail@gmail.com', name: 'jobName', salary_min: 1000, country: 'JobCountry', skills: 'java,node'
    }
];
const subscriptionsParsed = parseToWorkWith(subscriptions);

let mockCsvToJson = jest.fn(() => subscriptions);
let mockJsonToCsv = jest.fn(() => csv);
jest.mock('json-2-csv', () => ({ 
  csv2json: () => mockCsvToJson(),
  json2csv: () => mockJsonToCsv(),
}));

describe('retrieveSubscriptions', () => {
  test('It should return the content of the file, if no errors and is valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    const data = await retrieveSubscriptions();
    expect(data).toStrictEqual(subscriptionsParsed);
  });

  test('It should return an empty array when storage is empty', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('');
    const data = await retrieveSubscriptions();
    expect(data).toStrictEqual([]);
  });

  test('It should throw error when read file failed', async () => {
    jest.spyOn(fileHelpers, "readFile").mockRejectedValue(new Error());
    expectToCatchError(retrieveSubscriptions, 'readSubscriptions', null);
  });

  test('It should throw error when data is not valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    mockCsvToJson = jest.fn();
    expectToCatchError(retrieveSubscriptions, 'corruptedData', null);
  });
});

describe('saveSubscriptions', () => {
  test('It should work ok if no errors with parsing and saving', async () => {
    jest.spyOn(fileHelpers, "writeFile").mockResolvedValue('someValue');
    expectNotError(saveSubscriptions, subscriptions);
  });

  test('It should throw error if writing to file fails', async () => {
      jest.spyOn(fileHelpers, "writeFile").mockRejectedValue(new Error());
      expectToCatchError(saveSubscriptions, 'saveSubscription', subscriptions);
  });
});

describe('filterSubscription', () => {
  test('It should apply filter ok', async () => {
    const subscription = getSubscription(1);
    const testCases = [
      [{ name: 'job', salary: 1000 }, true],
      [{ name: 'job', salary: 500 }, false],
      [{ name: 'job', salary: 1000, skills:'java1,node1' }, true],
      [{ name: 'job', salary: 1000, skills:'java1,node1,phyton' }, false],
      [{ name: 'job', salary_min: 1000, country:'jobCountry1' }, true],
      [{ name: 'job', salary_min: 1000, country:'Armenia' }, false],
      [{ name: 'NaMe'}, true],
      [{ name: 'other'}, false],
      [{ email: 'someemail@gmail.com'}, true],
      [{ email: 'other@gmail.com'}, false],
    ];

    testCases.forEach(([filter, response]) =>
      expect(filterSubscription(subscription, filter)).toBe(response)
    );
  });
});

describe('filterSubscriptionForJob', () => {
  test('It should apply filter ok', async () => {
    const job = { name: 'jobName', salary: 1000, country: 'JobCountry', skills: 'java,node' };
    const testCases = [
      [{ salary_min: 1000, skills: [] }, true],
      [{ salary_min: 2000, skills: [] }, false],
      [{ country: 'jObcoUntry', skills: [] }, true],
      [{ country: 'Armenia', skills: [] }, false],
      [{ name: 'naME', skills: [] }, true],
      [{ name: 'java', skills: [] }, false],
      [{ skills: ['java' ,'node'] }, true],
      [{ skills: ['phyton'] }, false],
      [{ skills: ['phyton', 'java'] }, true],
    ];

    testCases.forEach(([subscription, response]) =>
      expect(filterSubscriptionForJob(subscription, job)).toBe(response)
    );
  });
});