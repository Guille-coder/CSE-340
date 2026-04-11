// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

router.get(
  "/",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)
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

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)
// Route to trigger 500 error (Task 3)
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)
// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)
// Handle update request

router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// ==============================
// DELETE VIEW 
// ==============================
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteView)
)

// ==============================
// DELETE PROCESS
// ==============================
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;