// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route for vehicle detail
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildByInventoryId)
)

// Route to trigger 500 error (Task 3)
router.get(
  "/error",
  utilities.handleErrors(async (req, res, next) => {
    throw new Error("Intentional 500 error")
  })
)

module.exports = router;