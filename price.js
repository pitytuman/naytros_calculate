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
  col.className = 'col-6 col-sm-4 col-md-3 col-lg-2';
  col.innerHTML = `
    <div class="card bg-secondary text-light h-100 text-center p-2">
      <img src="${imgUrl}" class="card-img-top mx-auto" style="height:60px; object-fit:contain;" alt="${name}">
      <div class="card-body p-2">
        <h6 class="card-title small">${name}</h6>
        <p class="card-text text-info fw-bold mb-0">${formatNumber(price)} ₽</p>
      </div>
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
