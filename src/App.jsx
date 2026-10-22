import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header.jsx";
import TaskForm from "./components/TaskForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TaskList from "./components/TaskList.jsx";
import Calendar from "./components/Calendar.jsx";
import Modal from "./components/Modal.jsx";
import { todayKey } from "./utils/date.js";

const seed = [
  { id: 1, title: "Design review", description: "Go through the new dashboard mockups", priority: "High", dueDate: todayKey(), completed: false },
  { id: 2, title: "Write release notes", description: "Summarise this sprint's changes", priority: "Medium", dueDate: todayKey(), completed: false },
  { id: 3, title: "Water the plants", description: "", priority: "Low", dueDate: todayKey(), completed: true },
];

export default function App() {
  // Theme state (dark by default) applied to <html data-theme>
  const [theme, setTheme] = useState("dark");
  const [tasks, setTasks] = useState(seed);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due");
  const [selectedDate, setSelectedDate] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const addTask = (task) => {
    setTasks((prev) => [{ ...task, id: Date.now(), completed: false }, ...prev]);
    setFormOpen(false);
  };
  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const confirmDelete = () => {
    setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const visible = useMemo(() => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return tasks
      .filter((t) => (statusFilter === "all" ? true : statusFilter === "completed" ? t.completed : !t.completed))
      .filter((t) => priorityFilter === "all" || t.priority === priorityFilter)
      .filter((t) => !selectedDate || t.dueDate === selectedDate)
      .sort((a, b) => (sortBy === "due" ? a.dueDate.localeCompare(b.dueDate) : rank[a.priority] - rank[b.priority]));
  }, [tasks, statusFilter, priorityFilter, sortBy, selectedDate]);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        stats={stats}
        onAdd={() => setFormOpen(true)}
      />

      <main className="layout">
        <section className="main-col">
          <FilterBar
            status={statusFilter}
            onStatus={setStatusFilter}
            priority={priorityFilter}
            onPriority={setPriorityFilter}
            sortBy={sortBy}
            onSort={setSortBy}
            selectedDate={selectedDate}
            onClearDate={() => setSelectedDate(null)}
          />
          <TaskList tasks={visible} onToggle={toggleTask} onDelete={setDeleteTarget} />
        </section>

        <aside className="side-col">
          <Calendar tasks={tasks} selectedDate={selectedDate} onSelect={setSelectedDate} />
        </aside>
      </main>

      {formOpen && (
        <Modal title="New task" onClose={() => setFormOpen(false)}>
          <TaskForm onSubmit={addTask} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete task?" onClose={() => setDeleteTarget(null)}>
          <p className="muted">“{deleteTarget.title}” will be removed permanently.</p>
          <div className="actions">
            <button className="btn ghost" onClick={() => setDeleteTarget(null)}>Keep task</button>
            <button className="btn danger" onClick={confirmDelete}>Delete task</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
