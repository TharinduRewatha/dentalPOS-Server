module.exports = (app) => {
    const preset = require("../Controllers/preset.controller")

    var router = require("express").Router()

    router.post("/",preset.create)

    router.delete("/:pId", preset.DeleteFromPresetId)

    router.put("/:pId", preset.update)

    router.get("/", preset.findAllActive)

    router.get("/all", preset.findAll)

    app.use("/api/appointment", router)
};