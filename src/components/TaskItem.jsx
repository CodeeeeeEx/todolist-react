import React from 'react';

// 单个任务组件
function TaskItem({ task, toggleDone, deleteTask }) {
  return (
    <li className={task.done ? 'done' : ''}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleDone(task.id)}
        className="task-checkbox"
      ></input>
      <span className="task-text">{task.text}</span>
      <button onClick={() => deleteTask(task.id)}>删除</button>
    </li>
  );
}

export default TaskItem;