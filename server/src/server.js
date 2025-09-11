const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB connection error', err));

  // const User = mongoose.model('User', userSchema);
  // module.exports = User;