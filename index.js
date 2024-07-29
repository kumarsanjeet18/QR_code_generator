/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer
  .prompt([
    {
      type: 'input',
      message: 'Type your URL:',
      name: 'URL'
    }
  ])
  .then((answers) => {
    const url = answers.URL;
    console.log('URL:', url);

    // Generate QR code
    const qr_svg = qr.image(url, { type: 'png' });
    const qr_output_path = 'qr_img.png';

    // Save QR code as PNG file
    const qr_stream = fs.createWriteStream(qr_output_path);
    qr_svg.pipe(qr_stream);

    qr_stream.on('finish', () => {
      console.log('QR code image saved to', qr_output_path);

      // Save URL to a text file
      const url_output_path = 'URL.txt';
      fs.writeFile(url_output_path, url, (err) => {
        if (err) {
          console.error('Error writing URL to file:', err);
        } else {
          console.log('URL saved to', url_output_path);
        }
      });
    });

    qr_stream.on('error', (err) => {
      console.error('Error writing QR code image:', err);
    });
  })
  .catch((error) => {
    console.error('Error during inquirer prompt:', error);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });