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
    history.forEach(h => {
      const div = document.createElement('div');
      div.textContent = `💰 ${h.price} 元，📍 ${h.place}`;
      historyList.appendChild(div);
    });
  }
}

function addHistory() {
  const price = document.getElementById('priceInput').value.trim();
  const place = document.getElementById('placeInput').value.trim();
  if (price && place && currentIndex !== null) {
    items[currentIndex].history.push({ price, place });
    localStorage.setItem('toBuyList', JSON.stringify(items));
    renderHistory(items[currentIndex].history);
    document.getElementById('priceInput').value = '';
    document.getElementById('placeInput').value = '';
  }
}

function removeItem(index) {
  if (confirm(`確定要刪除「${items[index].name}」嗎？`)) {
    items.splice(index, 1);
    save();
    renderList();
  }
}

renderList(); // 初次載入時顯示清單
