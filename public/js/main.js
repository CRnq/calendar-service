// カレンダーの表示

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1

let currentYear = year;
let currentMonth = month;

const prevMonthButton = document.getElementById('prev-month-button')
const nextMonthButton = document.getElementById('next-month-button')

let displayType = document.querySelector('#display-type');

// 一ヶ月のカレンダーを生成
function generateCalendar(year, month){
    const firstDate = new Date(year, month-1, 1); //今月の１日
    const firstDay = firstDate.getDay();
    const lastDate = new Date(year, month, 0); //今月の最終日
    const lastDayCount = lastDate.getDate();
    
    const prevLastDate = new Date(year, month-1, 0) //先月の最終日
    const prevLastDayCount = prevLastDate.getDate() //最終日の日付
    
    let dayCount = 1;
    let createYearMonthHtml = '<h1 class="year-month">' + year + '/' + month + '</h1>'
    let createCalendarHtml = "";
    
    const weeks = ['日', '月', '火', '水', '木', '金', '土']
    
    createCalendarHtml += '<div class="Sunday">' + weeks[0] + '</div>';
    
    for (let i = 1; i < weeks.length-1; i++) {
        createCalendarHtml += '<div class="weekday">' + weeks[i] + '</div>';
    }
    
    createCalendarHtml += '<div class="Saturday">' + weeks[6] + '</div>';
    
    // 月の終わりにフラグを立てる
    let isNextMonth = false;
    
    // 5週分繰り返す
    for (let n = 0; n < 5; n++) {
        for (let d = 0; d < 7; d++) {
            // 先月、来月の日付を表示
            if (n === 0 && d < firstDay) {
                createCalendarHtml += '<div class="prev-month-day">' + (prevLastDayCount - (firstDay - d - 1)) + '</div>';
            } else if (!isNextMonth && dayCount <= lastDayCount) {
                let dateKey = `${year}-${String(month).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                let icon = dailyWeather[dateKey]; // 日付に対応する天気アイコンを取得

                createCalendarHtml += `<div class="current-month-day">
                    ${dayCount}
                    ${icon ? `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" class="weather-icon">` : ''}
                </div>`;
                
                dayCount++;
            } else {
                isNextMonth = true;
                createCalendarHtml += '<div class="next-month-day">' + (dayCount - lastDayCount) + '</div>';
                dayCount++;
            }
        }
    }
    
    // HTMLをerbファイルの指定したidのところへ実行する
    document.getElementById('year-month').innerHTML = createYearMonthHtml;
    document.getElementById('calendar_body').innerHTML = createCalendarHtml;
    
    // イベントの表示
    const taskElements = document.querySelectorAll('.task'); // 例: タスクを含む要素を選択
    const tasks = Array.from(taskElements);
   
    tasks.forEach(task => {
        // data-* 属性から値を取得
        const id = task.dataset.id;
        const taskName = task.dataset.taskName;
        const startTime = task.dataset.startTime;
        const endTime = task.dataset.endTime;
        const tagColorId = task.dataset.tagColor;
        
        
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        // タスクの開始月が現在表示している月と異なる場合は表示しない
        if (startDate.getMonth() + 1 !== currentMonth) {
            return;
        }
        
        const firstDate = new Date(year, month-1, 1);
        const firstDay = firstDate.getDay();
        
        // イベントの日付に応じてgridの行と列を計算
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        
        // 同じ日付に重複するタスクをフィルタリング
        const overlappingTasks = tasks.filter(t => {
            const taskStart = new Date(t.dataset.startTime);
            const taskEnd = new Date(t.dataset.endTime);
            const taskStartMonth = taskStart.getMonth() + 1; // 月は0から始まるため
            const taskEndMonth = taskEnd.getMonth() + 1;
    
            // 他のタスクの開始日と終了日の間にタスクがある場合にフラグを立てる
            const isWithinCurrentMonth = (taskStartMonth === currentMonth || taskEndMonth === currentMonth) &&
                (taskStart.getDate() <= endDay && taskEnd.getDate() >= startDay);
    
            return isWithinCurrentMonth;
        });

        const taskPosition = overlappingTasks.indexOf(task); // 現在のタスクの位置
        const overlappingCount = overlappingTasks.length;　// 重複タスクの数
        
        const gridRowStart = Math.floor((startDay + firstDay - 1) / 7) + 2; // 日に基づいて計算
        let gridRowEnd = Math.floor((endDay + firstDay - 1) / 7) + 2;
        const gridColumnStart = (startDate.getDay() + 1); // 曜日に基づいて計算
        const gridColumnEnd = (endDate.getDay() + 2);
        
        
        const backgroundColor = tagColors[tagColorId] || 'rgb(74, 222, 128)';
        
        // 重複タスクのポジションで高さ調整
        document.getElementById('calendar_body').innerHTML += `
            <div data-id="${id}" class="calendar__event" 
                style="
                    grid-column: ${gridColumnStart} / ${gridColumnEnd}; 
                    grid-row: ${gridRowStart}; 
                    margin-top: ${(taskPosition + 1) * 2}rem;
                    background-color: ${backgroundColor};
                    color: white;
                ">
                ${taskName}
            </div>`;
        
        // タスクにtask.idを付与
        const taskElement = document.createElement('div');
        taskElement.dataset.id = id;
        taskElement.classList.add('calendar__event');
        taskElement.style.gridColumn = `${gridColumnStart} / ${gridColumnEnd}`;
        taskElement.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        taskElement.style.marginTop = `${(taskPosition + 1) * 2}rem`;
        taskElement.textContent = taskName;
        taskElement.style.opacity = 0;
        
        taskElement.addEventListener('click', () => {
            openEditModal(id);
        });
        
        document.getElementById('calendar_body').appendChild(taskElement);
    });
    
}

// １週間表示のカレンダーを生成
function generateWeekCalendar(year, month, date){
    const todayDay = date.getDay();
    const todayDate = date.getDate();
    const weekFirstDay = new Date(year, month-1, todayDate - todayDay);
    const weekFirstDate = weekFirstDay.getDate();

    let dayCount = 1;
    let createYearMonthHtml = '<h1 class="year-month">' + year + '/' + month + '</h1>'
    let createCalendarHtml = "";

    const weeks = ['日', '月', '火', '水', '木', '金', '土'];

    createCalendarHtml += '<div class="Sunday">' + weeks[0] + '</div>';

    for (let i = 1; i < weeks.length - 1; i++){
        createCalendarHtml += '<div class="weekday">' + weeks[i] + '</div>';
    }

    createCalendarHtml += '<div class="Saturday">' + weeks[6] + '</div>';

    for (let d = 0; d < 7; d++){
        createCalendarHtml += '<div class="prev-month-day">' + (weekFirstDate + d) + '</div>';
    }
    document.querySelector('#year-month').innerHTML = createYearMonthHtml;
    document.querySelector('#calendar_body').innerHTML = createCalendarHtml;

}

// 1日のカレンダーを表示
function generateDayCalendar(year, month, date){
    const todayDate = date.getDate();

    let createYearMonthHtml = '<h1 class="year-month">' + year + '/' + month + '/' + todayDate + '</h1>';
    let createCalendarHtml = "";

    const weeks = ['日', '月', '火', '水', '木', '金', '土'];

    switch (date.getDay()){
        case 0:
            createCalendarHtml += '<div class="Sunday">' + weeks[date.getDay()] + '</div>';
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            createCalendarHtml += '<div class="weekday">' + weeks[date.getDay()] + '</div>';
            break;
        case 6:
            createCalendarHtml += '<div class="Saturday">' + weeks[date.getDay()] + '</div>';
            break;
    }

    createCalendarHtml += '<div class="prev-month-day">' + todayDate + '</div>';

    document.querySelector('#year-month').innerHTML = createYearMonthHtml;
    document.querySelector('#calendar_body').innerHTML = createCalendarHtml
}

const todayDay = date.getDay();
const todayDate = date.getDate();
const weekFirstDate = new Date(year, month-1, todayDate - todayDay);

// 初期状態では今月を表示
displayType.onchange = () => {
    switch (displayType.value){
        case "month":
            generateCalendar(currentMonth, currentMonth)
            break;

        case "week":
            generateWeekCalendar(currentYear, currentMonth, date)
            break;
        
        case "day":
            generateDayCalendar(currentYear, currentMonth, date)
            break;
    }
}

generateCalendar(currentYear, currentMonth);
// generateWeekCalendar(currentYear, currentMonth, date);

// 先月のボタンクリックイベント
prevMonthButton.addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', function(){
    currentMonth++;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});


// ハンバーガーメニュー

let nav = document.getElementById('calendar_menu');
let btn = document.querySelector('.toggle-btn');
let mask = document.getElementById('mask');

btn.onclick = () => {
    nav.classList.toggle('open');
};

mask.onclick = () =>{
    nav.classList.toggle('open');
};


// 予定作成のモーダルウィンドウ

const open = document.getElementById('event-modal-open')
const container = document.getElementById('event-modal-container')
const modalBg = document.getElementById('modal-bg')
const close = document.getElementById('event-modal-close')

open.addEventListener('click', () => {
    container.classList.add('active');
    modalBg.classList.add('active');
});

close.addEventListener('click', () => {
    container.classList.remove('active');
    modalBg.classList.remove('active');
});

modalBg.addEventListener('click', () => {
    container.classList.remove('active');
    modalBg.classList.remove('active');
});


//　予定編集のモーダルウィンドウ

const calendarId = window.location.pathname.split("/")[2];

const openEditModal = (id) => {
    fetch(`/calendar/${calendarId}/task/${id}/edit`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(task => {
        const editModal = document.getElementById('edit-modal-container');
        const taskNameInput = editModal.querySelector('.task-name');
        const startDateInput = editModal.querySelector('#start-date');
        const startTimeInput = editModal.querySelector('#start-time');
        const endDateInput = editModal.querySelector('#end-date');
        const endTimeInput = editModal.querySelector('#end-time');
        const form = editModal.querySelector('form');
        const deleteLink = document.getElementById('delete-task-link');

        // フォームのactionを動的に設定
        form.action = `/calendar/${calendarId}/task/${id}/edit`;
        
        // 削除リンクのhrefを動的に設定
        deleteLink.href = `/calendar/${calendarId}/task/${id}/delete`;


        // タスク情報をモーダルにセット
        taskNameInput.value = task.task_name;
        startDateInput.value = task.start_time.split('T')[0];
        startTimeInput.value = task.start_time.split('T')[1].substring(0, 5);
        endDateInput.value = task.end_time.split('T')[0];
        endTimeInput.value = task.end_time.split('T')[1].substring(0, 5);

        editModal.classList.add('active');
        modalBg.classList.add('active');
    })
    .catch(error => console.error('Error:', error));
};
    

const closeEditModal = () => {
    const editModal = document.getElementById('edit-modal-container');
    editModal.classList.remove('active');
    modalBg.classList.remove('active');
};

document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);
modalBg.addEventListener('click', closeEditModal);

document.querySelectorAll('.calendar__event').forEach(event => {
    event.addEventListener('click', function() {
        const taskId = this.dataset.id;
        openEditModal(taskId);
    });
});