const { executeStoredProcedure } = require("../config/database")

exports.getAllLocations = async (req, res) => {
    try {
        const result = await executeStoredProcedure("sp_GetAllLocationNames")
        const locations = result.recordset.map(record => ({
            id: record.id,
            name: record.name,
            latitude: record.latitude,
            longitude: record.longitude
        }));
        res.json(locations)
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error: error.message })
    }
} 

exports.addLocation = async (req, res) => {
    const { name, latitude, longitude } = req.body;
    
    if (!name || !latitude || !longitude) {
        return res.status(400).json({ message: "All location fields are required" });
    }

    try {
        await executeStoredProcedure("sp_AddLocation", {
            name: name.trim(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        });
        res.status(201).json({ message: "Location added successfully" });
    } catch (error) {
        res.status(400).json({ 
            message: error.message || "Error adding location",
            error: error.originalError?.info?.message 
        });
    }
};

exports.getLocationCoordinates = async (req, res) => {
    const { name } = req.query;
    
    try {
        const result = await executeStoredProcedure("sp_GetLocationCoordinates", {
            locationName: name
        });
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: "Location not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};