const userRepository = require("../repositories/userRepository");

const getProfile = async (userId) => {

    const user = await userRepository.findByIdWithoutPassword(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};
const updateProfile = async (userId, profileData) => {

    const updatedUser = await userRepository.updateProfile(
        userId,
        profileData
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser;

};
const toggleFollow = async (currentUserId, targetUserId) => {

    const currentUser = await userRepository.findUserWithFollowers(currentUserId);

    const targetUser = await userRepository.findUserWithFollowers(targetUserId);

    if (!targetUser) {

        throw new Error("User not found");

    }

    if (currentUserId === targetUserId) {

        throw new Error("You cannot follow yourself.");

    }

    const alreadyFollowing = currentUser.following.some(

        id => id.toString() === targetUserId

    );

    if (alreadyFollowing) {

        currentUser.following = currentUser.following.filter(

            id => id.toString() !== targetUserId

        );

        targetUser.followers = targetUser.followers.filter(

            id => id.toString() !== currentUserId

        );

        await userRepository.save(currentUser);

        await userRepository.save(targetUser);

        return {

            message: "User unfollowed.",

            following: currentUser.following.length

        };

    }

    currentUser.following.push(targetUserId);

    targetUser.followers.push(currentUserId);

    await userRepository.save(currentUser);

    await userRepository.save(targetUser);

    return {

        message: "User followed.",

        following: currentUser.following.length

    };

};
module.exports = {
    getProfile,
    updateProfile,
    toggleFollow
};