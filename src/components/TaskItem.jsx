import React from 'react';

function TaskItem({ task, toggleDone, deleteTask }) {
  // { task, toggleDone, deleteTask }：解构赋值，从props中取出这三个值，相当于：const task = props.task; const toggleDone = props.toggleDone;
  return (
    <li className={`list-group-item d-flex align-items-center ${task.done ? 'bg-light' : ''}`}>
      {/* 复选框 */}
      <div className="form-check flex-grow-1">
        <input
          className="form-check-input me-3"
          // form-check-input：复选框样式
          // me-3：右边距3单位
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.done}
          onChange={() => toggleDone(task.id)}
          style={{ transform: 'scale(1.3)' }}
          // 行内样式使用，transform:'scale(1,3)'
        />
        <label
          className={`form-check-label ${task.done ? 'text-decoration-line-through text-muted' : ''}`}
          // form-check-label：标签样式
          htmlFor={`task-${task.id}`}
          style={{ fontSize: '1.1rem', cursor: 'pointer' }}
        >
          {task.text}
        </label>
      </div>
      
      {/* 操作按钮 */}
      <button
        className="btn btn-outline-danger btn-sm ms-2"
        // btn：按钮基础;btn-outline-danger：红色线框按钮;btn-sm：小尺寸;ms-2：左间距2单位
        onClick={() => deleteTask(task.id)}
        title="删除任务"
      >
        <i className="bi bi-trash"></i>
        {/* bi bi-trash：垃圾桶图标 */}
      </button>
    </li>
  );
}

export default TaskItem;