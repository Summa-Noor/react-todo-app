import { useState } from "react";
import { toKey, todayKey } from "../utils/date.js";

const WEEK = ["S", "M", "T", "W", "T", "F", "S"];

export default function Calendar({ tasks, selectedDate, onSelect }) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  // Map due date -> pending/total counts
  const byDate = tasks.reduce((acc, t) => {
    const e = acc[t.dueDate] || { total: 0, pending: 0 };
    e.total++;
    if (!t.completed) e.pending++;
    acc[t.dueDate] = e;
    return acc;
  }, {});

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const today = todayKey();

  const shift = (n) => setCursor(new Date(year, month + n, 1));

  return (
    <div className="calendar">
      <div className="cal-head">
        <button className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <strong>{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
        <button className="icon-btn" onClick={() => shift(1)} aria-label="Next month">›</button>
      </div>

      <div className="cal-grid">
        {WEEK.map((d, i) => <span key={i} className="cal-dow">{d}</span>)}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const key = toKey(new Date(year, month, day));
          const info = byDate[key];
          const cls = [
            "cal-day",
            key === today && "today",
            key === selectedDate && "selected",
            info?.pending > 0 && "has-due",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={key}
              className={cls}
              onClick={() => onSelect(key === selectedDate ? null : key)}
              title={info ? `${info.pending} pending / ${info.total} total` : undefined}
            >
              {day}
              {info && <i className={info.pending ? "dot" : "dot muted-dot"} />}
            </button>
          );
        })}
      </div>
      <p className="muted small">Dots mark due dates. Tap a day to filter the list.</p>
    </div>
  );
}
