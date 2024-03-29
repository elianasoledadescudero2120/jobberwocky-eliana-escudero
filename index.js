import express from 'express';
import config from "./config.js";
import dotenv from 'dotenv';
import JobsRoutes from "./components/jobs/routes.js";
import SubscriptionRoutes from './components/subscriptions/routes.js';

dotenv.config();
const PORT = process.env.PORT || config.port;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/job", JobsRoutes);
app.use("/subscription", SubscriptionRoutes);
app.use((_, res) => {
  res.status(404).json({
    success: false,
    error: { message: config.errorMessages.requestError },
  });
});

app.listen(PORT, () => {
  console.log("Server Listening on port:", PORT);
});