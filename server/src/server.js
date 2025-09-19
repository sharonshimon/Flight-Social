const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB connection error', err));

// const User = mongoose.model('User', userSchema);
// module.exports = User;