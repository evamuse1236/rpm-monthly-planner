// RPM Monthly Planner Generator
// Main JavaScript logic for generating planner pages

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    populateYearDropdown();

    // Set default to current month/year
    const now = new Date();
    document.getElementById('month-select').value = now.getMonth();
    document.getElementById('year-select').value = now.getFullYear();

    // Generate day checkboxes for the current month
    generateDayCheckboxes();

    // Event listeners
    document.getElementById('generate-btn').addEventListener('click', generatePlanner);
    document.getElementById('export-btn').addEventListener('click', exportToPDF);
    
    // Day selector event listeners
    document.getElementById('month-select').addEventListener('change', generateDayCheckboxes);
    document.getElementById('year-select').addEventListener('change', generateDayCheckboxes);
    document.getElementById('select-all-btn').addEventListener('click', selectAllDays);
    document.getElementById('select-none-btn').addEventListener('click', selectNoDays);
    document.getElementById('select-weekdays-btn').addEventListener('click', selectWeekdaysOnly);

    // Generate initial preview
    generatePlanner();
}

function populateYearDropdown() {
    const yearSelect = document.getElementById('year-select');
    const currentYear = new Date().getFullYear();

    // Add years from current year - 2 to current year + 5
    for (let year = currentYear - 2; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
}

function generateDayCheckboxes() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    const daysInMonth = getDaysInMonth(year, month);
    const container = document.getElementById('day-checkboxes');
    
    container.innerHTML = '';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday
        const dayName = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeek];
        const isSunday = dayOfWeek === 0;
        
        const wrapper = document.createElement('div');
        wrapper.className = `day-checkbox ${isSunday ? 'sunday' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `day-${day}`;
        checkbox.value = day;
        checkbox.checked = true; // All days selected by default
        
        const label = document.createElement('label');
        label.htmlFor = `day-${day}`;
        label.innerHTML = `<span class="day-name">${dayName}</span>${day}`;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    }
}

function getSelectedDays() {
    const checkboxes = document.querySelectorAll('#day-checkboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

function selectAllDays() {
    document.querySelectorAll('#day-checkboxes input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });
}

function selectNoDays() {
    document.querySelectorAll('#day-checkboxes input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
}

function selectWeekdaysOnly() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    
    document.querySelectorAll('#day-checkboxes input[type="checkbox"]').forEach(cb => {
        const day = parseInt(cb.value);
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        // Check if it's a weekday (Monday-Friday = 1-5)
        cb.checked = dayOfWeek >= 1 && dayOfWeek <= 5;
    });
}

// =====================
// HELPER FUNCTIONS
// =====================

// Little hand-drawn pen doodles, inline SVG so they print crisply.
//
// Every shape here is deliberately IRREGULAR: no ray sits at an exact 45°,
// no two petals share a radius, the star's points differ in length and the
// heart leans. Perfectly symmetric icons are the single loudest tell that a
// "handmade" planner was drawn by a machine, and at these sizes the wonk is
// what the eye reads as a human hand.
function doodle(name, cls = '') {
    const art = {
        // points at uneven radii and angles; one arm noticeably longer
        star: '<path d="M12.3 2.9 L14.6 8.8 L20.4 9.2 L15.2 13.4 L17.4 19.9 L11.7 16.1 L6.9 20.1 L8.9 13.2 L3.9 9.1 L9.9 8.5 Z"/>',
        // egg-ish centre, eight rays at uneven angles and lengths
        sun: '<path d="M8.2 12.4 C8 9.7 9.8 7.7 12.3 7.8 C14.9 7.9 16.5 9.9 16.2 12.5 C15.9 14.8 14.1 16.3 11.8 16.2 C9.6 16.1 8.4 14.5 8.2 12.4 Z"/><path d="M12.2 2.5 V5.3 M11.7 19.2 L12 22.4 M2.7 11.5 L5.2 11.8 M19.5 12.3 L22.2 11.9 M4.7 4.5 L7 6.6 M17.2 17.7 L19.5 19.3 M19.7 4.7 L17.3 7 M6.5 17.3 L4.4 19.6"/>',
        // four lobes, none matching
        sparkle: '<path d="M12.4 3.6 C13.2 8.8 15.4 11.2 20.3 12.1 C15.1 13.1 12.9 15.4 11.8 20.4 C11.1 15.2 8.7 12.8 3.7 11.9 C9.1 11.1 11.4 8.7 12.4 3.6 Z"/>',
        // lopsided, left lobe fuller than the right
        heart: '<path d="M11.8 19.2 C5.9 14.3 3.8 10.6 5.4 7.7 C7.1 5.1 10.4 5.5 12.1 8.1 C13.9 5.8 17.2 5.2 18.6 8 C20 10.8 17.7 14.2 11.8 19.2 Z"/>',
        coffee: '<path d="M4.9 9.2 C8.6 8.8 12.3 8.9 16.1 9.1 C16.3 11.2 16.2 13.3 15.9 15.4 C15.6 17.9 13.9 19.2 11.7 19.1 C9.2 19 7.4 18.6 6 16.9 C4.9 15.5 4.8 12.3 4.9 9.2 Z M16.2 10.6 C18.4 10.3 19.6 11.5 19.4 13.2 C19.2 14.9 18 15.6 16.1 15.4 M8.4 6.1 C9 5 8 4.3 8.6 3 M11.9 6.2 C12.5 5.1 11.4 4.4 12 3.1"/>',
        arrow: '<path d="M3.8 16.4 C8.3 15.2 13.7 12.6 18.9 6.8 M18.9 6.8 L14.4 7.9 M18.9 6.8 L18.5 11.2"/>',
        // five petals, all different sizes, centre off-axis
        flower: '<circle cx="11.8" cy="12.2" r="2"/><path d="M11.6 3.2 C14.1 3.6 15 5.9 13.6 8.2 C12.9 9.4 11.4 9.9 10.2 9.2 C8.3 8.1 8.9 4.9 11.6 3.2 Z"/><path d="M19.9 8.4 C21.3 10.6 20.2 12.9 17.5 13.1 C16.1 13.2 15.1 12.1 15.4 10.8 C15.8 8.7 18.2 7.5 19.9 8.4 Z"/><path d="M17.2 18.9 C15.4 20.7 12.9 20.1 12.4 17.5 C12.2 16.3 13.1 15.3 14.4 15.4 C16.5 15.6 18 17.4 17.2 18.9 Z"/><path d="M7.4 17.9 C6.4 15.7 7.9 13.9 10.2 14.6 C11.4 15 11.9 16.3 11.2 17.4 C10.2 19.1 8.2 19.3 7.4 17.9 Z"/><path d="M4.3 9.6 C6.2 8.1 8.5 9.1 8.6 11.7 C8.7 13 7.6 13.9 6.4 13.5 C4.4 12.9 3.4 10.7 4.3 9.6 Z"/>',
        bulb: '<path d="M11.6 3.4 C15.4 3.1 18.2 6.1 17.6 9.4 C17.2 11.6 15.6 12.6 15.1 13.9 C14.8 14.7 14.9 15.3 14.8 16 L10.2 15.9 C10.1 15.1 10.1 14.5 9.7 13.7 C9 12.4 7.2 11.3 7 9.1 C6.7 5.9 8.6 3.6 11.6 3.4 Z M10.1 18.7 L14.2 18.9 M10.7 21 L13.5 20.8"/>',
        drop: '<path d="M12.1 3.7 C9.2 8.3 6.4 11.4 6.6 14.7 C6.8 18 9 20.1 12.2 20 C15.3 19.9 17.5 17.6 17.4 14.4 C17.3 11.3 14.9 8.2 12.1 3.7 Z"/>',
        bolt: '<path d="M13.4 2.8 L5.8 13.7 L10.6 13.4 L9.7 21.2 L18.2 9.8 L13.2 10.2 Z"/>'
    };
    return `<svg class="doodle ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${art[name]}</svg>`;
}

