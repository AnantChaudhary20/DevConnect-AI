const userRepository = require("../repositories/userRepository");

const ALLOWED_LOCATIONS = [
    "New Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Chandigarh", "Dehradun", "Agra", "Noida", "Gurugram", "Indore", "Bhopal", "Kochi", "Patna", "Bhubaneswar", "Remote", "Other"
];

const updateProfile = async (userId, profileData) => {
    const cleanData = {
        name: String(profileData.name || "").trim(),
        bio: String(profileData.bio || "").trim(),
        skills: Array.isArray(profileData.skills) ? profileData.skills.map((value) => String(value).trim()).filter(Boolean) : [],
        github: String(profileData.github || "").trim(),
        linkedin: String(profileData.linkedin || "").trim(),
        portfolio: String(profileData.portfolio || "").trim(),
        location: String(profileData.location || "").trim()
    };
    if (!cleanData.name) { const e = new Error("Name is required."); e.statusCode = 400; throw e; }
    if (!ALLOWED_LOCATIONS.includes(cleanData.location)) { const e = new Error("Please select a valid location from the list."); e.statusCode = 400; throw e; }
    if (cleanData.github && !/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(cleanData.github)) { const e = new Error("GitHub URL must be https://github.com/username"); e.statusCode = 400; throw e; }
    if (cleanData.linkedin && !/^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9._-]+\/?$/.test(cleanData.linkedin)) { const e = new Error("LinkedIn URL must be https://www.linkedin.com/in/username"); e.statusCode = 400; throw e; }
    const updatedUser = await userRepository.updateProfile(userId, cleanData);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

const getProfile = async (userId) => {
    const user = await userRepository.findByIdWithoutPassword(userId);
    if (!user) throw new Error("User not found");
    return user;
};

const toggleFollow = async (currentUserId, targetUserId) => {
    const currentUser = await userRepository.findUserWithFollowers(currentUserId);
    const targetUser = await userRepository.findUserWithFollowers(targetUserId);
    if (!targetUser) throw new Error("User not found");
    if (currentUserId === targetUserId) { const e = new Error("You cannot follow yourself."); e.statusCode = 400; throw e; }
    const alreadyFollowing = currentUser.following.some((id) => id.toString() === targetUserId);
    if (alreadyFollowing) {
        currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
        await userRepository.save(currentUser); await userRepository.save(targetUser);
        return { message: "User unfollowed.", following: currentUser.following.length };
    }
    currentUser.following.push(targetUserId); targetUser.followers.push(currentUserId);
    await userRepository.save(currentUser); await userRepository.save(targetUser);
    return { message: "User followed.", following: currentUser.following.length };
};

module.exports = { ALLOWED_LOCATIONS, getProfile, updateProfile, toggleFollow };
