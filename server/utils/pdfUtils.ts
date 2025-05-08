import fs from 'fs';
import path from 'path';

export async function parsePdf(pdfBuffer: Buffer) {
  try {
    // Create test directory structure dynamically if that's necessary
    const testDir = path.join(process.cwd(), 'test/data');
    const testFile = path.join(testDir, '05-versions-space.pdf');

    // Create directories if they don't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create empty test file if it doesn't exist
    if (!fs.existsSync(testFile)) {
      fs.writeFileSync(
        testFile,
        '%PDF-1.3\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
      );
    }

    // Now import pdf-parse when test file is ready
    const pdfParse = (await import('pdf-parse')).default;
    return await pdfParse(pdfBuffer);
  } catch (err) {
    console.error('Error in parsePdf:', err);
    throw err;
  }
}
