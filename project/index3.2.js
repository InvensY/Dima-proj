// index.js - для страницы с множеством кнопок

// Массив для отслеживания выбранных кнопок
let selectedButtons = [];

// Получаем контейнер и картинку
const container = document.querySelector('div[style*="position: relative"]');
const img = document.querySelector('img');

// Находим все area кнопки
const allAreas = document.querySelectorAll('area');

// Функция создания обводки
function addOutline(areaElement, color = '#00ff00') {
    removeOutline(areaElement);
    
    if (!areaElement || !areaElement.coords) return;
    
    const coords = areaElement.coords.split(',').map(Number);
    const imgRect = img.getBoundingClientRect();
    
    const scaleX = imgRect.width / img.naturalWidth;
    const scaleY = imgRect.height / img.naturalHeight;
    
    const left = imgRect.left + (coords[0] * scaleX);
    const top = imgRect.top + (coords[1] * scaleY);
    const width = (coords[2] - coords[0]) * scaleX;
    const height = (coords[3] - coords[1]) * scaleY;
    
    const outlineDiv = document.createElement('div');
    outlineDiv.className = `outline-${Array.from(allAreas).indexOf(areaElement)}`;
    outlineDiv.style.position = 'absolute';
    outlineDiv.style.left = left + 'px';
    outlineDiv.style.top = top + 'px';
    outlineDiv.style.width = width + 'px';
    outlineDiv.style.height = height + 'px';
    outlineDiv.style.border = `3px solid ${color}`;
    outlineDiv.style.borderRadius = '8px';
    outlineDiv.style.pointerEvents = 'none';
    outlineDiv.style.zIndex = '1000';
    outlineDiv.style.boxShadow = `0 0 10px ${color}`;
    outlineDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    outlineDiv.style.transition = 'all 0.2s ease';
    
    container.appendChild(outlineDiv);
}

// Функция удаления обводки
function removeOutline(areaElement) {
    const index = Array.from(allAreas).indexOf(areaElement);
    const existingOutline = document.querySelector(`.outline-${index}`);
    if (existingOutline) existingOutline.remove();
}

// Функция проверки - все ли кнопки выбраны
function checkAllSelected() {
    if (selectedButtons.length === allAreas.length) {
        // Все кнопки выбраны - переходим на новую страницу
        alert('Все кнопки выбраны! Переход...');
        window.location.href = './подглава3.3.html'; 
    }
}

// Добавляем обработчик на каждую кнопку
allAreas.forEach((area, index) => {
    // Сохраняем оригинальный onclick
    const originalOnclick = area.onclick;
    
    // Перезаписываем onclick
    area.onclick = function(e) {
        e.preventDefault();
        
        // Если кнопка ещё не выбрана
        if (!selectedButtons.includes(area)) {
            // Добавляем в массив выбранных
            selectedButtons.push(area);
            // Добавляем зелёную обводку
            addOutline(area, '#00ff00');
            console.log(`Выбрана кнопка ${index + 1}. Выбрано: ${selectedButtons.length} из ${allAreas.length}`);
            
            // Проверяем, все ли выбраны
            checkAllSelected();
        } else {
            // Если уже выбрана - ничего не делаем или можно снять выделение
            console.log(`Кнопка ${index + 1} уже выбрана`);
        }
        
        return false;
    };
});

// Обновляем обводки при изменении размера окна
window.addEventListener('resize', function() {
    selectedButtons.forEach(btn => {
        removeOutline(btn);
        addOutline(btn, '#00ff00');
    });
});

console.log(`Готово! Всего кнопок: ${allAreas.length}`);



