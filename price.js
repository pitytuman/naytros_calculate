const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVCL2g2pNJ9eS_RkbG3lBt6aQFSAdWlB_9cvM90SiOFaHXD1cXL1Qmm6E5w8-tuITducUUUnRE79mV/pub?gid=0&single=true&output=csv';

const formatNumber = (num) => Number(num).toLocaleString('ru-RU');

function fetchSheetData() {
  return fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split('\n').map(row => row.split(','));
      rows.shift(); // remove header
      return rows;
    });
}

function createItemCard([name, , , , , price, imgUrl]) {
  const col = document.createElement('div');
  col.className = 'col-1-10';

  col.innerHTML = `
    <div class="bg-secondary text-light text-center p-2 rounded" style="font-size: 0.7rem;">
      <img src="${imgUrl}" class="img-fluid mb-1" style="height:40px; object-fit:contain;" alt="${name}">
      <div class="fw-bold">${formatNumber(price)} ₽</div>
      <div>${name}</div>
    </div>
  `;
  return col;
}

fetchSheetData().then(items => {
  const container = document.getElementById('price-container');
  items.forEach(item => {
    container.appendChild(createItemCard(item));
  });
});
