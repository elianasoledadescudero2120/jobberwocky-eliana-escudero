import { executeQuery } from '../../common/helpers/api-helpers.js'
import { createSusbcription, deleteAllSubscriptions, deleteSubscription, findSubscription, getAllSubscriptions, updateSubscription } from './repository.js';

const SubscriptionsController = {
  getAllSubscriptions: async (req, res) => executeQuery(req, res, getAllSubscriptions),
  findSubscription: async (req, res) => executeQuery(req, res, findSubscription),
  createSubscription: async (req, res) => executeQuery(req, res, createSusbcription),
  updateSubscription: async (req, res) => executeQuery(req, res, updateSubscription),
  deleteSubscription: async (req, res) => executeQuery(req, res, deleteSubscription),
  deleteAll: async (req, res) => executeQuery(req, res, deleteAllSubscriptions),
};

export default SubscriptionsController;
