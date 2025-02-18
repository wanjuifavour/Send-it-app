const { executeStoredProcedure } = require("../config/database")

exports.getAllLocations = async (req, res) => {
    try {
        const result = await executeStoredProcedure("sp_GetAllLocationNames")
        const locations = result.recordset.map(record => record.name)
        res.json(locations)
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error: error.message })
    }
}

exports.getLocationCoordinates = async (req, res) => {
    const locationName = req.body.locationName
    try {
        const result = await executeStoredProcedure("sp_GetLocationCoordinates", { locationName })
        const locationDetails = result.recordset[0]
        res.json(locationDetails)
    } catch (error) {
        res.status(500).json({ message: "Error fetching location details", error: error.message })
    }
}  