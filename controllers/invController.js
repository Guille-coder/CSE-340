const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// =============================
// BY CLASSIFICATION
// =============================
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classification_id)

  const grid = await utilities.buildClassificationGrid(data)

  let nav = await utilities.getNav()

  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// =============================
// VEHICLE DETAIL (AQUÍ ESTABA EL ERROR)
// =============================
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId

  const vehicle = await invModel.getInventoryById(inv_id)

  if (!vehicle) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  const nav = await utilities.getNav()
  const detail = await utilities.buildDetailView(vehicle)

  res.render("inventory/detail", {
    title: vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    detail
  })
}

// =============================
// ERROR 500 (TASK 3)
// =============================
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error")
}

module.exports = invCont