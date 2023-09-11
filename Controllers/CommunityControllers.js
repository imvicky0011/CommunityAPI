// const {createCommunity, getAllCommunity, getCommunityMembers, getMyOwnedCommunity, getMyJoinedCommunity} = require("../Controllers/CommunityControllers")
const Community = require('../Models/CommunityModel'); // Import the Community model
const Member = require('../Models/MemberModel'); // Import the Member model
const User = require('../Models/UserModel'); // Import the User model
const { Snowflake } = require('@theinternetfolks/snowflake'); // Import your Snowflake library

const CommunityControllers = {
    createCommunity: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.user; // Assuming you have the user's ID in req.user
            
            const userExists = await User.exists({ id: userId });

            if (!userExists) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }

    
            // Generate a slug from the name (convert to lowercase)
            const slug = name.toLowerCase().replace(/\s+/g, '-');
    
            // Create the community document
            const community = new Community({
                name,
                slug,
                owner: userId,
            });
    
            // Save the community document to the database
            await community.save();        // Create a member document for the user as the Community Admin
            const member = new Member({
                community: community.id,
                user: userId,
                role: 'Community Admin', // Assuming you have a role field in your Member schema
            });
    
            await member.save();

    
            // Prepare the response object
            const response = {
                status: true,
                content: {
                    data: {
                        id: community.id,
                        name,
                        slug,
                        owner: userId,
                        created_at: community.created_at, // Assuming you have created_at and updated_at fields in your schema
                        updated_at: community.updated_at,
                    },
                },
            };
    
            res.status(201).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    },

    getAllCommunity: async (req, res) => {
        try {
            // Query the entire community table
            const communities = await Community.find();
    
            // Return the list of communities
            res.status(200).json(communities);
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            });
        }
    },
    
    getCommunityMembers: async (req, res) => {
        try {
            const { id } = req.params;
    
            console.log("given community id, we found all of its members")
            // Query all members of the specified community
            const members = await Member.find({community: id})
            .populate({
                path: 'user',
                select: 'id name', // Specify the fields to retrieve from the 'user' model
            })
            .populate({
                path: 'role',
                select: 'id name', // Specify the fields to retrieve from the 'role' model
            });

            console.log(members)
            // Prepare the response object
            const response = {
                status: true,
                content: {
                    meta: {
                        total: members.length,
                    },
                    data: members.map((member) => ({
                        id: member.id,
                        community: member.community.toString(), // Convert to string
                        user: {
                            id: member.user,
                            name: member.user.name
                        },
                        role: {
                            id: member.role,
                        },
                        created_at: member.created_at,
                    })),
                },
            };
    
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    },
    
    getMyOwnedCommunity: async (req, res) => {
        try {
            const { userId } = req.params;
    
            console.log("owned communities")
            
            // Query all members where the user is a "Community Member"
            const members = await Member.find({
                user: userId,
                role: 'Community Admin', // Adjust this based on your role schema
            }).populate('community', 'id name slug'); // Expand the community details
            
            
            console.log(members)
            
            // Extract the community information from the members
            const communities = members.map((member) => ({
                id: member.community.id,
                name: member.community.name,
                slug: member.community.slug,
            }));
    
            // Prepare the response object
            const response = {
                status: true,
                content: communities,
            };
    
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    },
    
    getMyJoinedCommunity: async (req, res) => {
        try {
            const { user } = req.user;

            // Query all members where the user is a "Community Member"
            const members = await Member.find({
                user: user,
                role: '7106780565537227290', // Adjust this based on your role schema
            })
            //populate('community', 'id name slug'); // Expand the community details
            
            console.log(members)
            
            console.log("members")
            

            // Extract the community information from the members
            const communities = members.map((member) => ({
                id: member.community.id,
                name: member.community.name,
                slug: member.community.slug,
            }))

            console.log("communities")
            
            console.log(communities)
            // Prepare the response object
            const response = {
                status: true,
                content: communities,
            }

            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    }
}

module.exports = CommunityControllers