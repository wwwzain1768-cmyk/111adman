// المتغير الشامل الذي سيحمل قائمة الأبراج
let towersArray = [];
let editIndex = null; // لمعرفة ما إذا كنا نضيف برجاً جديداً أم نعدل برجاً قديماً

// 1. إخفاء شاشة الترحيب بعد 3 ثوانٍ
window.onload = function() {
    setTimeout(() => {
        const welcomeScreen = document.getElementById('welcome-screen');
        welcomeScreen.style.opacity = '0'; // جعلها شفافة أولاً
        
        // إزالتها تماماً من الشاشة بعد انتهاء حركة الشفافية
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 1000); 
    }, 3000); // 3000 ملي ثانية = 3 ثوانٍ

    // تحميل الأبراج المحفوظة مسبقاً من ذاكرة المتصفح
    loadTowers();
};

// 2. دالة التنقل بين التبويبات
function openTab(tabId) {
    // إخفاء جميع التبويبات
    let contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }

    // إزالة اللون النشط من جميع الأزرار
    let buttons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // إظهار التبويب المطلوب وتفعيل زره
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 3. دالة حفظ أو تعديل البرج
function saveTower() {
    // جلب القيم من الحقول
    let name = document.getElementById('towerName').value;
    let owner = document.getElementById('ownerName').value;
    let code = document.getElementById('towerCode').value;

    // التأكد من أن الحقول غير فارغة
    if (name === "" || owner === "" || code === "") {
        alert("الرجاء تعبئة جميع الحقول!");
        return;
    }

    // إنشاء كائن (Object) يحتوي على بيانات البرج
    let newTower = {
        towerName: name,
        ownerName: owner,
        towerCode: code
    };

    if (editIndex === null) {
        // إذا كان editIndex فارغاً، فهذا يعني أننا نضيف برجاً جديداً
        towersArray.push(newTower);
    } else {
        // إذا كان هناك قيمة، فنحن نقوم بتعديل برج موجود
        towersArray[editIndex] = newTower;
        editIndex = null; // إعادة تصفير متغير التعديل
        document.querySelector('.save-btn').innerText = "حفظ البرج"; // إعادة اسم الزر
    }

    // حفظ المصفوفة في ذاكرة المتصفح (يجب تحويلها إلى نص باستخدام JSON)
    localStorage.setItem('towersData', JSON.stringify(towersArray));

    // تفريغ الحقول بعد الحفظ
    document.getElementById('towerName').value = "";
    document.getElementById('ownerName').value = "";
    document.getElementById('towerCode').value = "";

    // تحديث القائمة المعروضة
    renderTowers();
}

// 4. دالة تحميل الأبراج من الذاكرة
function loadTowers() {
    let savedData = localStorage.getItem('towersData');
    if (savedData) {
        // تحويل النص المحفوظ إلى مصفوفة برمجية مجدداً
        towersArray = JSON.parse(savedData);
        renderTowers();
    }
}

// 5. دالة رسم/عرض الأبراج في الصفحة
function renderTowers() {
    let listContainer = document.getElementById('towersList');
    listContainer.innerHTML = ""; // تفريغ القائمة قبل إعادة رسمها

    // المرور على جميع الأبراج ورسمها
    towersArray.forEach((tower, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'tower-item';

        // محتوى البرج (النص والأزرار)
        itemDiv.innerHTML = `
            <div class="tower-info">
                <p><strong>اسم البرج:</strong> ${tower.towerName}</p>
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

// 6. دالة حذف برج
function deleteTower(index) {
    if (confirm("هل أنت متأكد من حذف هذا البرج؟")) {
        // إزالة عنصر واحد من المصفوفة بناءً على رقمه (index)
        towersArray.splice(index, 1);
        // تحديث الذاكرة
        localStorage.setItem('towersData', JSON.stringify(towersArray));
        // تحديث الشاشة
        renderTowers();
    }
}

// 7. دالة تجهيز البرج للتعديل
function editTower(index) {
    // جلب بيانات البرج المطلوب تعديله ووضعها في الحقول
    document.getElementById('towerName').value = towersArray[index].towerName;
    document.getElementById('ownerName').value = towersArray[index].ownerName;
    document.getElementById('towerCode').value = towersArray[index].towerCode;

    // تغيير اسم الزر ليدل على التعديل
    document.querySelector('.save-btn').innerText = "تحديث بيانات البرج";
    
    // حفظ رقم البرج الذي نعدله (index) لكي نستبدله عند الحفظ
    editIndex = index;
}
