const express = require("express")
const router = express.Router()
const {
    upsertParcel,
    updateParcelStatus,
    getParcels,
    adminCreateParcel,
    softDeleteParcel,
} = require("../controllers/parcelController")
const { validateParcelCreation } = require("../middlewares/validation")

router.post("/upsert", validateParcelCreation, upsertParcel)
router.post("/admin/create", validateParcelCreation, adminCreateParcel)
router.put("/:id/status", updateParcelStatus)
router.get("/", getParcels)
router.delete("/:id", softDeleteParcel)

module.exports = router