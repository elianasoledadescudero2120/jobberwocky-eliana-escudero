import * as fileHelpers from '../../common/helpers/file-helpers.js';
import { filterJob, joinJobs, orderJobs, retrieveJobs, saveJobs } from './helpers';
import { expectNotError, expectError, getLocalJob } from '../../common/helpers/test-helpers.js';
import { orderByIntegerValue, orderByStringValue, parseToWorkWith } from '../../common/helpers/data-helpers.js';

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
    expectError(retrieveJobs, 'readJobs', 500, null);
  });

  test('It should throw error when data is not valid according to schema', async () => {
    jest.spyOn(fileHelpers, "readFile").mockResolvedValue('someValue');
    mockCsvToJson = jest.fn();
    expectError(retrieveJobs, 'corruptedData', 500, null);
  });
});

describe('saveJobs', () => {
    test('It should work ok if no errors with parsing and saving', async () => {
      jest.spyOn(fileHelpers, "writeFile").mockResolvedValue('someValue');
      expectNotError(saveJobs, jobs);
    });

    test('It should throw error if writing to file fails', async () => {
      jest.spyOn(fileHelpers, "writeFile").mockRejectedValue(new Error());
      expectError(saveJobs, 'saveJob', 500, jobs);
    });
});

describe('filterJob', () => {
    test('It should apply filter ok', async () => {
      const testCases = [
        [{ name: 'job', salary_min: 1000 }, true],
        [{ name: 'job', salary_min: 2000 }, false],
        [{ name: 'job', salary_min: 1000, skills:'java,node' }, true],
        [{ name: 'job', salary_min: 1000, skills:'java,node,phyton' }, false],
        [{ name: 'job', salary_min: 1000, country:'jobCountry' }, true],
        [{ name: 'job', salary_min: 1000, country:'Armenia' }, false],
        [{ name: 'NaMe'}, true],
        [{ name: 'other'}, false],
      ];

      testCases.forEach(([filter, response]) =>
        expect(filterJob(jobsParsed[0], filter)).toBe(response)
      );
    });
});

describe('orderJobs', () => {
    test('It should apply order ok', async () => {
        const testJobs = [getLocalJob(1), getLocalJob(2), getLocalJob(3), getLocalJob(4)];
        const testCases = [
          [{ order_by: 'name' }, orderByStringValue(testJobs, 'name', 'asc')],
          [{ order_by: 'name', order_direction: 'desc' }, orderByStringValue(testJobs, 'name', 'desc')],
          [{ order_by: 'salary' }, orderByIntegerValue(testJobs, 'salary', 'asc')],
          [{}, orderByStringValue(testJobs, 'name', 'asc')],
        ];

        testCases.forEach(([order, response]) =>
          expect(orderJobs(testJobs, order)).toBe(response)
        );
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