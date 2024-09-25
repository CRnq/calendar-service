// カレンダーの表示

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1

let currentYear = year;
let currentMonth = month;

const prevMonthButton = document.getElementById('prev-month-button')
const nextMonthButton = document.getElementById('next-month-button')

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
    
    // ５週分繰り返す
    for (let n = 0; n < 5; n++){
        for (let d = 0; d < 7; d++){
            // 先月、来月の日付を表示
            if (n == 0 && d < firstDay){
                createCalendarHtml += '<div class="prev-month-day">' + (prevLastDayCount - (firstDay - d - 1)) + '</div>';
            } else if (!isNextMonth && dayCount <= lastDayCount){
                createCalendarHtml += '<div class="current-month-day">' + dayCount + '</div>';
                dayCount++;
            } else {
                isNextMonth = true;
                createCalendarHtml += '<div class="next-month-day">' + (dayCount - lastDayCount) + '</div>';
                dayCount++;
            }
        }
    }
    
    // イベントの追加
    createCalendarHtml += '<div class="calendar__event calendar__event--done" style="grid-column: 2 / 5; grid-row: 2; margin-top: 2rem;">Metting</div>'
    
    // HTMLをerbファイルの指定したidのところへ実行する
    document.getElementById('year-month').innerHTML = createYearMonthHtml;
    document.getElementById('calendar_body').innerHTML = createCalendarHtml;
}

// タスクの追加
tasks.forEach(task => {
  const startDate = new Date(task.start_time);
  const endDate = new Date(task.end_time);
  
  // イベントの日付に応じてgridの行と列を計算
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  const gridRowStart = Math.floor((startDay - 1) / 7) + 2; // 日に基づいて計算
  const gridColumnStart = (startDate.getDay() + 1); // 曜日に基づいて計算
  const gridColumnEnd = (endDate.getDay() + 2);

  // イベントを配置
  const eventHtml = `<div class="calendar__event" style="grid-column: ${gridColumnStart} / ${gridColumnEnd}; grid-row: ${gridRowStart};">${task.task_name}</div>`;
    
  document.getElementById('calendar_body').insertAdjacentHTML('beforeend', eventHtml);
});

// 初期状態では今月を表示
generateCalendar(currentYear, currentMonth);

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

let nav = document.getElementById('calendar_menu')
let btn = document.querySelector('.toggle-btn')
let mask = document.getElementById('mask')

btn.onclick = () => {
    nav.classList.toggle('open');
}

mask.onclick = () =>{
    nav.classList.toggle('open');
}


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

const open_edit = document.getElementById('edit-modal-container')
const container_edit = document.getElementById('edit-modal-container')
const close_edit = document.getElementById('edit-modal-close')

open_edit.addEventListener('click', () => {
    container_edit.classList.add('active');
    modalBg.calssList.add('active');
});

close_edit.addEventListener('click', () => {
    container_edit.classList.remove('active');
    modalBg.classList.remove('active');
});

modalBg.addEventListener('click', () => {
    container_edit.classList.remove('active');
    modalBg.classList.remove('active');
});