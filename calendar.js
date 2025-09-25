document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendarGrid");
    const monthYearEl = document.getElementById("monthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    if (!calendarGrid) return;

    let currentDate = new Date();
    const events = {}; // store events: key = YYYY-MM-DD, value = event type

    // Define colors for each event type
    const eventColors = {
        "Vacation": "#FFCDD2",       // light red
        "Doctor": "#C5CAE9",         // light blue
        "Office": "#C8E6C9",         // light green
        "Home Office": "#FFF9C4",    // light yellow
        "Weekend": "#FFE0B2",        // light orange
        "Public Holiday": "#B39DDB", // light purple
        "Fruit Day": "#F8BBD0",      // pink
        "Have Lunch": "#80DEEA"      // cyan
    };

    // Modal elements
    const modal = document.getElementById("eventModal");
    const closeModal = document.getElementById("closeModal");
    const eventTypeSelect = document.getElementById("eventType");
    const saveEventBtn = document.getElementById("saveEvent");
    let selectedCell = null;
    let selectedDateStr = "";

    function renderCalendar(date) {
        calendarGrid.innerHTML = "";

        const year = date.getFullYear();
        const month = date.getMonth();

        // Update header
        monthYearEl.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

        // Weekday headers
        const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        weekdays.forEach(day => {
            const div = document.createElement("div");
            div.textContent = day;
            div.classList.add("day-name");
            calendarGrid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1);
        let startDay = firstDay.getDay();
        startDay = (startDay === 0) ? 6 : startDay - 1; // Monday-first

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        for (let i = 0; i < 35; i++) { // 7x5 grid
            const div = document.createElement("div");
            div.classList.add("day-cell");

            let displayNumber, displayMonth, cellYear, cellMonth;

            const dayNumber = i - startDay + 1;

            if (dayNumber < 1) {
                // Previous month
                displayNumber = daysInPrevMonth + dayNumber;
                const prevMonthDate = new Date(year, month - 1, 1);
                displayMonth = prevMonthDate.toLocaleString("default", { month: "short" });
                cellMonth = prevMonthDate.getMonth();
                cellYear = prevMonthDate.getFullYear();
                div.classList.add("other-month");
            } else if (dayNumber > daysInMonth) {
                // Next month
                displayNumber = dayNumber - daysInMonth;
                const nextMonthDate = new Date(year, month + 1, 1);
                displayMonth = nextMonthDate.toLocaleString("default", { month: "short" });
                cellMonth = nextMonthDate.getMonth();
                cellYear = nextMonthDate.getFullYear();
                div.classList.add("other-month");
            } else {
                // Current month
                displayNumber = dayNumber;
                displayMonth = date.toLocaleString("default", { month: "short" });
                cellMonth = month;
                cellYear = year;
            }

            // Display month for 1st day
            if (displayNumber === 1) {
                div.textContent = `${displayMonth} ${displayNumber}`;
            } else {
                div.textContent = displayNumber;
            }

            // Highlight today
            const today = new Date();
            if (
                dayNumber > 0 && dayNumber <= daysInMonth &&
                displayNumber === today.getDate() &&
                cellMonth === today.getMonth() &&
                cellYear === today.getFullYear()
            ) {
                div.innerHTML = `<span class="today-circle">${displayNumber}</span>`;
            }

            // Add click event to show modal
            div.addEventListener("click", () => {
                selectedCell = div;
                selectedDateStr = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(displayNumber).padStart(2, '0')}`;
                modal.style.display = "block";

                // Pre-select existing event
                if (events[selectedDateStr]) {
                    eventTypeSelect.value = events[selectedDateStr];
                } else {
                    eventTypeSelect.value = "Vacation";
                }
            });

            // Highlight cells with events
            const cellKey = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(displayNumber).padStart(2, '0')}`;
            if (events[cellKey]) {
                div.style.backgroundColor = eventColors[events[cellKey]] || "#e1f5fe";
            }

            calendarGrid.appendChild(div);
        }
    }

    renderCalendar(currentDate);

    // Render legend
    function renderLegend() {
        const legendContainer = document.getElementById("eventLegend");
        legendContainer.innerHTML = ""; // clear existing
        for (const [event, color] of Object.entries(eventColors)) {
            const item = document.createElement("div");
            item.classList.add("legend-item");

            const colorBox = document.createElement("span");
            colorBox.classList.add("legend-color");
            colorBox.style.backgroundColor = color;

            const label = document.createElement("span");
            label.textContent = event;

            item.appendChild(colorBox);
            item.appendChild(label);
            legendContainer.appendChild(item);
        }
    }

    // Initial legend render
    renderLegend();


    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Save event
    saveEventBtn.addEventListener("click", () => {
        const type = eventTypeSelect.value;
        if (selectedCell && selectedDateStr) {
            events[selectedDateStr] = type;
            selectedCell.style.backgroundColor = eventColors[type] || "#e1f5fe";
        }
        modal.style.display = "none";
    });

});
