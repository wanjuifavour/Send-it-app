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
const authenticate = require("../middlewares/auth")

router.post("/upsert", /*validateParcelCreation,*/ upsertParcel)
router.post("/admin/create", validateParcelCreation, adminCreateParcel)
router.put("/:id/status", updateParcelStatus)
router.get("/", authenticate, getParcels)
router.get("/all", getAllParcels)
router.delete("/:id", softDeleteParcel)

module.exports = router