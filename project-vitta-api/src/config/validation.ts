import * as Joi from 'joi';

/**
 * Validación de variables de entorno usando Joi
 * Se usa en ConfigModule para asegurar que todos los valores necesarios estén presentes y bien formateados.
 */
export const validationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
});
