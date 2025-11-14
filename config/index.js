module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
  secretJwtToken: process.env.JWT_SECRET || "test",
};
