const ftp = require('basic-ftp');

async function uploadToFTP(localPath, remotePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
    });
    await client.uploadFrom(localPath, remotePath);
  } catch (err) {
    console.error(err);
  }
  client.close();
}

module.exports = uploadToFTP;
