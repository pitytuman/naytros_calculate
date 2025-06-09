const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVCL2g2pNJ9eS_RkbG3lBt6aQFSAdWlB_9cvM90SiOFaHXD1cXL1Qmm6E5w8-tuITducUUUnRE79mV/pub?gid=0&single=true&output=csv';

async function fetchSheetData() {
  const response = await fetch(SHEET_URL);
  const text = await response.text();
  const rows = text.trim().split('\n').map(row => row.split(','));
  return rows.slice(1).map(cols => ({
    name: cols[0],
    coef1: parseFloat(cols[1]),
    coef2: parseFloat(cols[2]),
    coef3: parseFloat(cols[3]),
    coef4: parseFloat(cols[4]),
    price: parseFloat(cols[5]),
    image: cols[6],
    fullPrice: parseFloat(cols[7])
  }));
}

function createCalculatorTable(items) {
  const container = document.getElementById('table-container');
  const table = document.createElement('table');
  const header = `
    <thead>
      <tr>
        <th>Изображение и название</th>
        <th>Нетронутый</th>
        <th>Поношеный</th>
        <th>Поврежденный</th>
        <th>Сильно поврежденный</th>
        <th>Цена</th>
        <th>Итог</th>
      </tr>
    </thead>
  `;

  const body = document.createElement('tbody');

  items.forEach((item, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><div>${item.name}</div><img src="${item.image}" /></td>
      <td><input type="number" min="0" data-index="${idx}" data-type="1" value="0"/></td>
      <td><input type="number" min="0" data-index="${idx}" data-type="2" value="0"/></td>
      <td><input type="number" min="0" data-index="${idx}" data-type="3" value="0"/></td>
      <td><input type="number" min="0" data-index="${idx}" data-type="4" value="0"/></td>
      <td>${item.price}</td>
      <td id="sum-${idx}">0</td>
    `;
    body.appendChild(row);
  });

  const footer = `
    <tfoot>
      <tr>
        <td colspan="6">ИТОГО</td>
        <td id="total">0</td>
      </tr>
      <tr>
        <td colspan="6">ВЫРУЧКА</td>
        <td id="revenue">0</td>
      </tr>
    </tfoot>
  `;

  table.innerHTML = header;
  table.appendChild(body);
  table.insertAdjacentHTML('beforeend', footer);
  container.innerHTML = '';
  container.appendChild(table);

  document.querySelectorAll('input[type="number"]').forEach(input =>
    input.addEventListener('input', () => calculate(items))
  );
}

function calculate(items) {
  let total = 0;
  let revenue = 0;

  items.forEach((item, idx) => {
    const counts = [1, 2, 3, 4].map(i =>
      parseInt(document.querySelector(`input[data-index="${idx}"][data-type="${i}"]`).value) || 0
    );

    const coefs = [item.coef1, item.coef2, item.coef3, item.coef4];
    const partials = counts.map((count, i) => count * item.price * coefs[i]);
    const fulls = counts.map((count, i) => count * item.fullPrice * coefs[i]);

    const sum = partials.reduce((a, b) => a + b, 0);
    const fullSum = fulls.reduce((a, b) => a + b, 0);

    document.getElementById(`sum-${idx}`).innerText = sum.toFixed(2);
    total += sum;
    revenue += fullSum;
  });

  document.getElementById('total').innerText = total.toFixed(2);
  document.getElementById('revenue').innerText = (revenue - total).toFixed(2);
}

fetchSheetData().then(createCalculatorTable);
