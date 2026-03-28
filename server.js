/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const utilities = require("./utilities/")

/* *********************************
 * View Engine and Templates
 *********************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// INDEX ROUTE (with error handling)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// 404 ROUTE (must be after all routes)
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = ""
  
  // Protect nav in case DB fails
  try {
    nav = await utilities.getNav()
  } catch (e) {
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

/* ***********************
 * Server Listener
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})