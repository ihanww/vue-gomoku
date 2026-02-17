# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目指导。

## 项目概述

**Vue Gomoku** 是一个基于 Vue 3 的五子棋人机对战网页应用，使用 TypeScript、Vite 和 Pinia 构建。

### 技术栈

- **前端框架**: Vue 3.5 (Composition API + `<script setup>`)
- **开发语言**: TypeScript
- **构建工具**: Vite 7
- **状态管理**: Pinia
- **路由**: Vue Router 5
- **样式**: CSS Scoped
- **测试**: Vitest (单元测试) + Playwright (E2E测试)

## 游戏功能设计

### 核心功能

1. **棋盘系统**
   - 标准 15×15 五子棋棋盘
   - 点击落子交互
   - 棋子显示（黑子/白子）
   - 最后落子位置高亮显示

2. **游戏模式**
   - 人机对战（玩家 vs AI）
   - 可选择玩家执黑先手或白子后手

3. **AI 算法**
   - 基于 Minimax 算法 + Alpha-Beta 剪枝
   - 评估函数考虑：活三、冲四、活四、五连等棋型
   - 可配置 AI 难度等级（简单/中等/困难）

4. **游戏状态**
   - 游戏进行中
   - 胜利判定（五连珠）
   - 重新开始
   - 悔棋功能
   - 游戏历史记录

## 开发命令

```bash
# 启动开发服务器（热重载）
pnpm dev

# 类型检查 + 生产构建
pnpm build

# 仅类型检查
pnpm type-check

# 运行单元测试 (Vitest)
pnpm test:unit

# 运行 E2E 测试 (Playwright) - 需先构建
pnpm build && pnpm test:e2e

# 代码检查 (oxlint + eslint)
pnpm lint

# 代码格式化
pnpm format
```

**Node 版本要求:** `^20.19.0 || >=22.12.0`

## 项目架构

### 目录结构规划

```
src/
├── components/           # 可复用组件
│   ├── Board.vue        # 棋盘组件
│   ├── Cell.vue         # 棋盘格子组件
│   ├── GameControls.vue # 游戏控制面板
│   └── GameHistory.vue  # 历史记录组件
├── stores/              # Pinia 状态管理
│   ├── game.ts         # 游戏状态 store
│   └── ai.ts           # AI 逻辑 store
├── utils/               # 工具函数
│   ├── game.ts         # 游戏规则（胜负判定等）
│   ├── ai.ts           # AI 算法实现
│   └── score.ts        # 棋型评估分数
├── types/               # TypeScript 类型定义
│   └── game.ts         # 游戏相关类型
├── views/               # 页面视图
│   └── Game.vue        # 游戏主页面
├── router/              # 路由配置
│   └── index.ts
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

### 状态管理设计 (Pinia)

**game.ts Store 结构:**

```typescript
interface GameState {
  board: BoardType          // 15x15 棋盘数组
  currentPlayer: Player     // 当前玩家 ('black' | 'white')
  isGameOver: boolean       // 游戏是否结束
  winner: Player | null     // 获胜者
  moveHistory: Move[]       // 历史落子记录
  gameMode: GameMode        // 游戏模式
  aiPlayer: Player          // AI 执哪方
  isAiThinking: boolean     // AI 是否正在思考
}

const actions = {
  makeMove(row, col)        // 落子
  restartGame()             // 重新开始
  undoMove()                // 悔棋
  checkWin(row, col)        // 检查胜利
}
```

### AI 算法设计

**Minimax + Alpha-Beta 剪枝:**

- 搜索深度：简单(2)、中等(4)、困难(6)
- 评估函数：基于棋型评分
  - 五连：100000 分
  - 活四：10000 分
  - 冲四：1000 分
  - 活三：1000 分
  - 眠三：100 分
  - 活二：10 分

### 组件设计原则

- 使用 Composition API + `<script setup lang="ts">`
- 单文件组件 (.vue) 包含 template、script、style
- 使用 `@/` 路径别名引用 src 目录
- Props/Emits 使用 TypeScript 类型定义
- 响应式数据优先使用 `ref`，对象使用 `reactive`

## 开发规范

### 代码风格

- 使用 **Prettier** 格式化（无分号、单引号、100 字符宽度）
- **Oxlint** 快速正确性检查
- **ESLint** Vue/TypeScript 规则

### TypeScript 规范

- 优先使用 interface 定义对象类型
- 使用 type 定义联合类型/字面量类型
- 避免使用 any，使用 unknown 代替

### Vue 组件规范

- 组件名使用 PascalCase
- Props 定义使用 `defineProps<T>()`
- Emits 定义使用 `defineEmits<T>()`
- 计算属性使用 `computed()`
- 方法使用普通函数

### 测试规范

- 单元测试与源码放在同一目录下 `__tests__/*.spec.ts`
- E2E 测试放在 `e2e/` 目录
- 测试文件名使用 `.spec.ts` 或 `.test.ts`

## 游戏规则

### 基本规则

- 棋盘大小：15×15
- 黑方先行
- 任意方向（横、竖、斜）连成五子即获胜
- 无禁手规则（简化版）

### AI 优先级

1. 如果有必胜位置（五连），直接落子
2. 如果对方有必胜位置，必须防守
3. 优先形成自己的进攻棋型
4. 其次阻止对方的进攻棋型

## 开发任务清单

- [ ] 创建游戏基础类型定义
- [ ] 实现 game store（游戏状态管理）
- [ ] 实现棋盘组件
- [ ] 实现游戏规则（胜负判定）
- [ ] 实现 AI 算法（Minimax + 评估函数）
- [ ] 实现游戏控制面板
- [ ] 实现悔棋功能
- [ ] 实现游戏历史记录
- [ ] 添加样式和动画效果
- [ ] 编写单元测试
- [ ] 编写 E2E 测试

## OpenSpec 工作流

本项目包含实验性的 **OpenSpec** 工作流，相关技能和命令位于 `.claude/`：

- `.claude/skills/` - 10 个 OpenSpec 技能
- `.claude/commands/opsx/` - 对应的斜杠命令
- `openspec/` - 工作流目录

进行功能开发时，可使用 `/opsx:new` 或 `/opsx:ff` 快速模式进行结构化开发。

## 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
