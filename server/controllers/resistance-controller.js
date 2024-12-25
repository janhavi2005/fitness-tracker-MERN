const { Resistance, User } = require("../models");

module.exports = {
  /**
   * Create a new resistance exercise and associate it with a user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createResistance({ body }, res) {
    try {
      // Create resistance data
      const dbResistanceData = await Resistance.create(body);

      // Associate the resistance data with a user
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { resistance: dbResistanceData._id } },
        { new: true }
      );

      // Handle cases where user is not found
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Resistance created but no user found with this ID!" });
      }

      res.json({ message: "Resistance successfully created!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create resistance!", error: err.message });
    }
  },

  /**
   * Get a single resistance exercise by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getResistanceById({ params }, res) {
    try {
      const dbResistanceData = await Resistance.findById(params.id);

      // Handle case where no data is found
      if (!dbResistanceData) {
        return res
          .status(404)
          .json({ message: "No resistance data found with this ID!" });
      }

      res.json(dbResistanceData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve resistance!", error: err.message });
    }
  },

  /**
   * Delete a resistance exercise and remove its reference from the user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteResistance({ params }, res) {
    try {
      // Delete resistance data
      const dbResistanceData = await Resistance.findByIdAndDelete(params.id);

      // Handle case where no resistance data is found
      if (!dbResistanceData) {
        return res
          .status(404)
          .json({ message: "No resistance data found with this ID!" });
      }

      // Remove resistance reference from user data
      const dbUserData = await User.findOneAndUpdate(
        { resistance: params.id },
        { $pull: { resistance: params.id } },
        { new: true }
      );

      // Handle case where user is not found
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Resistance deleted but no user found with this ID!" });
      }

      res.json({ message: "Resistance successfully deleted!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete resistance!", error: err.message });
    }
  },

  // Update resistance by ID
  async updateResistance({ params, body }, res) {
    try {
      const dbResistanceData = await Resistance.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true }
      );

      if (!dbResistanceData) {
        return res.status(404).json({ message: "No resistance data found with this id!" });
      }

      res.json(dbResistanceData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update resistance!", error: err.message });
    }
  },
};
