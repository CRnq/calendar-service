const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const firstDate = new Date(year, month-1, 1);
const firstDay = firstDate.getDay();
const lastDate = new Date(year, month, 0);
const lastDayCount = lastDate.getDate();

let dayCount = 1;
let createYearMonthHtml = '<h1 class="year-month">' + year + '/' + month + '</h1>'
let createCalendarHtml = "";

createCalendarHtml = '<table class="calendar-table">' + '<tr>';

const weeks = ['日', '月', '火', '水', '木', '金', '土']
for (let i = 0; i < weeks.length; i++) {
    createCalendarHtml += '<td class="days">' + weeks[i] + '</td>';
}
createCalendarHtml += '</tr>';

// ５週分繰り返す
for (let n = 0; n < 5; n++){
    createCalendarHtml += '<tr>';
    for (let d = 0; d < 7; d++){
        // 先月、来月の日付を表示しない（後々する）
        if (n == 0 && d < firstDay){
            createCalendarHtml += '<td></td>';
        } else if (dayCount > lastDayCount){
            createCalendarHtml += '<td></td>';
        } else {
            createCalendarHtml += '<td>' + dayCount + '</td>';
            dayCount++;
        }
    }

    createCalendarHtml += '</tr>';
}
createCalendarHtml += '</table>';


// HTMLをerbファイルの指定したidのところへ実行する
document.getElementById('year-month').innerHTML = createYearMonthHtml;
document.getElementById('calendar_body').innerHTML = createCalendarHtml;
