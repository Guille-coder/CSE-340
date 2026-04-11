const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Account management (PROTEGIDA)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Register process
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Login process (ÚNICA)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// VIEW
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// UPDATE INFO
router.post(
  "/update",
  utilities.handleErrors(accountController.updateAccount)
)

// UPDATE PASSWORD
router.post(
  "/update-password",
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  return res.redirect("/")
})
module.exports = router