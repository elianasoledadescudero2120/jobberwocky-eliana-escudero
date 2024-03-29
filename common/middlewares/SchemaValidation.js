import ajv from 'ajv';
import config from '../../config.js';
const Ajv = ajv.default;

const { errorMessages } = config;

const SchemaValidation = {

  verify: (schema) => {
    if (!schema) {
      throw { message: errorMessages.schemaNotProvided, code: 500};
    }

    return (req, res, next) => {
      const { body } = req;
      const ajv = new Ajv({ allErrors: true, coerceTypes: true, strict: false });
      const validate = ajv.compile(schema);
      const isValid = validate(body);

      if (isValid) {
        return next();
      }

      return res.status(400).json({
        success: false,
        error: { message: `Invalid data: ${ajv.errorsText(validate.errors)}` },
      });
    }
  }
};

export default SchemaValidation;

export const isValidData  = (data, schema) => {
  const ajv = new Ajv({ allErrors: true, strict: false});
  const validate = ajv.compile(schema);
  return validate(data);
}