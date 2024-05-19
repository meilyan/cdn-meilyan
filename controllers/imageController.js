const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Image = require('../models/Image');
const uploadToFTP = require('../utils/ftpUpload');

exports.uploadImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;
        const compressedPath = path.join('uploads', 'compressed_' + file.filename);

        await sharp(file.path)
            .toFormat('jpeg')
            .jpeg({quality: 80})
            .toFile(compressedPath);

        await uploadToFTP (compressedPath, `${process.env.FTP_PATH}/${file.filename}`);
        const image = await Image.create({userId, url: `${process.env.FTP_PATH}/${file.filename}`, filename: file.filename});
        
        fs.unlinkSync(file.path);
        fs.unlinkSync(compressedPath);

        res.status(201).json({message: 'Image uploaded successfully', image});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};