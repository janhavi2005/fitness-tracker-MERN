const { Cardio, User } = require("../models");

module.exports = {
  /**
   * Create a new cardio exercise and associate it with a user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCardio({ body }, res) {
    try {
      // Create cardio data
      const dbCardioData = await Cardio.create(body);

      // Associate the cardio data with a user
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { cardio: dbCardioData._id } },
        { new: true }
      );

      // Handle case where user is not found
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Cardio created but no user found with this ID!" });
      }

      res.json({ message: "Cardio successfully created!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create cardio!", error: err.message });
    }
  },

  /**
   * Get a single cardio exercise by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCardioById({ params }, res) {
    try {
      const dbCardioData = await Cardio.findById(params.id);

      // Handle case where no cardio data is found
      if (!dbCardioData) {
        return res
          .status(404)
          .json({ message: "No cardio data found with this ID!" });
      }

      res.json(dbCardioData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve cardio!", error: err.message });
    }
  },

  /**
   * Delete a cardio exercise and remove its reference from the user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCardio({ params }, res) {
    try {
      // Delete cardio data
      const dbCardioData = await Cardio.findByIdAndDelete(params.id);

      // Handle case where no cardio data is found
      if (!dbCardioData) {
        return res
          .status(404)
          .json({ message: "No cardio data found with this ID!" });
      }

      // Remove cardio reference from user data
      const dbUserData = await User.findOneAndUpdate(
        { cardio: params.id },
        { $pull: { cardio: params.id } },
        { new: true }
      );

      // Handle case where user is not found
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Cardio deleted but no user found with this ID!" });
      }

      res.json({ message: "Cardio successfully deleted!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete cardio!", error: err.message });
    }
  },

  /**
   * Update cardio exercise by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateCardio({ params, body }, res) {
    try {
      const dbCardioData = await Cardio.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true }
      );

      if (!dbCardioData) {
        return res.status(404).json({ message: "No cardio data found with this ID!" });
      }

      res.json(dbCardioData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update cardio!", error: err.message });
    }
  },
};
