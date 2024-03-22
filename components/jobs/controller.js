import { executeQuery } from '../../common/helpers/api-helpers.js'
import { createJob, deleteAllJobs, deleteJob, findJob, getAllJobs, updateJob } from './repository.js';

const JobsController = {
  getAllJobs: async (req, res) => executeQuery(req, res, getAllJobs),
  findJob: async (req, res) => executeQuery(req, res, findJob),
  createJob: async (req, res) => executeQuery(req, res, createJob),
  updateJob: async (req, res) => executeQuery(req, res, updateJob),
  deleteJob: async (req, res) => executeQuery(req, res, deleteJob),
  deleteAll: async (req, res) => executeQuery(req, res, deleteAllJobs),
};

export default JobsController;
