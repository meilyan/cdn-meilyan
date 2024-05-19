const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const Image = require('../models/Image');
const uploadToFTP = require('../utils/ftpUpload');

exports.uploadImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;
        const compressedPath = path.join('uploads', 'compressed_' + file.filename);

        console.log('Compressing image...');
        await sharp(file.path)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile(compressedPath);

        console.log('Uploading to FTP...');
        await uploadToFTP(compressedPath, `${process.env.FTP_PATH}/${file.filename}`);
        const imageUrl = `https://img.meilyan.online/${file.filename}`;
        console.log('Creating database entry...');
        const image = await Image.create({ userId, url: imageUrl, filename: file.filename });

        // Adding a delay before deleting the file
        setTimeout(async () => {
            try {
                await fs.unlink(file.path);
                await fs.unlink(compressedPath);
                console.log('Files deleted successfully.');
            } catch (deleteError) {
                console.error('Error deleting files:', deleteError);
            }
        }, 1000); // 1 second delay

        res.status(201).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Error during image upload:', error);
        res.status(500).json({ error: error.message });
    }
};
