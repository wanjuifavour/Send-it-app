const { executeStoredProcedure } = require("../config/database");

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon1 - lon2);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const toRad = (value) => {
    return value * Math.PI / 180;
};

exports.calculateDistance = async (from, to) => {
    try {
        // Get coordinates
        const fromResult = await executeStoredProcedure("sp_GetLocationCoordinates", {
            locationName: from
        });
        const toResult = await executeStoredProcedure("sp_GetLocationCoordinates", {
            locationName: to
        });

        const fromCoords = fromResult.recordset[0];
        const toCoords = toResult.recordset[0];

        if (!fromCoords || !toCoords) {
            throw new Error("Location coordinates not found");
        }

        // Calculate distance using haversine formula
        return haversine(
            fromCoords.latitude,
            fromCoords.longitude,
            toCoords.latitude,
            toCoords.longitude
        );
    } catch (error) {
        throw new Error(`Error calculating distance: ${error.message}`);
    }
};