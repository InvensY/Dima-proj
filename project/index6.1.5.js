// index.js - для страницы с множеством кнопок (исправленная версия)

// Массив для отслеживания выбранных кнопок
let selectedButtons = [];

// Ждём полной загрузки страницы
window.addEventListener('load', function() {
    
    // Получаем контейнер и картинку
    const container = document.querySelector('div[style*="position: relative"]');
    const img = document.querySelector('img');
    
    if (!img) {
        console.error('Картинка не найдена!');
        return;
    }
    
    // Находим все area кнопки
    const allAreas = document.querySelectorAll('area');
    
    if (allAreas.length === 0) {
        console.error('Кнопки (area) не найдены!');
        return;
    }
    
    // Функция создания обводки (с учётом скролла)
    function addOutline(areaElement, color = '#00ff00') {
        removeOutline(areaElement);
        
        if (!areaElement || !areaElement.coords) return;
        
        const coords = areaElement.coords.split(',').map(Number);
        const imgRect = img.getBoundingClientRect();
        
        const scaleX = imgRect.width / img.naturalWidth;
        const scaleY = imgRect.height / img.naturalHeight;
        
        // ВАЖНО: добавляем scrollX и scrollY для учёта прокрутки
        const left = window.scrollX + imgRect.left + (coords[0] * scaleX);
        const top = window.scrollY + imgRect.top + (coords[1] * scaleY);
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
        outlineDiv.style.zIndex = '9999';
        outlineDiv.style.boxShadow = `0 0 10px ${color}`;
        outlineDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
        outlineDiv.style.transition = 'all 0.2s ease';
        
        document.body.appendChild(outlineDiv); // Добавляем в body, а не в container
    }
    
    // Функция удаления обводки
    function removeOutline(areaElement) {
        const index = Array.from(allAreas).indexOf(areaElement);
        const existingOutline = document.querySelector(`.outline-${index}`);
        if (existingOutline) existingOutline.remove();
    }
    
    // Функция удаления всех обводок
    function removeAllOutlines() {
        document.querySelectorAll('[class^="outline-"]').forEach(el => el.remove());
    }
    
    // Функция проверки - все ли кнопки выбраны
    function checkAllSelected() {
        if (selectedButtons.length === allAreas.length) {
            alert('Весь мусор убран, Ты у меня умничка! Переход...');
            window.location.href = './подглава6.1.6.html';
        }
    }
    
    // Функция обновления ВСЕХ обводок (при скролле и ресайзе)
    function updateAllOutlines() {
        selectedButtons.forEach(btn => {
            if (btn) {
                const index = Array.from(allAreas).indexOf(btn);
                removeOutline(btn);
                addOutline(btn, '#00ff00');
            }
        });
    }
    
    // Добавляем обработчик на каждую кнопку
    allAreas.forEach((area, index) => {
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
                console.log(`Кнопка ${index + 1} уже выбрана`);
            }
            
            return false;
        };
    });
    
    // Подписываемся на скролл и ресайз
    window.addEventListener('scroll', function() {
        updateAllOutlines();
    });
    
    window.addEventListener('resize', function() {
        updateAllOutlines();
    });
    
    console.log(`Готово! Всего кнопок: ${allAreas.length}`);
    
});