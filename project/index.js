// Инструмент для определения координат shape="rect"
let startPoint = null;
const img = document.querySelector('img');

// Добавляем визуальную подсказку на страницу (небольшую, не мешает)
const hint = document.createElement('div');
hint.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: #0f0;
    padding: 5px 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    pointer-events: none;
`;
hint.textContent = 'Режим: выбери углы кнопки';
document.body.appendChild(hint);

img.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const scaleX = this.naturalWidth / rect.width;
    const scaleY = this.naturalHeight / rect.height;
    
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
    
    x = Math.round(x);
    y = Math.round(y);
    
    // Если это первый клик (левый верхний угол)
    if (startPoint === null) {
        startPoint = { x: x, y: y };
        hint.textContent = `✅ Верхний левый угол: (${x}, ${y}) | Теперь кликни в правый нижний угол`;
        console.log(`🟢 Верхний левый угол: x = ${x}, y = ${y}`);
    } 
    // Если это второй клик (правый нижний угол)
    else {
        const x1 = Math.min(startPoint.x, x);
        const y1 = Math.min(startPoint.y, y);
        const x2 = Math.max(startPoint.x, x);
        const y2 = Math.max(startPoint.y, y);
        
        console.log('\n========== ГОТОВЫЕ КООРДИНАТЫ ==========');
        console.log(`shape="rect" coords="${x1},${y1},${x2},${y2}"`);
        console.log('=========================================\n');
        
        hint.textContent = `🔴 Готово: coords="${x1},${y1},${x2},${y2}" | Кликни заново для новой кнопки`;
        
        // Сбрасываем для следующей кнопки
        startPoint = null;
        
        // Через 2 секунды сбросим подсказку
        setTimeout(() => {
            if (startPoint === null) {
                hint.textContent = 'Режим: выбери углы кнопки';
            }
        }, 3000);
    }
});

// Если хочешь отменить выбор — нажми Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && startPoint !== null) {
        startPoint = null;
        hint.textContent = 'Режим: выбери углы кнопки (выбор отменён)';
        console.log('❌ Выбор отменён');
        setTimeout(() => {
            if (startPoint === null) {
                hint.textContent = 'Режим: выбери углы кнопки';
            }
        }, 1500);
    }
});

// ========== ОСНОВНАЯ ЛОГИКА С ОБВОДКОЙ ==========
// Состояние выбора
let selectedGender = null;
let selectedAge = null;

// Получаем контейнер и картинку
const container = document.querySelector('div[style*="position: relative"]');
const image = document.querySelector('img');

// Функция создания обводки (работает с area)
function addOutline(areaElement, color) {
    removeOutline(areaElement);
    
    if (!areaElement || !areaElement.coords) return;
    
    const coords = areaElement.coords.split(',').map(Number);
    const imgRect = image.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const scaleX = imgRect.width / image.naturalWidth;
    const scaleY = imgRect.height / image.naturalHeight;
    
    const left = imgRect.left + (coords[0] * scaleX);
    const top = imgRect.top + (coords[1] * scaleY);
    const width = (coords[2] - coords[0]) * scaleX;
    const height = (coords[3] - coords[1]) * scaleY;
    
    const outlineDiv = document.createElement('div');
    outlineDiv.className = `outline-${areaElement.className}`;
    outlineDiv.style.position = 'absolute';
    outlineDiv.style.left = left + 'px';
    outlineDiv.style.top = top + 'px';
    outlineDiv.style.width = width + 'px';
    outlineDiv.style.height = height + 'px';
    outlineDiv.style.border = `3px solid ${color}`;
    outlineDiv.style.borderRadius = '8px';
    outlineDiv.style.pointerEvents = 'none';
    outlineDiv.style.zIndex = '1000';
    outlineDiv.style.boxShadow = `0 0 8px ${color}`;
    outlineDiv.style.transition = 'all 0.2s ease';
    
    container.appendChild(outlineDiv);
}

// Функция удаления обводки
function removeOutline(areaElement) {
    if (!areaElement || !areaElement.className) return;
    const existingOutline = document.querySelector(`.outline-${areaElement.className}`);
    if (existingOutline) existingOutline.remove();
}

// Функция удаления всех обводок
function removeAllOutlines() {
    document.querySelectorAll('[class^="outline-"]').forEach(el => el.remove());
}

// Получаем все кнопки
const maleBtn = document.querySelector('.male');
const femaleBtn = document.querySelector('.female');
const age18 = document.querySelector('.age18');
const age18_20 = document.querySelector('.age18-20');
const age20plus = document.querySelector('.ageMore20');
const startBtn = document.querySelector('.startDialog');

// Функция сброса обводки у всех кнопок пола
function resetGenderHighlight() {
    removeOutline(maleBtn);
    removeOutline(femaleBtn);
}

// Функция сброса обводки у всех кнопок возраста
function resetAgeHighlight() {
    removeOutline(age18);
    removeOutline(age18_20);
    removeOutline(age20plus);
}

// Выбор пола
maleBtn.onclick = function(e) {
    e.preventDefault();
    resetGenderHighlight();
    selectedGender = 'male';
    addOutline(maleBtn, '#0400ff');
    console.log('Выбран: Мужской');
};

femaleBtn.onclick = function(e) {
    e.preventDefault();
    resetGenderHighlight();
    selectedGender = 'female';
    addOutline(femaleBtn, '#ff00ff');
    console.log('Выбран: Женский');
    alert('Неправильный выбор');
    selectedGender = null;
    resetGenderHighlight();
};

// Выбор возраста
age18.onclick = function(e) {
    e.preventDefault();
    resetAgeHighlight();
    selectedAge = '18';
    addOutline(age18, '#ff00ff');
    console.log('Выбран: 18-');
    alert('Неправильный выбор');
    selectedAge = null;
    resetAgeHighlight();
};

age18_20.onclick = function(e) {
    e.preventDefault();
    resetAgeHighlight();
    selectedAge = '18-20';
    addOutline(age18_20, '#0400ff');
    console.log('Выбран: 18-20');
};

age20plus.onclick = function(e) {
    e.preventDefault();
    resetAgeHighlight();
    selectedAge = '20+';
    addOutline(age20plus, '#ff00ff');
    console.log('Выбран: 20+');
    alert('Неправильный выбор');
    selectedAge = null;
    resetAgeHighlight();
};

// Кнопка старта
startBtn.onclick = function(e) {
    e.preventDefault();
    
    if (selectedGender === 'male' && selectedAge === '18-20') {
        window.location.href = './подглава1.3.1.html';
    } else {
        alert('Неправильный выбор');
        selectedGender = null;
        selectedAge = null;
        removeAllOutlines();
    }
};

// Обновляем обводку при изменении размера окна
window.addEventListener('resize', function() {
    if (selectedGender === 'male') {
        removeOutline(maleBtn);
        addOutline(maleBtn, '#00ff00');
    }
    if (selectedAge === '18-20') {
        removeOutline(age18_20);
        addOutline(age18_20, '#00ff00');
    }
});