const User = require("../models/User");

const findById = async (id) => {
    return await User.findById(id);
};

const findByIdWithoutPassword = async (id) => {
    return await User.findById(id).select("-password");
};

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const updateById = async (id, updateData) => {
    return await User.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};

const saveUser = async (user) => {
    return await user.save();
};
const updateProfile = async (userId, data) => {

    return await User.findByIdAndUpdate(

        userId,

        data,

        {
            new: true,
            runValidators: true
        }

    ).select("-password");

};
const findUserWithFollowers = async (id) => {

    return await User.findById(id);

};

const save = async (user) => {

    return await user.save();

};
module.exports = {

    findById,
    findByIdWithoutPassword,
    findByEmail,
    createUser,
    updateById,
    updateProfile,
    saveUser,

    findUserWithFollowers,
    save

};