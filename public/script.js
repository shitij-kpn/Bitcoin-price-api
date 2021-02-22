const socket = io('http://localhost:8090');

const tableRows = document.querySelector('tbody');

socket.on('connect', () => {
  console.log(socket.id);
});

const addCommasToNumbers = (num) => {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

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
