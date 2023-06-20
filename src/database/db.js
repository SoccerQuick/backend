const mongoose = require('mongoose');
const { DB_HOST, DB_NAME } = require('../envconfig');

const connectToDatabase = async () => {
  try {
    const connectionUri = `${DB_HOST}/${DB_NAME}`;
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: 'majority',
        wtimeout: 5000,
      },
    });

    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

module.exports = { connectToDatabase };
