const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    })
  }
  next()
}


validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make required"),
    body("inv_model").trim().notEmpty().withMessage("Model required"),
    body("inv_year").isInt({ min: 1900, max: 2100 }).withMessage("Valid year required"),
    body("inv_price").isFloat({ min: 0 }).withMessage("Valid price required"),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be numbers"),
    body("inv_color").trim().notEmpty().withMessage("Color required"),
    body("classification_id").notEmpty().withMessage("Choose classification")
  ]
}
validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body
    })
  }
  next()
}


module.exports = validate