import React from "react";
import "./PremiumPages.css";

const Calendar = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00 AM",
      date: "Today",
      category: "meeting",
      color: "primary",
    },
    {
      id: 2,
      title: "Project Deadline",
      time: "5:00 PM",
      date: "Tomorrow",
      category: "deadline",
      color: "danger",
    },
    {
      id: 3,
      title: "Client Presentation",
      time: "2:00 PM",
      date: "Feb 12",
      category: "presentation",
      color: "warning",
    },
    {
      id: 4,
      title: "Code Review",
      time: "11:30 AM",
      date: "Feb 13",
      category: "review",
      color: "success",
    },
  ];

  return (
    <div className="dashboard-page premium-page">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <p className="page-subtitle">
          Manage your schedule and upcoming events
        </p>
      </div>

      <div className="calendar-layout">
        {/* Calendar Grid Placeholder */}
        <div className="calendar-main">
          <div className="calendar-header">
            <button className="calendar-nav-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h3 className="calendar-month">February 2026</h3>
            <button className="calendar-nav-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <div className="calendar-grid-placeholder">
            <div className="calendar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <p className="calendar-placeholder-text">
              Interactive calendar coming soon
            </p>
            <button className="add-event-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Event
            </button>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="events-sidebar">
          <h3 className="sidebar-title">Upcoming Events</h3>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`event-card event-card-${event.color}`}
              >
                <div className="event-indicator"></div>
                <div className="event-content">
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-meta">
                    <span className="event-time">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {event.time}
                    </span>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <span className={`event-category category-${event.category}`}>
                    {event.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
