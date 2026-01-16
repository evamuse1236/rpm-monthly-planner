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

    // Event listeners
    document.getElementById('generate-btn').addEventListener('click', generatePlanner);
    document.getElementById('export-btn').addEventListener('click', exportToPDF);

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

// =====================
// HELPER FUNCTIONS
// =====================

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

function generateTitlePage() {
    return `
        <div class="page title-page">
            <div class="illustration"></div>
            <h1>MY RPM MONTHLY</h1>
            <h2>JOURNAL</h2>
        </div>
    `;
}

function generateMonthlyCalendar(year, month) {
    const monthName = getMonthName(month);
    const weeks = getWeeksInMonth(year, month);
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    let calendarRows = '';

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
                    <span class="date-number ${dateClass} ${otherMonthClass}">${dayInfo.day}</span>
                </div>
            `;
        });

        const headerClass = dayIndex === 0 ? 'day-header sunday' : 'day-header';

        calendarRows += `
            <div class="calendar-row">
                <div class="${headerClass}">${dayName}</div>
                <div class="calendar-cells">${cells}</div>
            </div>
        `;
    });

    return `
        <div class="page monthly-calendar">
            <div class="month-label">${monthName}</div>
            <div class="calendar-grid">
                ${calendarRows}
            </div>
            <div class="sidebar">
                <span class="star">✦</span>
                <span class="quote">One step at a time. You'll get there.</span>
                <span class="footer-label">Monthly Planner</span>
            </div>
        </div>
    `;
}

function generateWeeklyPlanner(weekNumber) {
    // Generate weekly planner for week number in the month
    return `
        <div class="page weekly-planner">
            <div class="left-side">
                <span class="floral">🌸</span>
                <span class="vertical-label">W E E K L Y   P L A N N E R</span>
            </div>
            <div class="main-content">
                <div class="weekday-box">
                    <div class="weekday-label"><span>MONDAY</span></div>
                    <div class="weekday-content"></div>
                </div>
                <div class="weekday-box">
                    <div class="weekday-label"><span>TUESDAY</span></div>
                    <div class="weekday-content"></div>
                </div>
                <div class="weekday-box">
                    <div class="weekday-label"><span>WEDNESDAY</span></div>
                    <div class="weekday-content"></div>
                </div>
                <div class="weekday-box">
                    <div class="weekday-label"><span>THURSDAY</span></div>
                    <div class="weekday-content"></div>
                </div>
                <div class="weekday-box">
                    <div class="weekday-label"><span>FRIDAY</span></div>
                    <div class="weekday-content"></div>
                </div>
            </div>
            <div class="weekend-strip">
                <div class="weekend-day saturday"><span>SATURDAY</span></div>
                <div class="weekend-day sunday"><span>SUNDAY</span></div>
            </div>
        </div>
    `;
}

function generateDailyPage(day, month, year) {
    const dateStr = formatDate(day, month, year);
    const dayOfWeek = new Date(year, month, day).getDay();
    const dayName = getDayName(dayOfWeek);

    // Generate time slots from 6:00 AM to 10:00 PM (hourly for more writing space)
    let timeSlots = '';
    const times = [
        '6:00 AM', '7:00', '8:00', '9:00', '10:00', '11:00',
        'NOON',
        '1:00 PM', '2:00', '3:00', '4:00', '5:00', '6:00',
        '7:00', '8:00', '9:00', '10:00'
    ];

    const highlightTimes = ['NOON', '6:00'];

    times.forEach(time => {
        const isHighlight = highlightTimes.includes(time);
        timeSlots += `
            <div class="time-slot ${isHighlight ? 'highlight' : ''}">
                <span class="time-label">${time}</span>
            </div>
        `;
    });

    return `
        <div class="page daily-page">
            <div class="header">
                <div class="date-section">
                    <span class="date-label">DATE</span>
                    <span class="date-value">${dateStr}</span>
                </div>
                <div class="five-steps">
                    THE FIVE MASTER STEPS: 1. Capture Outcomes, Results, Actions, Projects, etc. 2. Create Your RPM Master Plan 3. Commit to Block Time 4. Schedule It 5. Complete, Measure and Celebrate
                </div>
                <div class="day-box">${dayName}</div>
            </div>
            <div class="main-content">
                <div class="schedule-section">
                    <div class="section-header">
                        <span class="section-icon">📋</span>
                        <span class="section-title">COMMIT & SCHEDULE</span>
                    </div>
                    <div class="section-subtitle">Commit to block time and schedule your musts</div>
                    <div class="schedule-box">
                        ${timeSlots}
                    </div>
                </div>
                <div class="capture-section">
                    <div class="section-header">
                        <span class="section-icon">💡</span>
                        <span class="section-title">CAPTURE</span>
                    </div>
                    <div class="section-subtitle">Ideas, Wants, Needs</div>
                    <div class="capture-box"></div>

                    <div class="comms-section">
                        <div class="comms-title">📞 Communications & Follow-ups</div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                        <div class="comms-line"></div>
                    </div>

                    <div class="wellness-section">
                        <div class="wellness-item">DID I HYDRATE? 🥤</div>
                        <div class="wellness-item">DID I MOVE? 🏃</div>
                        <div class="wellness-item">WHAT AM I GRATEFUL FOR? ☀️</div>
                    </div>
                </div>
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

    // Generate table rows (about 25 rows to fill the page)
    let tableRows = '';
    for (let i = 0; i < 25; i++) {
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
            </div>
        `;
    }

    return `
        <div class="page rpm-page">
            <div class="header">
                <div class="day-circles">${dayCircles}</div>
                <div class="date-section">
                    <span>DATE</span> ${dateStr}
                </div>
                <div class="incantation">
                    <span class="incantation-icon">📢</span>
                    <span class="incantation-label">INCANTATION</span>
                    <span class="incantation-line"></span>
                </div>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <div class="col-ldp">
                        <div>
                            <div>L</div>
                            <div class="sub-label">LEVERAGE</div>
                        </div>
                        <div>
                            <div>D</div>
                            <div class="sub-label">DURATION</div>
                        </div>
                        <div>
                            <div>P</div>
                            <div class="sub-label">PRIORITY</div>
                        </div>
                    </div>
                    <div class="col-action">
                        <div class="main-label">MASSIVE ACTION PLAN</div>
                        <div class="sub-label">How can I best achieve it now?</div>
                    </div>
                    <div class="col-result">
                        <div class="main-label">RESULT</div>
                        <div class="sub-label">What do I want?</div>
                    </div>
                    <div class="col-purpose">
                        <div class="main-label">PURPOSE</div>
                        <div class="sub-label">Why do I want it?</div>
                    </div>
                </div>
                <div class="table-body">
                    ${tableRows}
                </div>
            </div>
        </div>
    `;
}

function generateCelebrationPage(day, month, year) {
    const dateStr = formatDate(day, month, year);

    return `
        <div class="page celebration-page">
            <div class="header">
                <h2>STEP 5 - COMPLETE, MEASURE & CELEBRATE</h2>
                <p>
                    Remember: Progress = Happiness. Celebrate your wins, no matter how small.
                    What did you accomplish today? Review your day. What did I learn today? What did I contribute to someone's life
                    today? How can I improve and do even better tomorrow? Take time to reflect and celebrate your progress.
                </p>
            </div>
            <div class="content-area">
                <div class="date-field">DATE: ${dateStr}</div>
                <div class="watercolor-bg"></div>
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
        html += generateTitlePage();

        // 2. Monthly Calendar
        html += generateMonthlyCalendar(year, month);

        // 3. Weekly Planners (one for each week)
        const weeks = getWeeksInMonth(year, month);
        weeks.forEach((week, i) => {
            html += generateWeeklyPlanner(i + 1, week);
        });

        // 4. Daily Pages, RPM Pages, and Celebration Pages
        const daysInMonth = getDaysInMonth(year, month);

        for (let day = 1; day <= daysInMonth; day++) {
            // Daily Page
            html += generateDailyPage(day, month, year);

            // RPM Page
            html += generateRPMPage(day, month, year);

            // Celebration Page
            html += generateCelebrationPage(day, month, year);
        }

        container.innerHTML = html;

        // Scroll to top of preview
        document.getElementById('preview-container').scrollIntoView({ behavior: 'smooth' });

    }, 100);
}

// =====================
// PDF EXPORT
// =====================

function exportToPDF() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    const monthName = getMonthName(month);

    const element = document.getElementById('planner-content');

    // Show export in progress
    const exportBtn = document.getElementById('export-btn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exporting...';
    exportBtn.disabled = true;

    const opt = {
        margin: 0,
        filename: `RPM_Monthly_${monthName}_${year}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }).catch(err => {
        console.error('PDF export failed:', err);
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
        alert('PDF export failed. Please try again.');
    });
}
