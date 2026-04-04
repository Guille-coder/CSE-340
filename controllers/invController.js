const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// =============================
// MANAGEMENT VIEW
// =============================
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    messages: req.flash(),
    errors: null,
  })
}

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
// VEHICLE DETAIL
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
// ADD CLASSIFICATION VIEW
// =============================
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    messages: req.flash(),
    errors: null,
  })
}

// =============================
// ADD CLASSIFICATION PROCESS
// =============================
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully")
    return res.redirect("/inv/")   // ✅ CORREGIDO
  } else {
    let nav = await utilities.getNav()

    req.flash("notice", "Failed to add classification")

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash(),
      errors: null,
      classification_name
    })
  }
}

// =============================
// ADD INVENTORY VIEW
// =============================
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    messages: req.flash(),
    errors: null,

    inv_make: "",
  inv_model: "",
  inv_year: "",
  inv_description: "",
  inv_image: "",
  inv_thumbnail: "",
  inv_price: "",
  inv_miles: "",
  inv_color: "",
  classification_id: ""
  })
}

// =============================
// ADD INVENTORY PROCESS
// =============================
invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash("notice", "Vehicle added successfully")
    return res.redirect("/inv/")   // ✅ CORREGIDO
  } else {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    req.flash("notice", "Failed to add vehicle")

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: req.flash(),
      errors: null,
      ...req.body
    })
  }
}

// =============================
// ERROR 500
// =============================
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error")
}

module.exports = invCont