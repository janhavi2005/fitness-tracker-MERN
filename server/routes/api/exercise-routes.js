const router = require("express").Router();
const {
  createResistance,
  getResistanceById,
  deleteResistance,
  updateResistance,  // Import update function for resistance
} = require("../../controllers/resistance-controller");

const {
  createCardio,
  getCardioById,
  deleteCardio,
  updateCardio,  // Import update function for cardio
} = require("../../controllers/cardio-controller");

// Import middleware
const { authMiddleware } = require('../../utils/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Cardio Routes
 * Endpoint: /api/exercise/cardio
 */
router.route("/cardio")
  // Create a new cardio exercise
  .post(createCardio);

router.route("/cardio/:id")
  // Get a cardio exercise by ID
  .get(getCardioById)
  // Update a cardio exercise by ID
  .put(updateCardio)  // Add PUT method for updating cardio
  // Delete a cardio exercise by ID
  .delete(deleteCardio);

/**
 * Resistance Routes
 * Endpoint: /api/exercise/resistance
 */
router.route("/resistance")
  // Create a new resistance exercise
  .post(createResistance);

router.route("/resistance/:id")
  // Get a resistance exercise by ID
  .get(getResistanceById)
  // Update a resistance exercise by ID
  .put(updateResistance)  // Add PUT method for updating resistance
  // Delete a resistance exercise by ID
  .delete(deleteResistance);

module.exports = router;
