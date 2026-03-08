// 导入Bootstrap CSS样式
import 'bootstrap/dist/css/bootstrap.min.css';

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
  // 设置主题切换的钩子,light
  const [theme, setTheme] = useState('light');

  // 主题切换
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme',newTheme);
    // document.documentElement获取HTML根元素，用setAttribute('data-bs-theme', 'dark')设置Bootstrap主题属性，Bootstrap 5会自动根据这个属性切换主题
    localStorage.setItem('todo-theme', newTheme);
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('todo-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  },[]);

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
    <div className="container py-5">
      {/* container: 居中容器，有最大宽度限制
          py-5: padding-y轴 5单位 (3rem)，p=padding，y=上下方向，5=3rem（1=0.25rem，5=3rem） 
          效果：内容居中，上下有大内边距 */}

      {/* 主题切换按钮 */}
      <div className="d-flex justify-content-end mb-4">
      {/* mb-4: margin-bottom 4单位 */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline-secondary btn-sm"
          title={`切换到${theme === 'light' ? '暗色' : '亮色'}主题`}
        >
          {theme === 'light' ? '🌙 暗色模式' : '☀️ 亮色模式'}
        </button>
      </div>

      {/* 主卡片 */}
      <div className="card shadow-lg border-0">
        {/* card卡片组件白色背景圆角边框,shadow-lg大阴影立体感 */}
        <div className="card-body p-4">
          {/* card-body卡片内容区,p-4 padding 4单位内边距1.5rem */}
          {/* 标题 */}
          <h1 className="card-title text-center mb-4 text-primary">
            <i className="bi bi-check2-circle me-2"></i>
            {/* bi:Bootstrap Icons前缀
                bi-check2-circle:具体图标名称
                图标库：https://icons.getbootstrap.com/
                查找方法：
                  1.去图标库网站
                  2.搜索想要的功能（如“check”、“delete”、“home”）
                  3.复制类名
                  4.粘贴使用
            */}
            待办清单
          </h1>

          {/* 输入区域 */}
          <div className="row g-3 mb-4">
            {/*  
              g-3​,gap间距3单位,列与列之间的间距;mb-4,​margin-bottom 4单位,下边距。
            */}
            <div className="col-md-8">
              {/* 在中等屏幕占8列，响应式：≥768px时占8/12宽度*/}
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  // form-control 表单控件样式，标准输入框样式
                  // form-control-lg 大尺寸,更大的输入框
                  placeholder="输入新任务..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  className="btn btn-primary btn-lg"
                  // btn按钮基础;btn-primary主色按钮蓝色背景;btn-lg大按钮匹配大输入框
                  type="button"
                  onClick={addTask}
                  disabled={!inputValue.trim()}
                >
                  <i className="bi bi-plus-lg me-1"></i>添加
                </button>
              </div>
            </div>
            
            <div className="col-md-4">
              {/* 在中等屏幕占4列,≥768px时占4/12宽度 */}
              <div className="d-grid gap-2 d-md-flex">
                {/* d-grid = display:grid 网格布局
                    d-md-flex = ≥768px时flex布局,平板以上横向排列
                */}
                <button
                  className="btn btn-warning flex-fill"
                  // flex-fill 填充剩余空间，两个按钮等宽；warning警告色（黄）
                  onClick={toggleAllTasks}
                  disabled={tasks.length === 0}
                >
                  <i className="bi bi-check2-all me-1"></i>
                  {tasks.every(t => t.done) ? '全部取消' : '全部完成'}
                </button>
                <button
                  className="btn btn-danger flex-fill"
                  // danger危险色（红）
                  onClick={clearAllTasks}
                  disabled={tasks.length === 0}
                >
                  <i className="bi bi-trash me-1"></i>清空
                </button>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          {tasks.length > 0 && (
            <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
              <div>
                <i className="bi bi-list-task me-2"></i>
                <span className="fw-bold">总计: {tasks.length} 个任务</span>
              </div>
              <div className="d-flex gap-4">
                <span className="text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  完成: {tasks.filter(t => t.done).length} 个
                </span>
                <span className="text-warning">
                  <i className="bi bi-clock me-1"></i>
                  未完成: {tasks.filter(t => !t.done).length} 个
                </span>
              </div>
            </div>
          )}

          {/* 任务列表 */}
          {tasks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clipboard-check display-1 text-muted"></i>
              <h4 className="mt-3 text-muted">还没有任何任务</h4>
              <p className="text-muted">在输入框中添加你的第一个任务吧！</p>
            </div>
          ) : (
            <ul className="list-group">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleDone={toggleDone}
                  deleteTask={deleteTask}
                />
              ))}
            </ul>
          )}

          {/* 页脚信息 */}
          <div className="mt-4 text-center text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            任务数据会自动保存到本地存储
          </div>
        </div>
      </div>
    </div>
  );
}

// 不要忘记导出！
export default App;
