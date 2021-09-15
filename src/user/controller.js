const { getUser } = require('./service');

const getAllUser = async (req, res) => {
    try {
        const result = await getUser();
        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    getAllUser,
}