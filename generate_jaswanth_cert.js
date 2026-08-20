import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DOMAIN_MAP = {
  'fsd': 'Full Stack Development',
  'vlsi': 'Embedded System Development',
  'cpp': 'C++ Programming',
  'cyber': 'Cyber Security',
  'da': 'Data Analytics',
  'ds': 'Data Science',
  'uiux': 'UI/UX Designing',
  'web': 'Web Development'
};

async function createCustomCert() {
  const name = "NEKKALAPUDI JASWANTH NAGA SRI SAI RAM";
  const email = "2400030923@gmail.com";
  const password = "password123";
  const dob = "2005-01-01"; // Placeholder as not provided
  const dbDomain = "da"; // Use existing enum value for the database
  const fullDomain = "Google Cloud AIML";
  const college = "KL UNIVERSITY";
  const regNo = "2400030923";

  console.log("Creating user in Supabase Auth...");
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError && authError.message !== "User already registered") {
    console.error("Auth error:", authError);
  }

  const certId = 'Cert-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const studentId = 'Stud-' + regNo;
  const created_at = new Date('2026-07-31T10:00:00Z').toISOString();

  console.log("Inserting record into registrations table...");
  const { error: dbError } = await supabase.from('registrations').upsert([
    {
      full_name: name,
      email: email,
      password: password,
      date_of_birth: dob,
      domain: dbDomain,
      college_name: college,
      mobile_number: "0000000000",
      payment_status: 'success',
      cert_id: certId,
      student_id: studentId,
      created_at: created_at
    }
  ], { onConflict: 'email' });

  if (dbError) {
    console.error("Database error:", dbError);
    return;
  }

  console.log(`Record created! Cert ID: ${certId}`);

  console.log("Generating PDF...");
  const existingPdfBytes = fs.readFileSync('public/cert-bg-empty.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const { width, height } = page.getSize();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const primaryColor = rgb(0.05, 0.27, 0.63);
  const textColor = rgb(0.12, 0.28, 0.49);
  
  try {
    const thiranixLogoBytes = fs.readFileSync('public/thiranix-logo.png');
    const thiranixLogo = await pdfDoc.embedPng(thiranixLogoBytes);
    const tDims = thiranixLogo.scaleToFit(380, 152);
    page.drawImage(thiranixLogo, {
      x: (width - tDims.width) / 2,
      y: height - 150,
      width: tDims.width,
      height: tDims.height,
    });
  } catch (e) { console.warn("Thiranix logo skip", e.message); }
  
  try {
    const aicteLogoBytes = fs.readFileSync('public/aicte-logo.png');
    const aicteLogo = await pdfDoc.embedPng(aicteLogoBytes);
    const aDims = aicteLogo.scaleToFit(90, 80);
    page.drawImage(aicteLogo, {
      x: width - aDims.width - 40,
      y: height - 120,
      width: aDims.width,
      height: aDims.height,
    });
  } catch (e) { console.warn("AICTE logo skip", e.message); }

  const drawCenterText = (text, y, font, size, color) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color });
    return textWidth;
  };

  drawCenterText("CERTIFICATE", height - 230, timesRoman, 56, primaryColor);
  drawCenterText("OF INTERNSHIP", height - 285, timesRoman, 30, primaryColor);
  
  drawCenterText("This is to certify that", height - 350, helveticaBold, 14, textColor);
  
  let nameSize = 34;
  let nameWidth = helveticaBold.widthOfTextAtSize(name, nameSize);
  while (nameWidth > width - 100 && nameSize > 12) {
    nameSize -= 2;
    nameWidth = helveticaBold.widthOfTextAtSize(name, nameSize);
  }
  drawCenterText(name, height - 405, helveticaBold, nameSize, primaryColor);
  
  page.drawLine({
    start: { x: (width - nameWidth - 40) / 2, y: height - 420 },
    end: { x: (width + nameWidth + 40) / 2, y: height - 420 },
    thickness: 1.5,
    color: primaryColor,
  });
  
  drawCenterText(college, height - 460, helveticaBold, 20, primaryColor);
  
  drawCenterText("has successfully completed 8-weeks", height - 505, helvetica, 16, textColor);
  
  drawCenterText(fullDomain + " Virtual Internship", height - 545, helveticaBold, 20, primaryColor);
  
  // Custom Issue Date
  const issueDate = "July 31, 2026";
  drawCenterText(`Issued on: ${issueDate}`, height - 580, helvetica, 16, textColor);

  const verifyUrl = `https://thiranix.online/verify/${certId}`; 
  
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });
  const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrImageBytes = Buffer.from(qrBase64, 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  page.drawImage(qrImage, {
    x: 50,
    y: 90,
    width: 70,
    height: 70,
  });
  
  page.drawText(`Certificate ID: ${certId}`, { x: 50, y: 70, size: 10, font: helvetica, color: textColor });
  page.drawText(`Student ID: ${studentId}`, { x: 50, y: 55, size: 10, font: helvetica, color: textColor });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('NEKKALAPUDI_JASWANTH_Certificate.pdf', pdfBytes);
  console.log("Certificate saved to NEKKALAPUDI_JASWANTH_Certificate.pdf");
}

createCustomCert();
