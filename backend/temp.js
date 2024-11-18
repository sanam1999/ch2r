
const mongoose = require('mongoose');
const UserInfo  = require('./models/userInfo');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/C2sh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Insert a new team into the teams array
async function addTeamToUser(userId, teamName,roles) {
  try {
    // Find the user by ID and update the teams array
    const user = await UserInfo.findByIdAndUpdate(
      userId,
      { $push: { teams: {teamName: teamName ,
  roles: roles,}} }, 
      { new: true } 
    );

    if (!user) {
      throw new Error('User not found'); 
    } else {
      return 'Updated User';
    }
  } catch (error) {
    throw new Error('Error adding team to user: ' + error.message); 
  }
}


