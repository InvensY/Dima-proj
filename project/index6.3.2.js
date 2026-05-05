// index.js - для страницы с выбором pizza, teriyaki, trio

// Состояние выбранных кнопок
let selectedButtons = [];

// Правильные кнопки (которые нужно выбрать)
const correctButtons = ['pizza', 'teriyaki', 'trio'];

// Ждём полной загрузки страницы
window.addEventListener('load', function() {
    
    // Получаем картинку
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
    
    console.log(`Найдено кнопок: ${allAreas.length}`);
    
    // Функция создания обводки (с учётом скролла)
    function addOutline(areaElement, color) {
        removeOutline(areaElement);
        
        if (!areaElement || !areaElement.coords) return;
        
        const coords = areaElement.coords.split(',').map(Number);
        const imgRect = img.getBoundingClientRect();
        
        const scaleX = imgRect.width / img.naturalWidth;
        const scaleY = imgRect.height / img.naturalHeight;
        
        // Учитываем скролл
        const left = window.scrollX + imgRect.left + (coords[0] * scaleX);
        const top = window.scrollY + imgRect.top + (coords[1] * scaleY);
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
        outlineDiv.style.zIndex = '9999';
        outlineDiv.style.boxShadow = `0 0 8px ${color}`;
        outlineDiv.style.backgroundColor = color === '#00ff00' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        
        document.body.appendChild(outlineDiv);
    }
    
    // Функция удаления обводки
    function removeOutline(areaElement) {
        const existingOutline = document.querySelector(`.outline-${areaElement.className}`);
        if (existingOutline) existingOutline.remove();
    }
    
    // Функция удаления всех обводок
    function removeAllOutlines() {
        document.querySelectorAll('[class^="outline-"]').forEach(el => el.remove());
    }
    
    // Функция проверки - все ли правильные кнопки выбраны
    function checkAllCorrectSelected() {
        // Получаем массив выбранных правильных кнопок
        const selectedCorrect = selectedButtons.filter(btn => 
            correctButtons.includes(btn.className)
        );
        
        // Если выбраны все 3 правильные кнопки
        if (selectedCorrect.length === correctButtons.length) {
            alert('Правильно! Все нужные блюда выбраны. Переход...');
            window.location.href = './подглава6.3.3.html'; // Поменяй путь на нужный
        }
    }
    
    // Добавляем обработчик на каждую кнопку
    allAreas.forEach((area, index) => {
        area.onclick = function(e) {
            e.preventDefault();
            
            const buttonType = area.className;
            const isCorrect = correctButtons.includes(buttonType);
            
            // Если кнопка уже выбрана
            if (selectedButtons.includes(area)) {
                console.log(`Кнопка ${buttonType} уже выбрана`);
                return false;
            }
            
            if (isCorrect) {
                // Правильная кнопка - добавляем зелёную обводку
                selectedButtons.push(area);
                addOutline(area, '#00ff00');
                console.log(`✅ Правильная кнопка: ${buttonType}. Выбрано: ${selectedButtons.filter(b => correctButtons.includes(b.className)).length} из 3`);
                
                // Проверяем, все ли правильные кнопки выбраны
                checkAllCorrectSelected();
            } else {
                // Неправильная кнопка - красная обводка и алерт
                addOutline(area, '#ff0000');
                console.log(`❌ Неправильная кнопка: ${buttonType}`);
                alert('Неправильный выбор!');
                
                // Удаляем красную обводку через секунду
                setTimeout(() => {
                    removeOutline(area);
                }, 1000);
            }
            
            return false;
        };
    });
    
    // Обновление обводок при скролле и ресайзе
    function updateAllOutlines() {
        selectedButtons.forEach(btn => {
            if (btn) {
                removeOutline(btn);
                addOutline(btn, '#00ff00');
            }
        });
    }
    
    window.addEventListener('scroll', updateAllOutlines);
    window.addEventListener('resize', updateAllOutlines);
    
    console.log('Готово! Выбери: pizza, teriyaki, trio');
});