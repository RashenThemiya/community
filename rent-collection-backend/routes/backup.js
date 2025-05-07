const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// 1. Dump MySQL Database
function dumpDatabase() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `db_backup_${timestamp}.sql`;
    const backupDir = path.join(__dirname, '../backup');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const filePath = path.join(backupDir, fileName);
    const command = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p"${process.env.DB_PASS}" ${process.env.DB_NAME} > "${filePath}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

// 2. Upload to Google Drive
async function uploadToDrive(filePath) {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../config/credentials.json'), // Or use process.env.GOOGLE_DRIVE_KEY_PATH
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: path.basename(filePath),
  };

  const media = {
    mimeType: 'application/sql',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });

  return response.data.id;
}

// 3. Backup route: dump DB, upload to Drive, and download
router.post(
  '/backup',
  authenticateUser,
  authorizeRole(['admin', 'superadmin']),
  async (req, res) => {
    try {
      // Step 1: Dump the DB to a file
      const filePath = await dumpDatabase();

      // Step 2: Upload to Google Drive
      await uploadToDrive(filePath);

      // Step 3: Serve the file to the client as download
      res.download(filePath, path.basename(filePath), (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).send('Failed to download the file.');
        }

        // Cleanup: Delete file after download (optional)
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete temp backup:', err);
        });
      });
    } catch (err) {
      console.error('Backup error:', err);
      res.status(500).json({
        message: 'Backup failed',
        error: err.message,
      });
    }
  }
);

module.exports = router;
