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