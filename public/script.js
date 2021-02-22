const socket = io('http://localhost:8090');
const tableRows = document.querySelector('tbody');
const timer = document.querySelector('#timer');
const checkbox = document.querySelector('input[name=themeChange]');
const body = document.querySelector('body');

let counter;

const addCommasToNumbers = (num) => {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

socket.on('connect', () => {
  console.log('connected to the socket');
});

socket.on('timer', (res) => {
  counter = res.timer;
  timer.innerHTML = counter;
});

const renderData = ({ data }) => {
  const string =
    '<tr class="bg-gray-700 rounded-md border-b border-gray-600"><td class="px-4 py-3">${index}</td><td class="px-4 py-3">${item.platform}</td><td class="px-4 py-3">₹${item.last}</td><td class="px-4 py-3">₹${item.buy}</td><td class="px-4 py-3"></td><td class="px-4 py-3"></td></tr>';
  let allRows = '';
  for (i in data) {
    allRows += `<tr class="bg-gray-700 rounded-md border-b border-gray-600"><td class="px-4 py-3">${
      Number(i) + 1
    }</td><td class="px-4 py-3">${
      data[i].platform
    }</td><td class="px-4 py-3">₹ ${
      '  ' + addCommasToNumbers(data[i].last)
    }</td><td class="px-4 py-3">₹ ${'  ' + addCommasToNumbers(data[i].buy)}/₹ ${
      ' ' + addCommasToNumbers(data[i].sell)
    }</td><td class="px-4 py-3">${
      '  ' + addCommasToNumbers(data[i].difference)
    } %</td><td class="px-4 py-3">₹ ${
      '  ' + addCommasToNumbers(data[i].savings)
    }</td></tr>`;
  }
  tableRows.innerHTML = allRows;
};

socket.on('newData', (res) => {
  renderData(res);
});

checkbox.addEventListener('change', function () {
  if (this.checked) {
    this.checked = true;
    console.log('going dark');
    body.classList.add('dark');
    body.classList.remove('light');
  } else {
    this.checked = false;
    console.log('going light');
    body.classList.add('light');
    body.classList.remove('dark');
  }
});
