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
   - 游戏计时
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

---

## 开发历史与更新记录

### 2025-02 - UI 优化与 AI 重构

#### 界面改进

1. **棋盘尺寸放大** - 将棋盘格子从 32px 放大到 48px (1.5倍)，棋子从 26px 放大到 40px
2. **视觉简化** - 减少网格线粗细，降低透明度至 0.4，移除边框改用 box-shadow
3. **层级修复** - 修复网格线显示在棋子上方的问题，设置 z-index 确保网格线在下层

#### AI 算法演进 (重要)

**问题背景**: 初始的 Minimax + Alpha-Beta 剪枝实现存在多个严重 bug，导致 AI"乱下棋"：

1. **Bug 1**: `evaluateLine` 函数从 `count = 1` 开始，假设空位已有棋子
2. **Bug 2**: 候选位置选择使用固定的 'black' 而非 `aiPlayer`
3. **Bug 3**: 开局搜索范围过大 (2格)，导致在远处落子
4. **Bug 4**: 复杂递归逻辑难以调试

**最终方案**: 完全重写为 **贪心算法 + 模式检测**

```typescript
// 新 AI 核心逻辑 (src/utils/ai.ts)
export function getBestMove(board, difficulty, aiPlayer) {
  // 1. 检查是否有直接获胜位置
  const winMove = findCriticalMove(board, aiPlayer, true)
  if (winMove) return winMove.move

  // 2. 检查是否需要紧急防守
  const blockMove = findCriticalMove(board, opponent, false)
  if (blockMove?.score >= SCORE.LIVE_FOUR) {
    return blockMove.move
  }

  // 3. 开局策略：前几手下在天元附近
  if (stoneCount <= 4) {
    const openingMove = getOpeningMove(board, aiPlayer)
    if (openingMove) return openingMove
  }

  // 4. 贪心选择：评估所有候选位置
  const candidates = getCandidatesAndScore(board, aiPlayer, searchDepth)
  return candidates[0]?.move || null
}
```

**棋型评分系统**:

```typescript
const SCORE = {
  FIVE: 1000000, // 五连 - 必胜
  LIVE_FOUR: 500000, // 活四 - 两端开放的四连
  RUSH_FOUR: 10000, // 冲四 - 一端开放的四连
  LIVE_THREE: 5000, // 活三
  SLEEP_THREE: 500, // 眠三
  LIVE_TWO: 100, // 活二
  ONE: 10 // 单子
}
```

**模式检测函数** - `analyzePatterns(board, row, col, player)`:

- 检测四个方向（横、竖、左斜、右斜）的棋型
- 计算连续棋子数和开放端数
- 返回各类棋型的布尔值

**位置评估函数** - `evaluatePosition(board, row, col, player)`:

- 模拟落子后的棋型（进攻价值）
- 评估对手在此落子会怎样（防守价值）
- 防守权重 1.2 倍

**技术要点**:

- 使用 `makeMove` 创建临时棋盘进行模拟
- 只考虑有邻近棋子的空位（动态搜索范围）
- 简单模式增加随机性（从前3名中随机选择）

#### 已知文件结构

- `src/components/Cell.vue` - 单个棋盘格子，支持最后落子标记、悔棋动画、胜利连线
- `src/components/Board.vue` - 主棋盘组件，15×15 网格
- `src/components/GameReplay.vue` - 游戏复盘组件，支持步进和自动播放
- `src/utils/ai.ts` - AI 算法实现（贪心算法版本）
- `src/utils/game.ts` - 游戏规则工具函数
- `src/utils/audio.ts` - 音效管理系统
- `src/views/Leaderboard.vue` - 排行榜页面

#### 关键常量

- `BOARD_SIZE = 15` - 棋盘大小
- 棋子尺寸: 40px (桌面), 30px (移动端)
- 格子尺寸: 48px (桌面), 36px (移动端)
