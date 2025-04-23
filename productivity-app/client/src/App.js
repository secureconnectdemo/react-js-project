import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('https://productivity-api.onrender.com');
    const data = await res.json();
    setTasks(data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
    setDueDate('');
  };

  const toggleComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT'
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>📋 Productivity Tracker</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task name"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleComplete(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {task.title} (Due: {task.dueDate})
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 10 }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
