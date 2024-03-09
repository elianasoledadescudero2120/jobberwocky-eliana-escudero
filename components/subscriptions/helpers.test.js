import { parseToWorkWith } from '../../common/helpers/data-helpers.js';
import * as fileHelpers from '../../common/helpers/file-helpers.js';
import { filterSubscription, filterSubscriptionForJob, retrieveSubscriptions, saveSubscriptions } from './helpers';
import config from '../../config.js';
const { errorMessages } = config;

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

    const errorCatch = jest.fn();
    await retrieveSubscriptions().catch(errorCatch);
    expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.readSubscriptions}); 
  });

  test('It should throw error when data is not valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    mockCsvToJson = jest.fn();

    const errorCatch = jest.fn();
    await retrieveSubscriptions().catch(errorCatch);
    expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.corruptedData}); 
  });
});

describe('saveSubscriptions', () => {
  test('It should work ok if no errors with parsing and saving', async () => {
    jest.spyOn(fileHelpers, "writeFile").mockResolvedValue('someValue');
    
    const errorCatch = jest.fn();
    await saveSubscriptions(subscriptions).catch(errorCatch);
    expect(errorCatch).not.toHaveBeenCalled(); 
  });

  test('It should throw error if writing to file fails', async () => {
      jest.spyOn(fileHelpers, "writeFile").mockRejectedValue(new Error());
      
      const errorCatch = jest.fn();
      await saveSubscriptions(subscriptions).catch(errorCatch);
      expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.saveSubscription}); 
  });
});

describe('filterSubscription', () => {
  test('It should apply filter ok', async () => {
    const filterOne = { name: 'job', salary: 1000 };
    expect(filterSubscription(subscriptionsParsed[0], filterOne)).toBe(true);

    const filterTwo = { name: 'job', salary: 500 };
    expect(filterSubscription(subscriptionsParsed[0], filterTwo)).toBe(false);

    const filterThree = { name: 'job', salary: 1000, skills:'java,node' };
    expect(filterSubscription(subscriptionsParsed[0], filterThree)).toBe(true);

    const filterFour = { name: 'job', salary: 1000, skills:'java,node,phyton' };
    expect(filterSubscription(subscriptionsParsed[0], filterFour)).toBe(false);

    const filterFive = { name: 'job', salary_min: 1000, country:'jobCountry' };
    expect(filterSubscription(subscriptionsParsed[0], filterFive)).toBe(true);

    const filterSix = { name: 'job', salary_min: 1000, country:'Armenia' };
    expect(filterSubscription(subscriptionsParsed[0], filterSix)).toBe(false);

    const filterSeven = { name: 'NaMe'};
    expect(filterSubscription(subscriptionsParsed[0], filterSeven)).toBe(true);

    const filterEight = { name: 'other'};
    expect(filterSubscription(subscriptionsParsed[0], filterEight)).toBe(false);

    const filterNine = { email: 'someemail@gmail.com'};
    expect(filterSubscription(subscriptionsParsed[0], filterNine)).toBe(true);

    const filterTen = { name: 'other@gmail.com'};
    expect(filterSubscription(subscriptionsParsed[0], filterTen)).toBe(false);
  });
});

describe('filterSubscriptionForJob', () => {
  test('It should apply filter ok', async () => {
    const job = { name: 'jobName', salary: 1000, country: 'JobCountry', skills: 'java,node' };
  
    const subOne = { salary_min: 1000, skills: [] };
    expect(filterSubscriptionForJob(subOne, job)).toBe(true);

    const subTwo = { salary_min: 2000, skills: [] };
    expect(filterSubscriptionForJob(subTwo, job)).toBe(false);

    const subThree = { country: 'jObcoUntry', skills: [] };
    expect(filterSubscriptionForJob(subThree, job)).toBe(true);

    const subFour = { country: 'Armenia', skills: [] };
    expect(filterSubscriptionForJob(subFour, job)).toBe(false);

    const subFive = { name: 'naME', skills: [] };
    expect(filterSubscriptionForJob(subFive, job)).toBe(true);

    const subSix = { name: 'java', skills: [] };
    expect(filterSubscriptionForJob(subSix, job)).toBe(false);

    const subSeven = { skills: ['java' ,'node'] };
    expect(filterSubscriptionForJob(subSeven, job)).toBe(true);

    const subEight = { skills: ['phyton'] };
    expect(filterSubscriptionForJob(subEight, job)).toBe(false);

    const subNine = { skills: ['phyton', 'java'] };
    expect(filterSubscriptionForJob(subNine, job)).toBe(true);
  });
});