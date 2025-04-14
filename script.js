let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
let currentIndex = null;

const list = document.getElementById('itemList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const historyList = document.getElementById('historyList');

function renderList() {
  list.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span onclick="openModal(${index})">${item.name}</span>`;
    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();
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
