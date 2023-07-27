const Server = {
    Port: process.env.PORT || 6000,
    Version: process.env.API_VERSION || 'v1'
};

const AuthSecrets = {
    SecretKey: process.env.JWT_SECRET,
    TokenExpiry: process.env.TOKEN_EXPIRY
};

const MySqlDB = {
    Host: process.env.MYSQL_DB_HOST,
    Port: process.env.MYSQL_DB_PORT,
    User: process.env.MYSQL_DB_USER,
    Password: process.env.MYSQL_DB_PASSWORD,
    Name: process.env.MYSQL_DB_NAME
};

module.exports = {
    Server,
    AuthSecrets,
    MySqlDB
}