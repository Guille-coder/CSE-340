const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body
  // Hash the password before storing
let hashedPassword
try {
  hashedPassword = await bcrypt.hash(account_password, 10)
} catch (error) {
  req.flash("notice", "Sorry, there was an error processing the registration.")
  return res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Credenciales incorrectas")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {

      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      )

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000
      })

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Contraseña incorrecta")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Error en login")
  }
}
/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash()
  })
}

async function buildUpdateView(req, res) {
  const account_id = parseInt(req.params.account_id)

  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    ...accountData,
    errors: null
  })
}

async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)

    delete updatedAccount.account_password

    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 3600 * 1000
    })

    req.flash("notice", "Account updated successfully")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed")
    return res.redirect("/account/update/" + account_id)
  }
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  const hashed = await bcrypt.hash(account_password, 10)

  const result = await accountModel.updatePassword(account_id, hashed)

  if (result) {

    const updatedAccount = await accountModel.getAccountById(account_id)

    delete updatedAccount.account_password

    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 3600 * 1000
    })

    req.flash("notice", "Password updated")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed")
    return res.redirect("/account/update/" + account_id)
  }
}
module.exports = { buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword}