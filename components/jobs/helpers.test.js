import * as fileHelpers from '../../common/helpers/file-helpers.js';
import config from '../../config.js';
import { filterJob, joinJobs, orderJobs, retrieveJobs, saveJobs } from './helpers';
import { getLocalJob } from '../../common/helpers/test-helpers.js';
import { orderByIntegerValue, orderByStringValue, parseToWorkWith } from '../../common/helpers/data-helpers.js';
const { errorMessages } = config;

const csv = "somecsv";
const jobs = [
    {
        name: 'jobName', salary: 1000, country: 'JobCountry', skills: 'java,node'
    }
];
const jobsParsed = parseToWorkWith(jobs);

let mockCsvToJson = jest.fn(() => jobs);
let mockJsonToCsv = jest.fn(() => csv);
jest.mock('json-2-csv', () => ({ 
    csv2json: () => mockCsvToJson(),
    json2csv: () => mockJsonToCsv(),
}));

describe('retrieveJobs', () => {
  test('It should return the content of the file, if no errors and is valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    const data = await retrieveJobs();
    expect(data).toStrictEqual(jobsParsed);
  });

  test('It should return an empty array when storage is empty', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('');
    const data = await retrieveJobs();
    expect(data).toStrictEqual([]);
  });

  test('It should throw error when read file failed', async () => {
    jest.spyOn(fileHelpers, "readFile").mockRejectedValue(new Error());

    const errorCatch = jest.fn();
    await retrieveJobs().catch(errorCatch);
    expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.readJobs}); 
  });

  test('It should throw error when data is not valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    mockCsvToJson = jest.fn();

    const errorCatch = jest.fn();
    await retrieveJobs().catch(errorCatch);
    expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.corruptedData}); 
  });
});

describe('saveJobs', () => {
    test('It should work ok if no errors with parsing and saving', async () => {
      jest.spyOn(fileHelpers, "writeFile").mockResolvedValue('someValue');
      
      const errorCatch = jest.fn();
      await saveJobs(jobs).catch(errorCatch);
      expect(errorCatch).not.toHaveBeenCalled(); 
    });

    test('It should throw error if writing to file fails', async () => {
        jest.spyOn(fileHelpers, "writeFile").mockRejectedValue(new Error());
        
        const errorCatch = jest.fn();
        await saveJobs(jobs).catch(errorCatch);
        expect(errorCatch).toHaveBeenCalledWith({message: errorMessages.saveJob}); 
    });
});

describe('filterJob', () => {
    test('It should apply filter ok', async () => {
      const filterOne = { name: 'job', salary_min: 1000 };
      expect(filterJob(jobsParsed[0], filterOne)).toBe(true);

      const filterTwo = { name: 'job', salary_min: 2000 };
      expect(filterJob(jobsParsed[0], filterTwo)).toBe(false);

      const filterThree = { name: 'job', salary_min: 1000, skills:'java,node' };
      expect(filterJob(jobsParsed[0], filterThree)).toBe(true);

      const filterFour = { name: 'job', salary_min: 1000, skills:'java,node,phyton' };
      expect(filterJob(jobsParsed[0], filterFour)).toBe(false);

      const filterFive = { name: 'job', salary_min: 1000, country:'jobCountry' };
      expect(filterJob(jobsParsed[0], filterFive)).toBe(true);

      const filterSix = { name: 'job', salary_min: 1000, country:'Armenia' };
      expect(filterJob(jobsParsed[0], filterSix)).toBe(false);

      const filterSeven = { name: 'NaMe'};
      expect(filterJob(jobsParsed[0], filterSeven)).toBe(true);

      const filterEight = { name: 'other'};
      expect(filterJob(jobsParsed[0], filterEight)).toBe(false);
    });
});

describe('orderJobs', () => {
    test('It should apply order ok', async () => {
        
    
        const testJobs = [getLocalJob(1), getLocalJob(2), getLocalJob(3), getLocalJob(4)];
        const orderOne = { order_by: 'name' };
        expect(orderJobs(testJobs, orderOne)).toStrictEqual(orderByStringValue(testJobs, 'name', 'ASC'));

        const orderTwo = { order_by: 'name', order_direction: 'DESC' };
        expect(orderJobs(testJobs, orderTwo)).toStrictEqual(orderByStringValue(testJobs, 'name', 'DESC'));

        const orderThree = { order_by: 'salary' };
        expect(orderJobs(testJobs, orderThree)).toStrictEqual(orderByIntegerValue(testJobs, 'salary', 'ASC'));

        const orderFour = {};
        expect(orderJobs(testJobs, orderFour)).toStrictEqual(orderByStringValue(testJobs, 'name', 'ASC'));
    });
});

describe('joinJobs', () => {
    test('It should join jobs as expected', async () => {
        const localJobs = [getLocalJob(1), getLocalJob(2)];
        const externalJobs = [{...getLocalJob(3), name: 'name1'}, getLocalJob(4)];

        const expected = [
            { ...externalJobs[1], source: 'external' },
            {
                ...localJobs[0],
                externalRelated: {
                    salary: externalJobs[0].salary,
                    skills: externalJobs[0].skills,
                    country: externalJobs[0].country,
                },
                source: 'local',
            },
            { ...localJobs[1], source: 'local' },
        ];

        expect(joinJobs(localJobs, externalJobs)).toStrictEqual(expected);
    });
});