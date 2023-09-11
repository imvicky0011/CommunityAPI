// const {getRole, createRole} = require("../Controllers/RoleControllers")
const Role = require("../Models/RoleModel")

const RoleControllers = {
    getRole: async (req, res) => {
        try {
            // Query all roles from the database
            const roles = await Role.find();
    
            // Prepare the response object
            const response = {
                status: true,
                content: {
                    meta: {
                        total: roles.length,
                        pages: 1,
                        page: 1,
                    },
                    data: roles.map((role) => ({
                        id: role.id,
                        name: role.name,
                        created_at: role.created_at, // Assuming you have created_at and updated_at fields in your schema
                        updated_at: role.updated_at,
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

    createRole: async (req, res) => {
        
        try {
            const {name} = req.body
            const newRole = new Role({
                name
            })

            await newRole.save()
            
            return res.status(201).json({
                newRole,
                message: "Role created Successfully!"
            })
        }
        catch (err) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            })
        }
    }
}

module.exports = RoleControllers