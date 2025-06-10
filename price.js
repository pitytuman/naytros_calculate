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

function createItemCell([name, , , , , price, imgUrl]) {
  const wrapper = document.createElement('td');
  wrapper.innerHTML = `
    <div><img src="${imgUrl}" alt="${name}" style="width:50px; height:auto;" /></div>
    <div>${name}</div>
    <div class="text-info fw-bold">${formatNumber(price)} ₽</div>
  `;
  return wrapper;
}

fetchSheetData().then(items => {
  const tbody = document.getElementById('price-body');
  for (let i = 0; i < items.length; i += 2) {
    const row = document.createElement('tr');
    const item1 = createItemCell(items[i]);
    const item2 = items[i + 1] ? createItemCell(items[i + 1]) : document.createElement('td');
    row.appendChild(item1);
    row.appendChild(item2);
    tbody.appendChild(row);
  }
});
