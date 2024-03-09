import ajv from 'ajv';
const Ajv = ajv.default;

const SchemaValidation = {

  verify: (schema) => {
    if (!schema) {
      throw new Error('Schema not provided');
    }

    return (req, res, next) => {
      const { body } = req;
      const ajv = new Ajv({ allErrors: true, coerceTypes: true });
      const validate = ajv.compile(schema);
      const isValid = validate(body);

      if (isValid) {
        return next();
      }

      return res.send({
        status: false,
        error: {
          message: `Invalid data: ${ajv.errorsText(validate.errors)}`,
        }
      });
    }
  }
};

export default SchemaValidation;

export const isValidData  = (data, schema) => {
  const ajv = new Ajv({ allErrors: true});
  const validate = ajv.compile(schema);
  return validate(data);
}