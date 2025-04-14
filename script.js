let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
let currentIndex = null;

const list = document.getElementById('itemList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const historyList = document.getElementById('historyList');

function renderList() {
  list.innerHTML = '';


  const incomplete = items.filter(item => !item.completed);
  const complete = items.filter(item => item.completed);
  const sortedItems = [...incomplete, ...complete];

  sortedItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.padding = '5px';
    li.style.borderBottom = '1px solid #ccc';
    li.style.cursor = 'pointer';
    li.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
    li.style.transition = 'background-color 0.3s';
    li.onmouseover = () => li.style.backgroundColor = '#e0e0e0';
    li.onmouseout = () => li.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
    li.style.borderRadius = '5px';

    // 建立勾選框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '10px';
    checkbox.checked = item.completed;
    checkbox.style.width = '14px';
    checkbox.style.height = '14px';

    checkbox.onchange = () => {
      item.completed = checkbox.checked;
      localStorage.setItem('toBuyList', JSON.stringify(items));
      renderList();
    };

    // 建立文字，點擊後開啟 modal
    const span = document.createElement('span');
    span.textContent = item.name;
    span.onclick = () => openModal(index);

    // 把勾選框和文字加到 li 裡
    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);

    if (item.completed) {
      li.style.opacity = '0.4';
      li.style.textDecoration = 'line-through';
    }

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

function renderHistory(history) {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<div>尚無紀錄</div>';
  } else {
    history.forEach((h, i) => {
      const div = document.createElement('div');

      div.innerHTML = `
        <div>
           £ ${h.price} / ${h.quantity} (${h.unitPrice}）| ${h.place} ｜ ${h.date}
        </div>
        <button onclick="deleteHistory(${i})">刪除</button>
      `;

      historyList.appendChild(div);
    });
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

renderList();
