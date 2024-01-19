import * as puppeteer from 'puppeteer';

async function scrapeTable(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const table = await page.$eval('figure.wp-block-table table', (table) => {
    const rows = table.querySelectorAll('tr');
    const data = [];

    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll('td, th').forEach((cell) => {
        rowData.push(cell.textContent.trim());
      });
      data.push(rowData);
    });

    return data;
  });

  await browser.close();
  return table;
}

const url = 'https://www.icy-veins.com/d4/guides/twisting-blades-rogue-leveling-build/'; // Reemplaza con la URL de la página que deseas analizar
scrapeTable(url)
  .then((tableData) => {
    console.log(JSON.stringify(tableData, null, 2));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
