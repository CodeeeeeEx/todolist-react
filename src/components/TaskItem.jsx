import React from 'react';

function TaskItem({ task, toggleDone, deleteTask }) {
  return (
    <li className={`list-group-item d-flex align-items-center ${task.done ? 'bg-light' : ''}`}>
      {/* 复选框 */}
      <div className="form-check flex-grow-1">
        <input
          className="form-check-input me-3"
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.done}
          onChange={() => toggleDone(task.id)}
          style={{ transform: 'scale(1.3)' }}
        />
        <label
          className={`form-check-label ${task.done ? 'text-decoration-line-through text-muted' : ''}`}
          htmlFor={`task-${task.id}`}
          style={{ fontSize: '1.1rem', cursor: 'pointer' }}
        >
          {task.text}
        </label>
      </div>
      
      {/* 操作按钮 */}
      <button
        className="btn btn-outline-danger btn-sm ms-2"
        onClick={() => deleteTask(task.id)}
        title="删除任务"
      >
        <i className="bi bi-trash"></i>
      </button>
    </li>
  );
}

export default TaskItem;