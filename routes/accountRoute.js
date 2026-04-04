const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)
// Route to registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send("login process")
  }
)
module.exports = router