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
    for (let i = 0; i < weeks.length; i++) {
        createCalendarHtml += '<td class="days">' + weeks[i] + '</td>';
    }
    createCalendarHtml += '</tr>';
    
    let isNextMonth = false;
    
    // ５週分繰り返す
    for (let n = 0; n < 5; n++){
        createCalendarHtml += '<tr>';
        for (let d = 0; d < 7; d++){
            // 先月、来月の日付を表示しない（後々する）
            if (n == 0 && d < firstDay){
                createCalendarHtml += '<td>' + (prevLastDayCount - (firstDay - d - 1)) + '</td>';
            } else if (!isNextMonth && dayCount <= lastDayCount){
                createCalendarHtml += '<td>' + dayCount + '</td>';
                dayCount++;
            } else {
                isNextMonth = true;
                createCalendarHtml += '<td>' + (dayCount - lastDayCount) + '</td>';
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