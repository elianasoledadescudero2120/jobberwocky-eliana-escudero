import express from "express";
import JobsController from "./controller.js";
import { CreateJobSchema, DeleteJobSchema, UpdateJobSchema } from "./schema.js";
import SchemaValidation from "../../common/middlewares/SchemaValidation.js";

const router = express.Router();

router.get(
  "/all",
  [],
  JobsController.getAllJobs
);

router.get(
  "/find",
  [],
  JobsController.findJob
);

router.post(
  "/create",
  [ SchemaValidation.verify(CreateJobSchema)],
  JobsController.createJob
);

router.post(
  "/update",
  [ SchemaValidation.verify(UpdateJobSchema)],
  JobsController.updateJob
);

router.delete(
  "/delete",
  [ SchemaValidation.verify(DeleteJobSchema)],
  JobsController.deleteJob
);

router.delete(
  "/deleteAll",
  [],
  JobsController.deleteAll
);


export default router;
