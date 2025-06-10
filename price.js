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
  col.className = 'col-1-8 d-flex';

  col.innerHTML = `
    <div class="item-card w-100">
      <img src="${imgUrl}" alt="${name}" class="img-fluid">
      <div class="item-name">${name}</div>
      <div class="item-price">${formatNumber(price)} ₽</div>
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
