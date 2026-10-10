/**
 * Current Date Components - from public/showcase/dates.
 */
export function mount(root) {
        // Getters display
    function updateGetters() {
            const now = D();
            const getters = [
                ['year()', now.year()],
                ['month()', now.month()],
                ['date()', now.date()],
                ['day()', now.day()],
                ['hour()', now.hour()],
                ['minute()', now.minute()],
                ['second()', now.second()],
                ['dayOfYear()', now.dayOfYear()],
                ['week()', now.week()],
                ['quarter()', now.quarter()],
                ['daysInMonth()', now.daysInMonth()],
                ['isLeapYear()', now.isLeapYear()]
            ];

            $(root).find('#getters-display').html(getters.map(([name, value]) =>
              `<div class="p-3 bg-white rounded border">
                        <div class="text-sm text-muted">${name}</div>
                        <div class="font-semibold">${value}</div>
                    </div>`
            ).join(''));
        }
    updateGetters();
}
