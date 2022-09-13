module.exports = (mongoose) => {

    var schema = mongoose.Schema({

        preset: String,
        _active: Boolean
    })


    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.pId = _id
        return object
    })

    const Preset = mongoose.model("Preset", schema, "Preset")
    return Preset
}