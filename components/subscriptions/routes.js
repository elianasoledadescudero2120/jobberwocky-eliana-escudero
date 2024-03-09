import express from "express";
import { ABMSubscriptionSchema } from "./schema.js";
import SchemaValidation from "../../common/middlewares/SchemaValidation.js";
import SubscriptionsController from "./controller.js";

const router = express.Router();

router.get(
  "/all",
  [],
  SubscriptionsController.getAllSubscriptions
);

router.get(
  "/find",
  [],
  SubscriptionsController.findSubscription
);

router.post(
  "/create",
  [ SchemaValidation.verify(ABMSubscriptionSchema)],
  SubscriptionsController.createSubscription
);

router.post(
  "/update",
  [ SchemaValidation.verify(ABMSubscriptionSchema)],
  SubscriptionsController.updateSubscription
);

router.post(
  "/delete",
  [ SchemaValidation.verify(ABMSubscriptionSchema)],
  SubscriptionsController.deleteSubscription
);

router.post(
  "/deleteAll",
  [],
  SubscriptionsController.deleteAll
);


export default router;