function getMonthName(monthIndex) {
    const months = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    return months[monthIndex];
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function getDayName(dayIndex) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[dayIndex];
}

function getFullDayName(dayIndex) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[dayIndex];
}

function formatDate(day, month, year) {
    // Format: DD/MM/YY
    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    const yy = String(year).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

function getWeeksInMonth(year, month) {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const weeks = [];

    let currentWeek = [];
    let dayOfMonth = 1;

    // Fill in days before the 1st (from previous month)
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = 0; i < firstDay; i++) {
        currentWeek.push({
            day: daysInPrevMonth - firstDay + 1 + i,
            month: prevMonth,
            year: prevYear,
            isCurrentMonth: false
        });
    }

    // Fill in current month days
    while (dayOfMonth <= daysInMonth) {
        currentWeek.push({
            day: dayOfMonth,
            month: month,
            year: year,
            isCurrentMonth: true
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        dayOfMonth++;
    }

    // Fill in remaining days from next month
    if (currentWeek.length > 0) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        let nextDay = 1;

        while (currentWeek.length < 7) {
            currentWeek.push({
                day: nextDay++,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false
            });
        }
        weeks.push(currentWeek);
    }

    return weeks;
}

// =====================
// PAGE GENERATORS
// =====================

function generateTitlePage(month, year) {
    const monthName = getMonthName(month);
    const monthNum = String(month + 1).padStart(2, '0');

    // lowercase throughout — the calendar page says "august", so the title
    // page shouldn't say "August"
    const monthTitle = monthName.toLowerCase();

    return `
        <div class="page title-page">
            <div class="tp-eyebrow">my rapid planning month</div>
            <div class="tp-numeral-wrap">
                <span class="tp-swipe"></span>
                <div class="tp-numeral">${monthNum}</div>
            </div>
            <div class="tp-rule"></div>
            <h1 class="tp-month">${monthTitle}</h1>
            <div class="tp-year">${year}</div>
            <div class="tp-plan">
                <div class="tp-plan-head">
                    <span class="tp-plan-title">the month, in one block</span>
                    <span class="tp-plan-step">r · p · map</span>
                </div>
                <div class="tp-field">
                    <div class="tp-k">result — what do I want this month?</div>
                    <div class="tp-line"></div>
                </div>
                <div class="tp-field">
                    <div class="tp-k">purpose — why do I want it?</div>
                    <div class="tp-line"></div>
                </div>
                <div class="tp-map">
                    <div class="tp-k">massive action — how do I get there?</div>
                    <div class="tp-action"><span class="tp-tick"></span></div>
                    <div class="tp-action"><span class="tp-tick"></span></div>
                    <div class="tp-action"><span class="tp-tick"></span></div>
                    <div class="tp-action"><span class="tp-tick"></span></div>
                    <div class="tp-action"><span class="tp-tick"></span></div>
                </div>
            </div>
        </div>
    `;
}

function generateMonthlyCalendar(year, month) {
    const monthName = getMonthName(month);
    const weeks = getWeeksInMonth(year, month);
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    let calendarRows = '';

    // hand-numbered tabs, one per week column, naming the weekly spread
    // this column corresponds to
    const weekTabs = weeks
        .map((_, i) => `<div class="week-tab"><span>w${i + 1}</span></div>`)
        .join('');

    dayNames.forEach((dayName, dayIndex) => {
        let cells = '';

        // For each week, get the day that falls on this dayIndex
        weeks.forEach(week => {
            const dayInfo = week[dayIndex];
            const isSunday = dayIndex === 0;
            const dateClass = isSunday ? 'sunday' : '';
            const otherMonthClass = !dayInfo.isCurrentMonth ? 'other-month' : '';

            cells += `
                <div class="calendar-cell">
                    <span class="date-number ${otherMonthClass}">${String(dayInfo.day).padStart(2, '0')}</span>
                </div>
            `;
        });

        const headerClass = dayIndex === 0 ? 'day-header sunday' : 'day-header';
        // sun (top row) and sat (bottom row) get a light hatch band — the
        // weekend cue used to be coral text, which vanishes in grayscale
        const isWeekend = dayIndex === 0 || dayIndex === 6;

        calendarRows += `
            <div class="calendar-row ${isWeekend ? 'weekend' : ''}">
                <div class="${headerClass}">${dayName}</div>
                <div class="calendar-cells">${cells}</div>
            </div>
        `;
    });

    return `
        <div class="page monthly-calendar">
            <header class="ledger-head">
                <div class="lh-left">
                    <div class="lh-eyebrow">the month ahead</div>
                    <div class="lh-title">${monthName.toLowerCase()} ${doodle('star', 'lh-doodle')}</div>
                </div>
                <div class="lh-right">
                    <div class="lh-mono">${year}</div>
                    <div class="lh-sub">my rpm planner</div>
                </div>
            </header>
            <div class="rule-double"></div>
            <div class="week-tabs">
                <div class="wt-spacer"></div>
                <div class="wt-cells">${weekTabs}</div>
            </div>
            <div class="calendar-grid">
                ${calendarRows}
            </div>
            <div class="page-foot">
                <span class="pf-quote">one step at a time. you'll get there ${doodle('heart', 'pf-doodle')}</span>
                <span class="pf-folio">${monthName.toLowerCase()} ${year}</span>
            </div>
        </div>
    `;
}

function generateWeeklyPlanner(weekNumber, week, month, year) {
    // week is an array of 7 day objects (Sun..Sat) from getWeeksInMonth
    const monthName = getMonthName(month);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const dayLabel = (dayIndex) => {
        const info = week[dayIndex];
        const otherClass = info.isCurrentMonth ? '' : 'other-month';
        return `
            <div class="weekday-label">
                <span class="wd-name">${dayNames[dayIndex]}</span>
                <span class="wd-date ${otherClass}">${String(info.day).padStart(2, '0')}</span>
            </div>
        `;
    };

    let weekdayBoxes = '';
    for (let d = 1; d <= 5; d++) {
        weekdayBoxes += `
            <div class="weekday-box">
                ${dayLabel(d)}
            </div>
        `;
    }

    return `
        <div class="page weekly-planner">
            <header class="ledger-head">
                <div class="lh-left">
                    <div class="lh-eyebrow">weekly planner</div>
                    <div class="lh-title">week ${weekNumber} ${doodle('coffee', 'lh-doodle')}</div>
                </div>
                <div class="lh-right">
                    <div class="lh-mono">${year}</div>
                    <div class="lh-sub">${monthName.toLowerCase()}</div>
                </div>
            </header>
            <div class="rule-double"></div>
            <div class="week-body">
                <div class="weekday-col">
                    ${weekdayBoxes}
                </div>
                <div class="weekend-col">
                    <div class="weekend-day">
                        ${dayLabel(6)}
                    </div>
                    <div class="weekend-day">
                        ${dayLabel(0)}
                    </div>
                </div>
            </div>
            <div class="page-foot">
                <span class="pf-quote">where focus goes, energy flows ${doodle('arrow', 'pf-doodle')}</span>
                <span class="pf-folio">week ${weekNumber} · ${monthName.toLowerCase()} ${year}</span>
            </div>
        </div>
    `;
}

function generateDailyPage(day, month, year) {
    const dateStr = formatDate(day, month, year);
    const dayOfWeek = new Date(year, month, day).getDay();

    // Hourly slots, 07:00–23:00, set as a 24-hour timetable
    let timeSlots = '';
    const highlightTimes = ['12:00', '18:00'];

    for (let h = 7; h <= 23; h++) {
        const time = String(h).padStart(2, '0') + ':00';
        const isHighlight = highlightTimes.includes(time);
        timeSlots += `
            <div class="time-slot ${isHighlight ? 'highlight' : ''}">
                <span class="time-label">${time}</span>
            </div>
        `;
    }

    const monthName = getMonthName(month);
    const dayNum = String(day).padStart(2, '0');
    const monthTitle = monthName.charAt(0) + monthName.slice(1).toLowerCase();

    return `
        <div class="page daily-page">
            <div class="dp-head">
                <div class="lh-left">
                    <div class="lh-eyebrow">today's plan</div>
                    <div class="dp-date">${dayNum} ${monthTitle.toLowerCase()}</div>
                </div>
                <div class="dp-daybox">${getFullDayName(dayOfWeek).toLowerCase()}</div>
            </div>
            <div class="rule-double"></div>
            <div class="dp-body">
                <div class="schedule-section">
                    <div class="sec-head">
                        ${doodle('coffee', 'sec-doodle')}
                        <span class="sec-title">commit &amp; schedule</span>
                        <span class="sec-step">steps 3–4</span>
                    </div>
                    <div class="sec-sub">block time for your musts!</div>
                    <div class="schedule-box">
                        ${timeSlots}
                    </div>
                </div>
                <div class="capture-section">
                    <div class="sec-head">
                        ${doodle('bulb', 'sec-doodle')}
                        <span class="sec-title">capture</span>
                        <span class="sec-step">step 1</span>
                    </div>
                    <div class="sec-sub">ideas, wants, needs — get it all out</div>
                    <div class="capture-box"></div>

                    <div class="comms-section">
                        <div class="sec-head">
                            ${doodle('arrow', 'sec-doodle')}
                            <span class="sec-title">calls &amp; follow-ups</span>
                        </div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                    </div>

                    <div class="wellness-section">
                        <div class="wellness-item"><span class="checkbox"></span>did I hydrate? ${doodle('drop', 'wi-doodle')}</div>
                        <div class="wellness-item"><span class="checkbox"></span>did I move? ${doodle('bolt', 'wi-doodle')}</div>
                        <div class="wellness-item"><span class="checkbox"></span>what am I grateful for? ${doodle('heart', 'wi-doodle')}</div>
                    </div>
                </div>
            </div>
            <div class="steps-foot">
                <span class="sf-on"><span class="sf-num">1</span>capture</span>
                <span><span class="sf-num">2</span>master plan</span>
                <span class="sf-on"><span class="sf-num">3</span>commit</span>
                <span class="sf-on"><span class="sf-num">4</span>schedule</span>
                <span><span class="sf-num">5</span>celebrate</span>
                <span>${dateStr}</span>
            </div>
        </div>
    `;
}

function generateRPMPage(day, month, year) {
    const dateStr = formatDate(day, month, year);
    const dayOfWeek = new Date(year, month, day).getDay();

    // Generate day circles
    const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    let dayCircles = '';
    dayLetters.forEach((letter, i) => {
        // Highlight the current day (Monday=0 in this array, but Sunday=0 in JS)
        // Convert: JS Sunday(0) -> index 6, Monday(1) -> index 0, etc.
        const jsToArrayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const isActive = i === jsToArrayIndex;
        dayCircles += `<div class="day-circle ${isActive ? 'active' : ''}">${letter}</div>`;
    });

    // Single full-page table (restored at the user's request). Row count is
    // tuned so the pitch matches the layout they approved; the page now
    // carries a 0.5in bottom margin, so the same pitch buys slightly fewer
    // rows than the original 30.
    let tableRows = '';
    for (let i = 0; i < 28; i++) {
        tableRows += `
                    <div class="table-row">
                        <div class="row-ldp">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div class="row-action"></div>
                        <div class="row-result"></div>
                        <div class="row-purpose"></div>
                    </div>`;
    }

    return `
        <div class="page rpm-page">
            <header class="ledger-head">
                <div class="lh-left">
                    <div class="lh-eyebrow">step 2 · make it real</div>
                    <div class="lh-title">master plan ${doodle('bolt', 'lh-doodle')}</div>
                </div>
                <div class="lh-right">
                    <div class="day-circles">${dayCircles}</div>
                    <div class="rp-date"><span>date</span>${dateStr}</div>
                </div>
            </header>
            <div class="rule-double"></div>
            <div class="incantation">
                <span class="incantation-label">today's incantation:</span>
                <span class="incantation-line"></span>
            </div>
            <div class="ldp-key">tick each action — <strong>L</strong> leverage / delegate it · <strong>D</strong> do it myself · <strong>P</strong> postpone it</div>
            <div class="table-container">
                <div class="table-header">
                    <div class="col-ldp">
                        <div>L</div>
                        <div>D</div>
                        <div>P</div>
                    </div>
                    <div class="col-action">
                        <div class="main-label">massive action plan</div>
                        <div class="sub-label">how can I best achieve it now?</div>
                    </div>
                    <div class="col-result">
                        <div class="main-label">result</div>
                        <div class="sub-label">what do I want?</div>
                    </div>
                    <div class="col-purpose">
                        <div class="main-label">purpose</div>
                        <div class="sub-label">why do I want it?</div>
                    </div>
                </div>
                <div class="table-rule"></div>
                <div class="table-body">
                    ${tableRows}
                </div>
            </div>
            <div class="page-foot">
                <span class="pf-quote">a result is not a to-do list — know what you want, and why ${doodle('sparkle', 'pf-doodle')}</span>
                <span class="pf-folio">master plan · ${dateStr}</span>
            </div>
        </div>
    `;
}

function generateCelebrationPage(day, month, year) {
    const dateStr = formatDate(day, month, year);

    const prompt = (q) => `
        <div class="cp-prompt">
            <div class="cp-q">${q}</div>
            ${'<div class="cp-line"></div>'.repeat(5)}
        </div>
    `;

    // a few hand-drawn ticks so the wins field invites a list rather than
    // presenting an intimidating open dot-field
    const bullet = () => `
            <div class="cp-bullet"><span class="cp-tick"></span><span class="cp-bline"></span></div>`;

    return `
        <div class="page celebration-page">
            <header class="ledger-head">
                <div class="lh-left">
                    <div class="lh-eyebrow">step 5 · complete, measure &amp; celebrate</div>
                    <div class="lh-title">reflect ${doodle('sparkle', 'lh-doodle')}${doodle('star', 'lh-doodle small')}</div>
                </div>
                <div class="lh-right">
                    <div class="lh-mono">${dateStr}</div>
                    <div class="lh-sub">progress = happiness</div>
                </div>
            </header>
            <div class="rule-double"></div>
            <div class="cp-prompts">
                ${prompt('what did I accomplish today?')}
                ${prompt('what did I learn today?')}
                ${prompt('what did I contribute?')}
            </div>
            <div class="cp-reflect">
                <div class="cp-reflect-label">
                    <span class="sec-title">celebrate your wins ${doodle('heart', 'wi-doodle')}</span>
                    <span class="cp-motto">no matter how small!</span>
                </div>
                <div class="cp-bullets">${bullet().repeat(6)}</div>
                <div class="cp-area"></div>
            </div>
            <div class="page-foot">
                <span class="pf-quote">progress is the only thing that makes you happy ${doodle('sparkle', 'pf-doodle')}</span>
                <span class="pf-folio">reflect · ${dateStr}</span>
            </div>
        </div>
    `;
}

// =====================
// MAIN GENERATOR
// =====================

function generatePlanner() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    const container = document.getElementById('planner-content');

    // Show loading state
    container.innerHTML = '<div class="loading">Generating planner</div>';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        let html = '';

        // 1. Title Page
        html += generateTitlePage(month, year);

        // 2. Monthly Calendar
        html += generateMonthlyCalendar(year, month);

        // Get selected days and weeks
        const selectedDays = getSelectedDays();
        const weeks = getWeeksInMonth(year, month);
        
        // 3. For each week, generate weekly planner (if it has selected days) followed by daily pages
        weeks.forEach((week, weekIndex) => {
            // Find which selected days fall in this week
            const daysInThisWeek = selectedDays.filter(day => {
                // Check if this day is part of the current week
                return week.some(weekDay => 
                    weekDay.day === day && 
                    weekDay.month === month && 
                    weekDay.isCurrentMonth
                );
            });
            
            // Only generate weekly planner if there are selected days in this week
            if (daysInThisWeek.length > 0) {
                // Generate weekly planner for this week
                html += generateWeeklyPlanner(weekIndex + 1, week, month, year);
                
                // Generate daily pages for selected days in this week (in order)
                daysInThisWeek.sort((a, b) => a - b);
                for (const day of daysInThisWeek) {
                    // Daily Page
                    html += generateDailyPage(day, month, year);

                    // RPM Page
                    html += generateRPMPage(day, month, year);

                    // Celebration Page
                    html += generateCelebrationPage(day, month, year);
                }
            }
        });

        container.innerHTML = html;

        // Scroll to top of preview
        document.getElementById('preview-container').scrollIntoView({ behavior: 'smooth' });

    }, 100);
}

