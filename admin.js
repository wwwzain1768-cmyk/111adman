let towersArray = [];
let editIndex = null;

window.onload = function() {
    setTimeout(() => {
        const welcomeScreen = document.getElementById('welcome-screen');
        welcomeScreen.style.opacity = '0';
        setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000); 
    }, 3000);
    loadTowers();
};

function openTab(tabId) {
    let contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) contents[i].classList.remove('active');
    
    let buttons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function saveTower() {
    let name = document.getElementById('towerName').value;
    let owner = document.getElementById('ownerName').value;
    let code = document.getElementById('towerCode').value;

    if (name === "" || owner === "" || code === "") { alert("الرجاء تعبئة جميع الحقول!"); return; }

    let newTower = { towerName: name, ownerName: owner, towerCode: code };

    if (editIndex === null) { towersArray.push(newTower); } 
    else { towersArray[editIndex] = newTower; editIndex = null; document.querySelector('.save-btn').innerText = "حفظ البرج"; }

    localStorage.setItem('towersData', JSON.stringify(towersArray));
    document.getElementById('towerName').value = "";
    document.getElementById('ownerName').value = "";
    document.getElementById('towerCode').value = "";
    renderTowers();
}

function loadTowers() {
    let savedData = localStorage.getItem('towersData');
    if (savedData) { towersArray = JSON.parse(savedData); renderTowers(); }
}

function renderTowers() {
    let listContainer = document.getElementById('towersList');
    listContainer.innerHTML = "";
    towersArray.forEach((tower, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'tower-item';
        itemDiv.innerHTML = `
            <div class="tower-info">
                <p><strong>البرج:</strong> ${tower.towerName}</p>
                <p><strong>المالك:</strong> ${tower.ownerName}</p>
                <p><strong>الرمز:</strong> ${tower.towerCode}</p>
            </div>
            <div class="action-btns">
                <button class="edit-btn" onclick="editTower(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteTower(${index})">حذف</button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });
}

function deleteTower(index) {
    if (confirm("هل أنت متأكد من حذف هذا البرج؟")) {
        towersArray.splice(index, 1);
        localStorage.setItem('towersData', JSON.stringify(towersArray));
        renderTowers();
    }
}

function editTower(index) {
    document.getElementById('towerName').value = towersArray[index].towerName;
    document.getElementById('ownerName').value = towersArray[index].ownerName;
    document.getElementById('towerCode').value = towersArray[index].towerCode;
    document.querySelector('.save-btn').innerText = "تحديث بيانات البرج";
    editIndex = index;
}
