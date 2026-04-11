const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
){
  try {
    const sql = `
      INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *
    `
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
  } catch (error) {
    return error.message
  }
}
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT * FROM account WHERE account_email = $1`,
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    console.error(error)
  }
}
async function getAccountById(account_id) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_id = $1",
    [account_id]
  )
  return result.rows[0]
}

async function updateAccount(id, first, last, email) {
  const sql = `
    UPDATE account
    SET account_firstname=$1, account_lastname=$2, account_email=$3
    WHERE account_id=$4
    RETURNING *
  `
  const data = await pool.query(sql, [first, last, email, id])
  return data.rows[0]
}
async function updatePassword(id, password) {
  const sql = `
    UPDATE account
    SET account_password=$1
    WHERE account_id=$2
  `
  const data = await pool.query(sql, [password, id])
  return data
}
module.exports = { registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword }