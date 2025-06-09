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

function renderRow(item, index) {
  const [name, k1, k2, k3, k4, price, image, fullPrice] = item;
  const row = document.createElement('tr');

  const createInputCell = () => {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.value = 0;
    input.classList.add('form-control', 'quantity-input');
    input.addEventListener('input', recalculateTotals);
    cell.appendChild(input);
    return cell;
  };

  const imgCell = document.createElement('td');
  imgCell.innerHTML = `<div>${name}</div><img src="${image}" alt="${name}" style="width:150px;height:auto;">`;
  row.appendChild(imgCell);

  row.appendChild(createInputCell());
  row.appendChild(createInputCell());
  row.appendChild(createInputCell());
  row.appendChild(createInputCell());

  const priceCell = document.createElement('td');
  priceCell.textContent = formatNumber(price);
  row.appendChild(priceCell);

  const totalCell = document.createElement('td');
  totalCell.classList.add('item-total');
  totalCell.textContent = '0';
  row.appendChild(totalCell);

  row.dataset.index = index;
  row.dataset.k1 = parseFloat(k1);
  row.dataset.k2 = parseFloat(k2);
  row.dataset.k3 = parseFloat(k3);
  row.dataset.k4 = parseFloat(k4);
  row.dataset.price = parseFloat(price);
  row.dataset.fullPrice = parseFloat(fullPrice);

  return row;
}

function recalculateTotals() {
  let total = 0;
  let fullRevenue = 0;
  document.querySelectorAll('#table-body tr').forEach(row => {
    const inputs = row.querySelectorAll('input');
    const [q1, q2, q3, q4] = Array.from(inputs).map(input => parseInt(input.value) || 0);
    const price = parseFloat(row.dataset.price);
    const full = parseFloat(row.dataset.fullPrice);
    const subtotal =
      q1 * price * parseFloat(row.dataset.k1) +
      q2 * price * parseFloat(row.dataset.k2) +
      q3 * price * parseFloat(row.dataset.k3) +
      q4 * price * parseFloat(row.dataset.k4);
    const revenue =
      q1 * full * parseFloat(row.dataset.k1) +
      q2 * full * parseFloat(row.dataset.k2) +
      q3 * full * parseFloat(row.dataset.k3) +
      q4 * full * parseFloat(row.dataset.k4);

    row.querySelector('.item-total').textContent = formatNumber(subtotal.toFixed(0));
    total += subtotal;
    fullRevenue += revenue;
  });

  document.getElementById('total-sum').textContent = formatNumber(total.toFixed(0));
  document.getElementById('total-revenue').textContent = formatNumber((fullRevenue - total).toFixed(0));
}

document.getElementById("reset-button").addEventListener("click", () => {
  document.querySelectorAll(".quantity-input").forEach(input => input.value = 0);
  recalculateTotals();
});

fetchSheetData().then(items => {
  const tableBody = document.getElementById('table-body');
  items.forEach((item, index) => {
    const row = renderRow(item, index);
    tableBody.appendChild(row);
  });
});
