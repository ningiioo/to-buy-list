// 讀取已有的清單
let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
const list = document.getElementById('itemList');

function renderList() {
  list.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item} <button onclick="removeItem(${index})">刪除</button>`;
    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();
  if (value) {
    items.push(value);
    localStorage.setItem('toBuyList', JSON.stringify(items));
    input.value = '';
    renderList();
  }
}

function removeItem(index) {
  items.splice(index, 1);
  localStorage.setItem('toBuyList', JSON.stringify(items));
  renderList();
}

renderList(); // 初次載入時顯示清單
