const SubscriptionSchema = {
    type: "object",
    properties: {
      email: {
        type: "string",
      },
      name: {
        type: "string",
      },
      salary_min: {
        type: "number",
      },
      country: {
        type: "string",
      },
      skills: {
        type: "string",
      }
    },
    required: ["email"],
    additionalProperties: false,
};

export const SubscriptionsSchema = {
  type: "array",
  items: {
    ...SubscriptionSchema,
  }
}

export const ABMSubscriptionSchema = {
  ...SubscriptionSchema,
}