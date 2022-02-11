// 1 导入 createBrowserHistory 函数
import { createBrowserHistory } from 'history';

// 2 创建 history 对象
const history = createBrowserHistory({
  basename: '/geek',
});

// 3 导出创建好的 history
export { history };
