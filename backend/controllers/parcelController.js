const { executeStoredProcedure } = require("../config/database")
const { sendSMS } = require("../services/smsService");

exports.upsertParcel = async (req, res) => {
    const { id, senderId, receiverId, senderLocation, destination, weight } = req.body

    try {
        const result = await executeStoredProcedure("sp_UpsertParcel", {
            id,
            senderId,
            receiverId,
            senderLocation,
            destination,
            weight,
            status: 'Pending'
        })

        const parcelId = result.recordset[0].id
        const message = id ? "Parcel updated successfully" : "Parcel created successfully"

        const receiverResult = await executeStoredProcedure("sp_GetUserById", { id: receiverId });
        const receiverPhone = receiverResult.recordset[0].phone;

        if (receiverPhone) {
            await sendSMS(receiverPhone, `Hello! A parcel (ID: ${parcelId}) has been sent to you. Track it on Send-It.`);
        }
        
        res.status(id ? 200 : 201).json({ message, parcelId })
    } catch (error) {
        res.status(500).json({ message: "Error upserting parcel", error: error.message })
    }
}

exports.adminCreateParcel = async (req, res) => {
    const { senderId, receiverId, senderLocation, destination, weight, adminId } = req.body
    // const adminId = req.userData.userId

    try {
        const result = await executeStoredProcedure("sp_AdminCreateParcel", {
            adminId,
            senderId,
            receiverId,
            senderLocation,
            destination,
            weight
        })

        const parcelId = result.recordset[0].id
        res.status(201).json({ message: "Parcel created by admin successfully", parcelId })
    } catch (error) {
        res.status(403).json({ message: "Admin privileges required", error: error.message })
    }
}

exports.updateParcelStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await executeStoredProcedure("sp_UpdateParcelStatus", {
            id,
            status
        })
        res.json({ message: "Parcel status updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error updating parcel status", error: error.message })
    }
}

exports.getParcels = async (req, res) => {
    try {
        const result = await executeStoredProcedure("sp_GetParcelsByUser", {
            page: 1,
            pageSize: 100,
            userId: req.userData.userId
        })
        res.json(result.recordset)
    } catch (error) {
        res.status(500).json({ message: "Error fetching parcels", error: error.message })
    }
}

exports.softDeleteParcel = async (req, res) => {
    const { id } = req.params

    try {
        await executeStoredProcedure("sp_SoftDeleteParcel", {
            id,
            userId: req.userData.userId
        })
        res.json({ message: "Parcel deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting parcel", error: error.message })
    }
}

exports.getAllParcels = async (req, res) => {
    try {
        const result = await executeStoredProcedure("sp_GetAllParcels", {
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 100,
            status: req.query.status
        })
        
        res.json({
            total: result.recordsets[0][0].totalParcels,
            parcels: result.recordsets[1].map(p => ({
                ...p,
                senderId: p.senderId,
                receiverId: p.receiverId,
                senderLocation: p.senderLocation,
                destination: p.destination
            }))
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching parcels", error: error.message })
    }
}

exports.calculateShipping = async (req, res) => {
    const { senderLocation, destination } = req.body;
    
    try {
        const [senderCoords, destCoords] = await Promise.all([
            getLocationCoordinates(senderLocation),
            getLocationCoordinates(destination)
        ]);

        const distance = calculateHaversineDistance(
            senderCoords.latitude, senderCoords.longitude,
            destCoords.latitude, destCoords.longitude
        );

        const rate = 2.5; // $2.5 per kilometer
        const amount = distance * rate;

        res.json({ distance: parseFloat(distance.toFixed(2)), amount: parseFloat(amount.toFixed(2)) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Haversine formula implementation
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

exports.getParcelById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await executeStoredProcedure("sp_GetParcelById", {
            id: parseInt(id)
        });
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: "Parcel not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};