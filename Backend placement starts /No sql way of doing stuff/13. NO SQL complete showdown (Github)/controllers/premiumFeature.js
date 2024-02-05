const User = require('../models/users')
const Expense = require('../models/expense')
//const sequelize = require('../util/database')

const getUserLeaderBoard = async (req, res) => {
    try {
      const leaderboardofusers = await User.find()
        .sort({ totalExpenses: -1 })
        .exec();
  
      res.status(200).json(leaderboardofusers);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };


module.exports = {

    getUserLeaderBoard
}