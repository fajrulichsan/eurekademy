const { Profile } = require('../models/ProfileModels'); // Pastikan path sesuai dengan struktur aplikasi Anda

// Controller untuk mendapatkan profil berdasarkan userId
exports.getProfileByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.createProfile = async (req, res) =>{
    try{
        const data = req.body;
        data.id = new Date().getTime();

        const existingProfile = await Profile.findOne({ where: { userId: data.userId } });
        if (existingProfile) {
            return res.status(400).json({ status: "Error", message: "Profile with the same userId already exists" });
        }
        

        await Profile.create(data)
        res.status(201).json({status : "Success" , message : "Profile created"})

    } catch (error) {
        console.log("Error getting profile :", error );
        res.status(500).json({message: "Internal Server Error"});
    }
}

// Controller untuk mengupdate profil
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update profil dengan data baru
        await profile.update(updatedData);

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

