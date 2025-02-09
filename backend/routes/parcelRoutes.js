const express = require("express")
const router = express.Router()
const {
    upsertParcel,
    updateParcelStatus,
    getParcels,
    adminCreateParcel,
    softDeleteParcel,
} = require("../controllers/parcelController")
const auth = require("../middlewares/auth")
const { validateParcelCreation } = require("../middlewares/validation")

router.post("/upsert", auth, validateParcelCreation, upsertParcel)
router.post("/admin/create", auth, validateParcelCreation, adminCreateParcel)
router.put("/:id/status", auth, updateParcelStatus)
router.get("/", auth, getParcels)
router.delete("/:id", auth, softDeleteParcel)

module.exports = router