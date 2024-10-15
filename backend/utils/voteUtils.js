const sharp = require('sharp'); // Use Sharp for image processing
const db = require('../config/db'); // Adjust this based on your database setup

function visualCryptography(secret) {
    const shares = [];
    const binary = secret.toString(2).padStart(8, '0');

    for (let i = 0; i < binary.length; i++) {
        const bit = binary[i];
        const share1 = bit === '0' ? Math.round(Math.random()) : 1;
        const share2 = bit === '0' ? 1 - share1 : 1;

        shares.push({ share1, share2 });
    }

    return shares;
}

function encryptVote(share) {
    return Buffer.from(share).toString('base64');
}

async function embedInImage(imagePath, share1) {
    const image = await sharp(imagePath).toBuffer();
    const newImage = Buffer.from(image); // Clone the original image

    // Embed the share in the image
    for (let i = 0; i < share1.length; i++) {
        newImage[i] = (newImage[i] & 0xFE) | share1[i]; // Modify the pixel value
    }

    const stegoImagePath = `uploads/stego_${Date.now()}.png`;
    await sharp(newImage).toFile(stegoImagePath);
    return stegoImagePath;
}

async function saveVoteToDB(userId, encryptedVote, stegoImagePath) {
    await db.query('UPDATE votes SET encrypted_vote = $1, image_path = $2 WHERE user_id = $3', 
                   [encryptedVote, stegoImagePath, userId]);
}

async function countVotes() {
    const votes = await db.query('SELECT encrypted_vote, image_path FROM votes');
    const voteCounts = {};

    for (const vote of votes.rows) {
        const share1 = await extractFromImage(vote.image_path);
        const decryptedShare2 = decryptVote(vote.encrypted_vote);

        const candidateId = parseInt(share1, 2) ^ parseInt(decryptedShare2, 2);
        voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
    }

    return voteCounts;
}

function decryptVote(encryptedVote) {
    return Buffer.from(encryptedVote, 'base64').toString('utf-8');
}

async function extractFromImage(imagePath) {
    const image = await sharp(imagePath).raw().ensureAlpha();
    const data = await image.toBuffer({ resolveWithObject: true });
    let share = '';

    for (let i = 0; i < data.info.width * data.info.height; i++) {
        const pixel = data.data[i * 4]; // Get the red channel (or any channel)
        const bit = pixel & 0x01; // Get the least significant bit
        share += bit.toString();
    }

    return share;
}

module.exports = { visualCryptography, encryptVote, embedInImage, saveVoteToDB, countVotes };
