const JobSchema = {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      salary: {
        type: "number",
      },
      country: {
        type: "string",
      },
      skills: {
        type: "string",
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