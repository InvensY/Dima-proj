
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
// index.js - ИСПРАВЛЕННАЯ ВЕРСИЯ (без дублирования переменных)

console.log('!!! СКРИПТ ЗАГРУЗИЛСЯ !!!');

// Состояние выбора
let selectedGender = null;
let selectedAge = null;

// Ждём полной загрузки страницы
window.addEventListener('load', function() {
    console.log('Страница загружена');
    
    // Получаем элементы ТОЛЬКО ОДИН РАЗ
    const myImg = document.querySelector('img');
    if (!myImg) {
        console.error('Картинка не найдена!');
        return;
    }
    
    console.log('Картинка найдена');
    
    // Функция создания обводки
    function addOutline(areaElement, color) {
        const oldOutline = document.getElementById(`outline-${areaElement.className}`);
        if (oldOutline) oldOutline.remove();
        
        if (!areaElement || !areaElement.coords) return;
        
        const coords = areaElement.coords.split(',').map(Number);
        const imgRect = myImg.getBoundingClientRect();
        
        const scaleX = imgRect.width / myImg.naturalWidth;
        const scaleY = imgRect.height / myImg.naturalHeight;
        
        const left = window.scrollX + imgRect.left + (coords[0] * scaleX);
        const top = window.scrollY + imgRect.top + (coords[1] * scaleY);
        const width = (coords[2] - coords[0]) * scaleX;
        const height = (coords[3] - coords[1]) * scaleY;
        
        const outlineDiv = document.createElement('div');
        outlineDiv.id = `outline-${areaElement.className}`;
        outlineDiv.style.position = 'absolute';
        outlineDiv.style.left = left + 'px';
        outlineDiv.style.top = top + 'px';
        outlineDiv.style.width = width + 'px';
        outlineDiv.style.height = height + 'px';
        outlineDiv.style.border = `3px solid ${color}`;
        outlineDiv.style.borderRadius = '8px';
        outlineDiv.style.pointerEvents = 'none';
        outlineDiv.style.zIndex = '9999';
        outlineDiv.style.boxShadow = `0 0 8px ${color}`;
        
        document.body.appendChild(outlineDiv);
    }
    
    function removeOutline(areaElement) {
        const outline = document.getElementById(`outline-${areaElement.className}`);
        if (outline) outline.remove();
    }
    
    function removeAllOutlines() {
        document.querySelectorAll('[id^="outline-"]').forEach(el => el.remove());
    }
    
    // Находим кнопки
    const maleBtn = document.querySelector('.male');
    const femaleBtn = document.querySelector('.female');
    const age18 = document.querySelector('.age18');
    const age18_20 = document.querySelector('.age18-20');
    const age20plus = document.querySelector('.ageMore20');
    const startBtn = document.querySelector('.startDialog');
    
    console.log('Кнопки найдены:', {
        male: !!maleBtn,
        female: !!femaleBtn,
        age18: !!age18,
        age18_20: !!age18_20,
        age20plus: !!age20plus,
        start: !!startBtn
    });
    
    // male
    if (maleBtn) {
        maleBtn.onclick = function(e) {
            e.preventDefault();
            if (femaleBtn) removeOutline(femaleBtn);
            selectedGender = 'male';
            addOutline(maleBtn, '#00ff00');
            console.log('Выбран мужской');
            return false;
        };
    }
    
    // female
    if (femaleBtn) {
        femaleBtn.onclick = function(e) {
            e.preventDefault();
            if (maleBtn) removeOutline(maleBtn);
            selectedGender = 'female';
            addOutline(femaleBtn, '#ff00ff');
            alert('Неправильный выбор');
            selectedGender = null;
            removeOutline(femaleBtn);
            return false;
        };
    }
    
    // age18
    if (age18) {
        age18.onclick = function(e) {
            e.preventDefault();
            selectedAge = '18';
            addOutline(age18, '#ff00ff');
            alert('Неправильный выбор');
            selectedAge = null;
            removeOutline(age18);
            return false;
        };
    }
    
    // age18-20
    if (age18_20) {
        age18_20.onclick = function(e) {
            e.preventDefault();
            if (age18) removeOutline(age18);
            if (age20plus) removeOutline(age20plus);
            selectedAge = '18-20';
            addOutline(age18_20, '#00ff00');
            console.log('Выбран 18-20');
            return false;
        };
    }
    
    // age20+
    if (age20plus) {
        age20plus.onclick = function(e) {
            e.preventDefault();
            selectedAge = '20+';
            addOutline(age20plus, '#ff00ff');
            alert('Неправильный выбор');
            selectedAge = null;
            removeOutline(age20plus);
            return false;
        };
    }
    
    // start
    if (startBtn) {
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
            return false;
        };
    }
    
    // Обновление при скролле
    function updateOutlines() {
        if (selectedGender === 'male' && maleBtn) {
            removeOutline(maleBtn);
            addOutline(maleBtn, '#00ff00');
        }
        if (selectedAge === '18-20' && age18_20) {
            removeOutline(age18_20);
            addOutline(age18_20, '#00ff00');
        }
    }
    
    window.addEventListener('scroll', updateOutlines);
    window.addEventListener('resize', updateOutlines);
    
    console.log('Готово! Кликай по кнопкам');
});