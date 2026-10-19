 export const config = {
    PORT : process.env.PORT || 3000,
    DATABASE_URL : process.env.DATABASE_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN,
    JWT_SECRET_REFRESH : process.env.JWT_SECRET_REFRESH,
    JWT_EXPIRES_IN_REFRESH : process.env.JWT_EXPIRES_IN_REFRESH,
    JWT_SECRET_SALT_ROUNDS : process.env.JWT_SECRET_SALT_ROUNDS
 };

