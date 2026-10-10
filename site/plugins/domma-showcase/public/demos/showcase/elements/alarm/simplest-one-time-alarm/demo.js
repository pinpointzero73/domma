/**
 * Simplest One-Time Alarm - from public/showcase/elements/alarm.
 */
export function mount(root) {
    const alarmManager = E.alarm({
            onTrigger: async (alarm) => {
                console.log('Alarm triggered:', alarm);
                await E.alert(
                    `Alarm: ${alarm.label}\nTime: ${alarm.time}`,
                    {title: 'Alarm Triggered'}
                );
            },
            onAlarmAdd: () => updateAllLists(),
            onAlarmRemove: () => updateAllLists()
        });
        // Helper to format alarm time (next minute)
    function getNextMinuteTime(minutesAhead = 1) {
            return D().add(minutesAhead, 'minutes').format('HH:mm');
        }
        // Helper to render alarm list
    function renderAlarmList(containerId, alarms) {
            const $container = $('#' + containerId);
            if (!alarms || alarms.length === 0) {
                $container.html('<p class="text-muted">No alarms set</p>');
                return;
            }

            $container.html(alarms.map(alarm => `
                <div class="alarm-item-style ${alarm.enabled ? '' : 'disabled'}">
                    <div class="alarm-info-style">
                        <div class="alarm-time-style">${alarm.time}</div>
                        <div class="alarm-label-style">${alarm.label}</div>
                        <div class="alarm-repeat-style">${getRepeatText(alarm.repeat)}</div>
                    </div>
                    <div class="alarm-controls-style">
                        <button class="btn btn-sm btn-secondary" onclick="toggleAlarm('${alarm.id}')">
                            ${alarm.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAlarm('${alarm.id}')">Delete</button>
                    </div>
                </div>
            `).join(''));
        }
    function getRepeatText(repeat) {
            if (!repeat) return 'One-time';
            if (repeat === 'daily') return 'Daily';
            if (repeat === 'weekdays') return 'Weekdays';
            if (repeat === 'weekends') return 'Weekends';
            if (Array.isArray(repeat)) return repeat.join(', ');
            return repeat;
        }
    function toggleAlarm(id) {
            alarmManager.toggle(id);
            updateAllLists();
        };
    function deleteAlarm(id) {
            alarmManager.remove(id);
            updateAllLists();
        };
    function updateAllLists() {
            const allAlarms = alarmManager.getAlarms();
            ['tutorial-alarm-list', 'example-workday-list', 'example-fitness-list', 'example-medication-list'].forEach(id => {
                if ($('#' + id).length) renderAlarmList(id, allAlarms);
            });
        }
        // Quick Start demos
    $(root).find('#quick-alarm').on('click', () => {
            const time = getNextMinuteTime(1);
            alarmManager.add({
                time: time,
                label: 'Quick Reminder',
                notification: true
            });
            $(root).find('#quick-status').text(`✓ Alarm set for ${time}`).removeClass().addClass('mt-2 text-success');
        });
}
