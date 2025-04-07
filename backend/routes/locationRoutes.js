const express = require("express")
const router = express.Router()
const { getAllLocations, addLocation } = require("../controllers/locationController")

router.get("/get", getAllLocations)
// router.post("/add", addLocation);

module.exports = router