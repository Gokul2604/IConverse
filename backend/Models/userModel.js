const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        pic:{type:String, required:true, default:"https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="},
    }, {
        timestamps:true,
    }
);

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if(!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;