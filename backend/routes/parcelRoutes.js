const express = require("express")
const router = express.Router()
const {
    upsertParcel,
    updateParcelStatus,
    getParcels,
    adminCreateParcel,
    softDeleteParcel,
    getAllParcels,
} = require("../controllers/parcelController")
const { validateParcelCreation } = require("../middlewares/validation")

router.post("/upsert", /*validateParcelCreation,*/ upsertParcel)
router.post("/admin/create", validateParcelCreation, adminCreateParcel)
router.put("/:id/status", updateParcelStatus)
router.get("/", getParcels)
router.get("/all", getAllParcels)
router.delete("/:id", softDeleteParcel)

module.exports = router