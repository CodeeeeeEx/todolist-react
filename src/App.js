// 导入React、useState以及useEffect（useState是状态管理的"钩子"，用来在函数组件里记住和更新数据; useEffect是本地数据存储所用的函数）
import { useState, useEffect } from 'react'; // 确保导入了useEffect
import './App.css';
// 导入组件TaskItem.jsx
import TaskItem from './components/TaskItem';

function App() {
  // tasks: 任务列表（初始是空数组 []）
  // setTasks: 更新 tasks 的函数
  // ✨const [tasks, setTasks] = useState([]);
  // 💡 解释：useState([])相当于说“我要一个叫 tasks 的变量，初始值是空数组，如果我想改 tasks，就调用 setTasks”。inputValue同理。

  // 1.用 useState 创建两个状态，并从本地存储读取：
  const [tasks, setTasks] = useState(() => {
    // 尝试从 LocalStorage 读取
    const savedTasks = localStorage.getItem('todo-tasks');
    // 如果有保存的数据，解析成数组
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('读取本地存储失败:', error);
        return [];
      }
    }

    // 如果没有，返回空数组
    return [];
  });

  // inputValue: 输入框的内容（初始是空字符串 ''）
  // setInputValue: 更新 inputValue 的函数
  const [inputValue, setInputValue] = useState('');


  // 监听 tasks 变化，自动保存
  useEffect(() => {
    try {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
      // 在此添加用户提示
      alert('保存失败，请清理浏览器缓存后重试');
    }
  }, [tasks]);


  // 2.添加任务的函数
  const addTask = () => {
    // 如果输入框是空的，直接返回，不添加
    if (inputValue.trim() === '') return;
    // 💡 解释：inputValue.trim()：去掉输入内容两边的空格

    if (inputValue.trim().length > 20) {
      alert('任务内容不能超过20字');
      return;
    }

    // 创建一个新任务对象
    const newTask = {
      id: Date.now(), // 用当前时间戳当唯一ID
      // 💡 解释：Date.now()：获取当前时间戳（1970年1月1日到现在的毫秒数），保证每个任务ID不同

      text: inputValue, // 任务内容
      done: false // 是否完成
    };
    // 更新 tasks：在旧数组末尾加上新任务
    setTasks([...tasks, newTask]);
    // 💡 解释：[...tasks, newTask]：展开运算符，把旧数组的所有元素和新元素合并成新数组

    // 清空输入框
    setInputValue('');
  };

  // 3.删除任务的函数
  const deleteTask = (id) => {
    // task.id !== id= 只留下 id 不等于​ 要删除 id 的任务
    const newTasks = tasks.filter(task => task.id !== id);
    // 剩下的任务就是新数组
    setTasks(newTasks);
    // 💡 解释：filter是数组方法，返回一个新数组，只包含满足条件的元素。
  };

  // 4.标记任务完成/未完成
  const toggleDone = (id) => {
    const newTasks = tasks.map(task => {
      // 如果找到对应 id 的任务，切换它的 done 状态
      // 💡 解释：map：数组方法，遍历每个元素，返回新数组
      if (task.id === id) {
        return {...task, done: !task.done };
      // 💡 解释：{ ...task, done: !task.done }：展开 task 的所有属性，但把 done 改为相反值
      }
      return task; // 其他任务不变
    });
    setTasks(newTasks);
  };

  // 5.一键清空所有任务
  const clearAllTasks = () => {
    if (window.confirm('确定要清空所有任务吗？')) {
      setTasks([]);
    }
  };

  // 6.全选/全不选功能
  const toggleAllTasks = () => {
    const allDone = tasks.every(t => t.done);
    const newTasks = tasks.map(task => ({
      ...task,
      done: !allDone
    }));
    setTasks(newTasks);
  }

// 这里是函数内的JSX内容语法，对应HTML
  return (
    <div className="App">
      <h1>待办清单</h1>
      {/* 输入区域 */}
      <div className="input-area">
        <input
          type="text"
          value={inputValue} // 绑定到状态，与useState钩子有联系
          onChange={(e) => setInputValue(e.target.value)} // 输入时触发，更新状态
          // 按下回车键也能直接添加不用总是点击添加按钮
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTask();
            }
          }}
          placeholder="输入新任务..." // placeholder是提示文字区域
        ></input>
        {/* 任务统计 */}
        <div className="stats">
          <span>总计：{tasks.length} 个任务</span>
          <span> | </span>
          <span>完成：{tasks.filter(t => t.done).length} 个</span>
          <span> | </span>
          <span>未完成：{tasks.filter(t => !t.done).length} 个</span>
        </div>

        <button onClick={addTask}>添加</button>
        <button
          onClick={clearAllTasks}
          className="clear-btn"
          disabled={tasks.length === 0}
        >
          清空全部
        </button>
        {/* 全选/全不选功能 */}
        <button
          onClick={toggleAllTasks}
          className="toggle-all-btn"
          disabled={tasks.length === 0}
        >
          {tasks.every(t => t.done)? '全部取消' : '全部完成'}
        </button>
      </div>

      {/* 任务列表 */}
      <ul className="task-list">
        {tasks.map(task => (
          // <li
          //   key={task.id} // 每个 li 必须有唯一 key
          //   // 💡 解释：key={task.id}：React 要求列表每个元素有唯一 key，用于性能优化

          //   className={task.done ? 'done' : ''} // 如果完成，加 'done' 类，否则空
          // >
          //   {/* 复选框，勾选加划线表示已完成，取消则恢复原样 */}
          //   <input
          //     type="checkbox"
          //     checked={task.done}
          //     onChange={() => toggleDone(task.id)}
          //     className="task-checkbox"
          //     />

          //   {/* 获取到函数里写的任务内容 */}
          //   <span className="task-text">{task.text}</span>

          //   {/* 删除按钮 onClick={() => deleteTask(task.id)}：点击时调用函数，传入当前任务的 id */}
          //   <button onClick={() => deleteTask(task.id)}>
          //     删除
          //   </button>
          // </li>  

          <TaskItem
            key={task.id}
            task={task}
            toggleDone={toggleDone}
            deleteTask={deleteTask}
          ></TaskItem>
          // ✅ 价值：练习组件化思维，代码更易读、易维护，替换上方直接编写的语法，而是创建一个组件然后调用它
        ))}
      </ul>
    </div>
  );
}

// 不要忘记导出！
export default App;
