const Member = require("../Models/MemberModel"); // Import your Member model here
const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require("../Models/CommunityModel");
const User = require("../Models/UserModel");

// Function to generate a Snowflake ID
const generateSnowflake = () => {
  return Snowflake.generate();
};

const MemberControllers = {
  addMember: async (req, res) => {
    const { community, role, user } = req.body;
    const userAdmin = req.user;

    try {
      // Check if the current user is the owner of the community
      const isOwner = await Community.findOne({
        id: community,
        owner: req.user, // Assuming you have the user's ID in req.user
      });

      if (!isOwner) {
        return res.status(403).json({
          status: false,
          message:
            "You do not have permission to add a member to this community.",
        });
      }

      console.log("Found the owner! " + isOwner);

      // Check if the user to be added exists
      const existingUser = await User.findOne({ id: user });

      if (!existingUser) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }

      // Create a new member
      const newMember = new Member({
        community,
        user,
        role,
      });

      console.log(newMember);

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
    try {
      const id  = req.params.id; // Assuming you're extracting member ID from the route parameters
      const userAdmin = req.user; // Assuming req.user is the user ID
      const memberId = id;
      console.log("member id : " + id)
      // Find the member details by ID
      const memberToDelete = await Member.findOne({ id: id });

      if (!memberToDelete) {
        return res.status(404).json({
          status: false,
          message: "Member not found.",
        });
      }

      // Query the Community table to check if the userAdmin is the owner of the community
      const isOwner = await Community.findOne({
        id: memberToDelete.community, // Assuming the community ID is stored in the member document
        owner: userAdmin,
      });

      if (!isOwner) {
        return res.status(403).json({
          status: false,
          message:
            "You do not have permission to delete a member from this community.",
        });
      }

      // Delete the member based on the custom ID
      await Member.findOneAndDelete({ id: memberId });

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
