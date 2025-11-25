/**
 * PDF Generation Script for Nourishing Christine Menu
 * 
 * This script uses Puppeteer to generate a beautiful PDF from the HTML menu.
 * 
 * Usage:
 * 1. Install dependencies: npm install puppeteer
 * 2. Run: node generate-pdf.js
 * 
 * The PDF will be saved as "Nourishing-Christine-Menu.pdf"
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('🌿 Starting PDF generation for Nourishing Christine Menu...');
  
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();
  
  // Load the complete HTML file
  const htmlPath = path.join(__dirname, 'nourishing-christine-menu.html');
  
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML file not found. Please ensure nourishing-christine-menu.html exists.');
    await browser.close();
    return;
  }
  
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0'
  });
  
  // Generate PDF with beautiful settings
  const pdfPath = path.join(__dirname, 'Nourishing-Christine-Menu.pdf');
  
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    displayHeaderFooter: false
  });
  
  console.log(`✅ PDF generated successfully: ${pdfPath}`);
  console.log('💚 Your menu is ready to share with Christine!');
  
  await browser.close();
}

generatePDF().catch(console.error);

