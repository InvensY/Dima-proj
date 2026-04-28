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

// Делаем кнопки адаптивными под любой экран
window.addEventListener('load', function() {
    const img = document.querySelector('img');
    const areas = document.querySelectorAll('area');
    
    function resizeAreas() {
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        
        areas.forEach(area => {
            const original = area.getAttribute('data-original');
            if (original) {
                const coords = original.split(',').map(Number);
                const newCoords = coords.map((c, i) => 
                    Math.round(c * (i % 2 === 0 ? scaleX : scaleY))
                ).join(',');
                area.coords = newCoords;
            } else {
                area.setAttribute('data-original', area.coords);
            }
        });
    }
    
    img.onload = resizeAreas;
    window.onresize = resizeAreas;
    resizeAreas();
});