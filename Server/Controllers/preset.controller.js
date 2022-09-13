const db = require("../Models")
const Preset = db.preset

const dbLinks = require("../config/db.config")
const { appointment } = require("../Models")

exports.create = (req, res) => {
    const preset = new Preset({
        preset: req.body.preset,
        _active: true

    })
    preset
        .save(preset)
        .then(appData => {
            //SMS API
            res.send(appData)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Preset."
            })
        })
}

exports.findAll = (req, res) => {
    Preset.find()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving presets."
            })
        })
}

exports.PresetFromId = (req, res) => {
    const preId = req.params.pId

    Preset.find({ _id: preId })
        .then(data => {
            let preset = {
                preset: data[0].preset,
                _active:data[0]._active,
            };
            res.send(preset)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving presets."
            })
        })
}

exports.findAllActive = (req, res) => {
    Preset.find({ _active: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Presets.",
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const preId = req.params.pId;

    Preset.findOneAndUpdate({ _id: preId }, { $set: req.body })
    .then(data => {

    if (data) {
    res.send(true);

    } else 
        res.status(404).send({
            message: `Cannot update preset with id=${preId}`,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: `Error updating preset with id=${preId}`
         });
    });
};


exports.DeleteFromPresetId = (req, res) => {
    const Id = req.params.pId

    Preset.findByIdAndUpdate({ _id: Id }, { $set: { _active: false } })
        .then(data => {

            if (data) {
                res.send(true)

            } else res.status(404).send({
                message: `Cannot delete preset with id=${Id}. Maybe preset was not found!`
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err
            })
        })
}


exports.SearchAppWithDate = (req, res) => {
    let appvar = {}
    let appDet = []
    var dateTimeAfter = req.params.dateTimeAfter
    var dateTimeBefore = req.params.dateTimeBefore
    //dateTimeAfter.setDate(dateTimeAfter.getDate())
    console.log(dateTimeAfter)
    Appointment.find({
        date: {
            $gte: dateTimeBefore,
            $lte: dateTimeAfter
        },
            _active: true
        })
        .then((data) => {
            console.log(data);
            data.forEach(app => {
                appvar = {
                    patName: app.patName,
                    phoneNumber:app.phoneNumber,
                    date:app.date,
                    address:app.address,
                    nic:app.nic,
                    doctor:app.doctor,
                    treatment:app.treatment,
                    amount:app.amount,
                    appId : app.appId,
                    aId : app._id,
                    attended: app.attended,
                    _active:app._active,
                }
                appDet.push(appvar)
            })
            res.send(appDet)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving appointments.",
            })
        })
}

exports.findAllAttended = (req, res) => {
    Appointment.find({ attended: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Appointments.",
            });
        });
};

exports.updateTheAttendedStatus = (req, res) => {

    const appId = req.params.aId
    const amount = req.params.amount

    Appointment.findOneAndUpdate({ _id: appId },{ $set: { attended: true ,amount:amount}})
    .then(data => {

    if (data) {
    res.send(true);

    } else 
        res.status(404).send({
            message: `Cannot update appointment with id=${appId}`,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: `Error updating appointment with id=${appId}`
         });
    });
};

exports.appointmentRevenue = (req, res) => {
    revenueCount = {}

    var endDate = new Date(req.params.endDate)
    endDate.setDate(endDate.getDate() + 1)
    console.log(endDate)
    Appointment.find({
        date: {
            $gte: new Date(req.params.startDate),
            $lt: endDate
        },
            attended: true
        })
        .then((data) => {
            data.forEach(revenue => {
                console.log(revenue)
                // console.log("A revenue of " + revenue.amount + "has happened in " + revenue.brandName)
                // revenueCount[revenue.brandName] = revenueCount[revenue.brandName] ? revenueCount[revenue.brandName] + revenue.discPrice * revenue.qty : revenue.discPrice * revenue.qty

            })
            res.send(revenueCount)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error with report"
            })
        })
}