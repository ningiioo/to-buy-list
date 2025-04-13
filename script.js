// 讀取已有的清單
let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
const list = document.getElementById('itemList');

function renderList() {
  list.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');

    const itemName = document.createElement('span');
    itemName.textContent = item.name;
    itemName.style.cursor = 'pointer';
    itemName.onclick = () => addPrice(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '刪除';
    deleteBtn.onclick = () => removeItem(index);

    li.appendChild(itemName);
    li.appendChild(deleteBtn);

    // 顯示購買歷史
    if (item.history && item.history.length > 0) {
      const history = document.createElement('ul');
      history.style.marginTop = '5px';
      item.history.forEach((price, i) => {
        const pItem = document.createElement('li');
        pItem.textContent = `第 ${i + 1} 次購買：$${price}`;
        pItem.style.fontSize = '0.9em';
        pItem.style.color = '#555';
        history.appendChild(pItem);
      });
      li.appendChild(history);
    }

    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();
  if (value) {
    items.push({ name: value, history: [] });
    save();
    input.value = '';
    renderList();
  }
}

function addPrice(index) {
  const price = prompt(`輸入購買金額（${items[index].name}）：`);
  const value = parseFloat(price);
  if (!isNaN(value)) {
    items[index].history.push(value);
    save();
    renderList();
  }
}

function removeItem(index) {
  if (confirm(`確定要刪除「${items[index].name}」嗎？`)) {
    items.splice(index, 1);
    save();
    renderList();
  }
}

function save() {
  localStorage.setItem('toBuyList', JSON.stringify(items));
}

renderList(); // 初次載入時顯示清單
