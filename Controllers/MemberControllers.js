const { Member } = require('../Models/MemberModel'); // Import your Member model here
const { Snowflake } = require('@theinternetfolks/snowflake');

// Function to generate a Snowflake ID
const generateSnowflake = () => {
    return Snowflake.generate();
};

const MemberControllers = {
    addMember: async (req, res) => {
        const { community, role } = req.body;
        const user = req.user

        try {
            // Check if the current user is the owner of the community
            const isOwner = await Community.findOne({
                _id: community,
                owner: req.user, // Assuming you have the user's ID in req.user
            });

            if (!isOwner) {
                return res.status(403).json({
                    status: false,
                    message: "You do not have permission to add a member to this community.",
                });
            }



            // Check if the user to be added exists
            const existingUser = await User.findById(user);

            if (!existingUser) {
                return res.status(404).json({
                    status: false,
                    message: "User not found.",
                });
            }

            // Create a new member
            const newMember = new Member({
                id: generateSnowflake(), // Generate a Snowflake ID
                community,
                user,
                role,
            });

            await newMember.save();

            return res.status(201).json({
                status: true,
                message: "Member added successfully.",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    },

    deleteMember: async (req, res) => {
        const { community, memberId } = req.body;

        try {
            // Check if the current user is the owner of the community
            const isOwner = await Community.findOne({
                _id: community,
                owner: req.user.id, // Assuming you have the user's ID in req.user
            });

            if (!isOwner) {
                return res.status(403).json({
                    status: false,
                    message: "You do not have permission to delete a member from this community.",
                });
            }

            // Check if the member to be deleted exists
            const memberToDelete = await Member.findById(memberId);

            if (!memberToDelete) {
                return res.status(404).json({
                    status: false,
                    message: "Member not found.",
                });
            }

            // Delete the member
            await Member.findByIdAndDelete(memberId);

            return res.status(200).json({
                status: true,
                message: "Member deleted successfully.",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    },
};

module.exports = MemberControllers;
