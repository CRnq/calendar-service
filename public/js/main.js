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
    
    createCalendarHtml = '<table class="calendar-table">' + '<tr>';
    
    const weeks = ['日', '月', '火', '水', '木', '金', '土']
    
    createCalendarHtml += '<td class="Sunday">' + weeks[0] + '</td>';
    
    for (let i = 1; i < weeks.length-1; i++) {
        createCalendarHtml += '<td class="weekday">' + weeks[i] + '</td>';
    }
    
    createCalendarHtml += '<td class="Saturday">' + weeks[6] + '</td>';
    
    createCalendarHtml += '</tr>';
    
    let isNextMonth = false;
    
    // ５週分繰り返す
    for (let n = 0; n < 5; n++){
        createCalendarHtml += '<tr>';
        for (let d = 0; d < 7; d++){
            // 先月、来月の日付を表示
            if (n == 0 && d < firstDay){
                createCalendarHtml += '<td class="prev-month">' + (prevLastDayCount - (firstDay - d - 1)) + '</td>';
            } else if (!isNextMonth && dayCount <= lastDayCount){
                createCalendarHtml += '<td class="current-month">' + dayCount + '</td>';
                dayCount++;
            } else {
                isNextMonth = true;
                createCalendarHtml += '<td class="next-month">' + (dayCount - lastDayCount) + '</td>';
                dayCount++;
            }
        }
    
        createCalendarHtml += '</tr>';
    }
    createCalendarHtml += '</table>';
    
    // HTMLをerbファイルの指定したidのところへ実行する
    document.getElementById('year-month').innerHTML = createYearMonthHtml;
    document.getElementById('calendar_body').innerHTML = createCalendarHtml;
}

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


// 選択したタグの色の表示
document.addEventListener("DOMContentLoaded", function() {
  const colorBoxes = document.querySelectorAll(".color-box");
  const selectedColorInput = document.getElementById("selected-color");

  colorBoxes.forEach(box => {
    box.addEventListener("click", function() {
      // 選択された色のボーダーを更新
      colorBoxes.forEach(box => box.classList.remove("selected"));
      this.classList.add("selected");

      // 選択された色をhidden inputに設定
      selectedColorInput.value = this.dataset.color;
      console.log("選択された色:", this.dataset.color);
    });
  });
});



