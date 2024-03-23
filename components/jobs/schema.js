export const JobSchema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        filters: [
          { name: "name", type: "stringIncludes" }
        ]
      },
      salary: {
        type: "number",
        filters: [
          { name: "salary_min", type: "greaterThan" },
          { name: "salary_max", type: "lessThan" }
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
    additionalProperties: false,
};

export const JobsSchema = {
  type: "array",
  items: {
    ...JobSchema,
    required: ["name", "salary", "country", "skills"],
  }
}

export const CreateJobSchema = {
  ...JobSchema,
  required: ["name", "salary", "country", "skills"],
};

export const UpdateJobSchema = { 
  ...JobSchema,
  required: ["name"],
};

export const DeleteJobSchema = {
  ...JobSchema,
  required: ["name"],
  additionalProperties: true,
};