import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useWorklogStore } from "../../store/worklog/useWorklogStore.js";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import { toYMDDate } from "../../utils/dateFormatter";
import EventRenderer from "../../components/worklog/EventRenderer";

const WorklogCalendar = () => {
    const calendarRef = useRef(null);
    const navigate = useNavigate();
    const { fetchLogsByDate, worklogs } = useWorklogStore();
    const { user } = useAuthStore();
    const [events, setEvents] = useState([]);

    const allowedRoles = ["admin", "hrd", "superadmin", "leader"];
    const isAllowed = allowedRoles.includes(user?.role ?? "");

    useEffect(() => {
        const today = toYMDDate(new Date());
        fetchLogsByDate(today);
    }, [fetchLogsByDate]);

    useEffect(() => {
        const mappedEvents = worklogs.map((log) => ({
            id: String(log.work_log_id),
            title: log.title,
            start: toYMDDate(log.date),
            end: toYMDDate(log.date),
            extendedProps: {
                calendar:
                    log.status === "Completed"
                        ? "Success"
                        : log.status === "Pending"
                            ? "Warning"
                            : "Danger",
            },
        }));
        setEvents(mappedEvents);
    }, [worklogs]);

    const handleDateSelect = (selectInfo) => {
        const date = toYMDDate(selectInfo.startStr);
        navigate(`/workingHistory?date=${date}`);
    };

    const handleEventClick = (clickInfo) => {
        const date = toYMDDate(clickInfo.event.startStr);
        navigate(`/workingHistory?date=${date}`);
    };

    const handleEventAllWorklog = () => {
        navigate("/workingHistoryWithAdmin");
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="custom-calendar">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: isAllowed ? "prev,next addEventButton" : "prev,next",
                            center: "title",
                            right: "dayGridMonth",
                        }}
                        events={events}
                        selectable={true}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventContent={EventRenderer}
                        dayMaxEvents={2}
                        dayCellClassNames={(arg) => {
                            const hasEvent = events.some(
                                (event) => event.start === arg.date.toISOString().split("T")[0]
                            );
                            return hasEvent ? ["has-event"] : [];
                        }}
                        customButtons={{
                            addEventButton: {
                                text: "Lihat Selengkapnya",
                                click: handleEventAllWorklog,
                            },
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default WorklogCalendar;
