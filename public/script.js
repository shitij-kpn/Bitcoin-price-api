const socket = io('https://shitij.herokuapp.com');
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
  let allRows = '';
  for (i in data) {
    allRows += `<tr class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-50 rounded-md border-b border-gray-600"><td class="px-4 py-3">${
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
    body.classList.add('dark');
    body.classList.remove('light');
  } else {
    this.checked = false;
    body.classList.add('light');
    body.classList.remove('dark');
  }
});
