const { User, Thought } = require("../models");

const ucontroller = {
  // GET ALL USERS
  getAllUser(req, res) {
    User.find({}).populate({
        path: "friends",
        select: "-__v",
      }).select("-__v").sort({ _id: -1 }).then((udata) => res.json(udata)).catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  },

  // GET SINGLE USER WITH ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id }).populate({
        path: "thoughts",
        select: "-__v",
      }).populate({
        path: "friends",
        select: "-__v",
      }).select("-__v").then((udata) => {
        if (!udata) {
          return res.status(404).json({ message: "There is'nt any user with this ID!" });
        }
        res.json(udata);
      }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  },

  // ADD NEW USER
  createUser({ body }, res) {
    User.create(body).then((udata) => res.json(udata)).catch((error) => res.json(error));
  },

  // UPDATE USER WITH ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    }).then((udata) => {
        if (!udata) {
          res.status(404).json({ message: "There is'nt any user with the ID!" });
          return;
        }
        res.json(udata);
      }).catch((error) => res.json(error));
  },

  // DELETE USER
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((udata) => {
        if (!udata) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        return Thought.deleteMany({ _id: { $in: udata.thoughts } });
      }).then(() => {
        res.json({ message: "The associated thought and user deleted successfully!" });
      }).catch((error) => res.json(error));
  },

  // ADD NEW FRIEND
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    ).then((udata) => {
        if (!udata) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(udata);
      }).catch((error) => res.json(error));
  },

  // DELETE FRIEND
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    ).then((udata) => {
        if (!udata) {
          return res.status(404).json({ message: "There is'nt any user with this ID!" });
        }
        res.json(udata);
      }).catch((error) => res.json(error));
  },
};
module.exports = ucontroller;
