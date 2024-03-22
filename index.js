import express from 'express';
import config from "./config.js";
import dotenv from 'dotenv';
import JobsRoutes from "./components/jobs/routes.js";
import SubscriptionRoutes from './components/subscriptions/routes.js';
import { errorResponse } from './common/helpers/api-helpers.js';

dotenv.config();
const PORT = process.env.PORT || config.port;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/job", JobsRoutes);
app.use("/subscription", SubscriptionRoutes);
app.use((_, res) => errorResponse(res, { message: config.errorMessages.requestError, code: 404 }));

app.listen(PORT, () => {
  console.log("Server Listening on port:", PORT);
});