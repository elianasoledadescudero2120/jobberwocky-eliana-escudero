export const SubscriptionSchema = {
    type: "object",
    properties: {
      email: {
        type: "string",
        filters: [
          { name: "email", type: "stringIncludes" }
        ]
      },
      name: {
        type: "string",
        filters: [
          { name: "name", type: "stringIncludes" }
        ]
      },
      salary_min: {
        type: "number",
        filters: [
          { name: "salary", type: "lessThan" }
        ]
      },
      country: {
        type: "string",
        filters: [
          { name: "country", type: "stringEqual" }
        ]
      },
      skills: {
        type: "string",
        filters: [
          { name: "skills", type: "includesAll" }
        ]
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