// =====================
// PDF EXPORT
// =====================

// Fix rotated text for html2canvas compatibility
// html2canvas has issues with writing-mode + transform: rotate(180deg) combination
function fixRotatedTextForExport(container) {
    const elementsToFix = [];
    
    // Find all elements with vertical writing mode and transforms
    container.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        const transform = style.transform;
        const writingMode = style.writingMode;
        
        // If element has vertical writing mode with a transform
        if (writingMode && writingMode.includes('vertical') && transform && transform !== 'none') {
            elementsToFix.push({
                element: el,
                originalTransform: el.style.transform,
                originalTextOrientation: el.style.textOrientation,
                originalWritingMode: el.style.writingMode
            });
            
            // Remove the rotation and use upright text orientation
            el.style.transform = 'none';
            el.style.textOrientation = 'upright';
        }
    });
    
    return elementsToFix;
}

// Restore original styles after export
function restoreRotatedText(elementsToFix) {
    elementsToFix.forEach(({ element, originalTransform, originalTextOrientation, originalWritingMode }) => {
        element.style.transform = originalTransform;
        element.style.textOrientation = originalTextOrientation;
        element.style.writingMode = originalWritingMode;
    });
}

async function exportToPDF() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    const monthName = getMonthName(month);

    // Show export in progress
    const exportBtn = document.getElementById('export-btn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exporting...';
    exportBtn.disabled = true;

    const plannerContent = document.getElementById('planner-content');
    let pages = [];
    let previewIsParked = false;

    const restorePlannerPages = () => {
        if (!previewIsParked) return;

        const restoredPages = document.createDocumentFragment();
        pages.forEach(page => restoredPages.appendChild(page));
        plannerContent.replaceChildren(restoredPages);
        previewIsParked = false;
    };

    try {
        // html2canvas clones and lays out the entire live document for every
        // capture. Keeping a full month (roughly 100 pages) mounted here makes
        // export approach quadratic work, so park the preview and mount only
        // the page currently being rendered.
        pages = Array.from(plannerContent.querySelectorAll('.page'));
        const parkedPages = document.createDocumentFragment();
        pages.forEach(page => parkedPages.appendChild(page));
        previewIsParked = true;
        
        // Create jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        });

        // Process each page individually
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            plannerContent.replaceChildren(page);
            
            // Update progress
            exportBtn.textContent = `Exporting ${i + 1}/${pages.length}...`;

            // Fix rotated text before rendering
            const fixedElements = fixRotatedTextForExport(page);
            let canvas;

            try {
                // Render the page to canvas while it is the only planner page
                // mounted in the document.
                canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    width: page.offsetWidth,
                    height: page.offsetHeight
                });
            } finally {
                restoreRotatedText(fixedElements);
            }

            // Add new page if not the first
            if (i > 0) {
                pdf.addPage();
            }

            // Add the canvas as an image, filling the entire PDF page
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11);
        }

        restorePlannerPages();

        // Save the PDF
        pdf.save(`RPM_Monthly_${monthName}_${year}.pdf`);
    } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF export failed. Please try again.');
    } finally {
        // Restore the full preview in its original order on success or failure.
        restorePlannerPages();
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }
}
