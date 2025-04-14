let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
let currentIndex = null;

const list = document.getElementById('itemList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const historyList = document.getElementById('historyList');

function renderList() {
  itemListEl.innerHTML = '';

  // 勾選未勾選的放上面，勾選的移到下面
  const sortedItems = itemList.slice().sort((a, b) => {
    return (a.checked === b.checked) ? 0 : (a.checked ? 1 : -1);
  });

  sortedItems.forEach((item, sortedIndex) => {
    const li = document.createElement('li');
    if (item.checked) li.classList.add('checked');

    const index = itemList.indexOf(item); // 找回原始 index

    // ✅ 勾選框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.onchange = () => {
      itemList[index].checked = checkbox.checked;
      saveData();
      renderList();
    };

    // 📝 購買項目名稱
    const span = document.createElement('span');
    span.textContent = item.name;
    span.style.marginLeft = '10px';
    span.style.cursor = 'pointer';
    span.onclick = () => {
      currentIndex = index;
      openModal();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    itemListEl.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();
  itemList.push({ name, history: [], checked: false });
  if (value) {
    items.push({ name: value, history: [] });
    localStorage.setItem('toBuyList', JSON.stringify(items));
    input.value = '';
    renderList();
  }
}

function removeItem(index) {
  items.splice(index, 1);
  localStorage.setItem('toBuyList', JSON.stringify(items));
  renderList();
  closeModal();
}

let placeList = [];

function openModal(index) {
  currentIndex = index;
  const item = items[index];
  modalTitle.textContent = item.name;
  renderHistory(item.history);
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  currentIndex = null;
}

function renderHistory(history) {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<div>尚無紀錄</div>';
  } else {
    history.forEach((h, i) => {
      const div = document.createElement('div');
      div.innerHTML = `
      <div>
        £ ${h.price} / ${h.quantity} (${h.unitPrice}) | ${h.place} | ${h.date}
      </div>
      <button onclick="deleteHistory(${i})">X</button>
       `;

      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';

      historyList.appendChild(div);
    });
  }
}

function addHistory() {
  const price = document.getElementById('priceInput').value.trim();
  const quantity = document.getElementById('quantityInput').value.trim();
  const place = document.getElementById('placeInput').value.trim();
  if (price && quantity && place && currentIndex !== null) {
    const unitPrice = (parseFloat(price) / parseFloat(quantity)).toFixed(2);
    const date = new Date().toLocaleDateString();

    items[currentIndex].history.push({ price, quantity, unitPrice, place, date });
    localStorage.setItem('toBuyList', JSON.stringify(items));

    document.getElementById('priceInput').value = '';
    document.getElementById('quantityInput').value = '';
    document.getElementById('placeInput').value = '';

    renderHistory(items[currentIndex].history);
  }
}

function deleteHistory(historyIndex) {
  if (currentIndex !== null) {
    items[currentIndex].history.splice(historyIndex, 1);
    localStorage.setItem('toBuyList', JSON.stringify(items));
    renderHistory(items[currentIndex].history);
  }
}

function deleteItem() {
  if (currentIndex !== null) {
    removeItem(currentIndex);
  }
}

renderList(); // 初次載入時顯示清單
