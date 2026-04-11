const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// =============================
// MANAGEMENT VIEW
// =============================
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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
    return res.redirect("/inv/")   
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
    return res.redirect("/inv/")   
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

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)

  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

 let {
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id,
} = req.body

classification_id = parseInt(classification_id)
inv_id = parseInt(inv_id)

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    return res.redirect("/inv/")
  
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    req.flash("notice", "Sorry, update failed.")
    return res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
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
    })
  }

}
/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}
/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult.rowCount > 0) {
    req.flash("notice", "Vehicle successfully deleted.")
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Delete failed.")
    return res.redirect("/inv/delete/" + inv_id)
  }
}



module.exports = invCont