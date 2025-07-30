import React from "react";

const EventRenderer = ({ event, timeText }) => {
    const calendarType = (event.extendedProps.calendar || "pending").toLowerCase();
    const colorClass = `fc-bg-${calendarType}`;

    return (
        <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
            <div className="fc-daygrid-event-dot" />
            <div className="fc-event-time">{timeText}</div>
            <div className="fc-event-title">{event.title}</div>
        </div>
    );
};

export default EventRenderer;
