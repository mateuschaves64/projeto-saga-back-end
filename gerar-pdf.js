import puppeteer from 'puppeteer';
import { pathToFileURL } from 'url';
import path from 'path';

const arquivo = path.resolve('relatorio/test-report.html');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(arquivo).href, { waitUntil: 'networkidle0' });
await page.pdf({
  path: 'relatorio/relatorio-testes.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
});
await browser.close();