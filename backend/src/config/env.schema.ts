import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRATION: Joi.string().default('15m'),

  PASSWORD_SALT_ROUNDS: Joi.number().default(10),

  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('ADMIN_PASSWORD debe contener mayúsculas, minúsculas, números y caracteres especiales'),
});
