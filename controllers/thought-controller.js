const { Thought, User } = require("../models");

const tcontroller = {
  // HERE WE CAN GET ALL THOUGHTS
  getAllThought(req, res) {
    Thought.find({}).populate({
        path: "reactions",
        select: "-__v",
      }).select("-__v").sort({ _id: -1 }).then((tdata) => res.json(tdata)).catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  },

  // GET THOUGHT BY ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id }).populate({
        path: "reactions",
        select: "-__v",
      }).select("-__v").then((tdata) => {
        if (!tdata) {
          return res.status(404).json({ message: "Sorry! There is'nt any thought with this ID." });
        }
        res.json(tdata);
      }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  },

  // CREATE THOUGHT
  createThought({ params, body }, res) {
    Thought.create(body).then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      }).then((udata) => {
        if (!udata) {
          return res.status(404).json({ message: "Sorry! There is not any user with this id, but Thought created successfully!" });
        }

        res.json({ message: "Thought created successfully!" });
      }).catch((error) => res.json(error));
  },

  // UPDATE THOUGHT BY ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((tdata) => {
        if (!tdata) {
          res.status(404).json({ message: "There is'nt any Thought with the mentioned ID!" });
          return;
        }
        res.json(tdata);
      })
      .catch((err) => res.json(error));
  },

  // DELETE THOUGHT
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((tdata) => {
        if (!tdata) {
          return res.status(404).json({ message: "There is'nt any Thought with the mentioned ID!" });
        }

        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, 
          { new: true }
        );
      })
      .then((udata) => {
        if (!udata) {
          return res
            .status(404)
            .json({ message: "Sorry! There is not any user with this id, but Thought created successfully!" });
        }
        res.json({ message: "Thought deleted successfully!" });
      })
      .catch((error) => res.json(error));
  },

  // ADD REACTION
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((tdata) => {
        if (!tdata) {
          res.status(404).json({ message: "There is'nt any thought with mentioned ID!" });
          return;
        }
        res.json(tdata);
      })
      .catch((error) => res.json(error));
  },

  // DELETE REACTION
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((tdata) => res.json(tdata))
      .catch((error) => res.json(error));
  },
};

module.exports = tcontroller;
