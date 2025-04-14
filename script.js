import { addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// 新增項目到 Firebase
async function addItemToFirebase(item) {
  try {
    const docRef = await addDoc(collection(db, "items"), item);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

let items = JSON.parse(localStorage.getItem('toBuyList')) || [];
let currentIndex = null;

const list = document.getElementById('itemList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const historyList = document.getElementById('historyList');

async function loadItemsFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "items"));
  const itemsArray = [];
  querySnapshot.forEach((doc) => {
    itemsArray.push(doc.data()); // 取出每個 document 的資料
  });
  return itemsArray;
}

function renderList(items) {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name; // 假設 Firestore 中每個項目有 name 欄位
    itemList.appendChild(li);
  });
}

`async function renderList() {
  list.innerHTML = '';

  const items = await loadItemsFromFirebase(); // 讀取資料
  
  const incomplete = items.filter(item => !item.completed);
  const complete = items.filter(item => item.completed);
  const sortedItems = [...incomplete, ...complete];

  sortedItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.borderBottom = '1px solid #ccc';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.style.marginRight = '10px';
    checkbox.style.width = '14px';
    checkbox.style.cursor = 'pointer';
    
    checkbox.onchange = async () => {
      const realIndex = items.findIndex(i => i.name === item.name && i.completed === item.completed);
      if (realIndex !== -1) {
        items[realIndex].completed = checkbox.checked;
        await updateItemInFirebase(item); // 更新 Firebase 中的項目
        renderList(); // 重新渲染清單
      }
    };
    
    const span = document.createElement('span');
    span.textContent = item.name;
    span.onclick = () => openModal(index);

    li.appendChild(checkbox);
    li.appendChild(span);

    if (item.completed) {
      li.style.opacity = '0.4';
      li.style.textDecoration = 'line-through';
    }    

    list.appendChild(li);

  });
}`


async function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();
  if (value) {
    items.push({ name: value, history: [], completed: false});
    await addItemToFirebase(newItem); // 儲存到 Firebase
    renderList();
    input.value = '';
    loadItemsFromFirebase().then(items => renderList(items));
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
