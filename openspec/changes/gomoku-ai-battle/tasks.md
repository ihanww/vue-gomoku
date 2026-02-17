# Tasks: 五子棋人机对战系统

## 1. 项目基础设置

- [x] 1.1 创建 `src/types/` 目录
- [x] 1.2 创建 `src/components/` 目录
- [x] 1.3 创建 `src/views/` 目录
- [x] 1.4 创建 `src/utils/` 目录
- [x] 1.5 创建 `public/sounds/` 目录（音效资源）
- [x] 1.6 创建 `public/images/` 目录（图片资源）

## 2. 类型定义 (src/types/game.ts)

- [x] 2.1 定义 Player 类型 ('black' | 'white' | null)
- [x] 2.2 定义 BoardCell 类型 (empty | black | white)
- [x] 2.3 定义 BoardType 类型 (15×15 二维数组)
- [x] 2.4 定义 Move 接口 (row, col, player)
- [x] 2.5 定义 GameStatus 接口
- [x] 2.6 定义 GameHistory 接口
- [x] 2.7 定义 PlayerStats 接口
- [x] 2.8 定义 Difficulty 类型 ('easy' | 'medium' | 'hard')
- [x] 2.9 定义 AiConfig 接口

## 3. 游戏引擎核心逻辑 (src/utils/game.ts)

- [x] 3.1 实现 createEmptyBoard 函数
- [x] 3.2 实现 isValidMove 函数
- [x] 3.3 实现 makeMove 函数
- [x] 3.4 实现横向胜负判定 checkHorizontal
- [x] 3.5 实现纵向胜负判定 checkVertical
- [x] 3.6 实现主对角线胜负判定 checkDiagonal
- [x] 3.7 实现副对角线胜负判定 checkAntiDiagonal
- [x] 3.8 实现 checkWin 函数（整合四个方向）
- [x] 3.9 实现 isBoardFull 函数
- [x] 3.10 实现 getBoardScore 函数（用于 AI 评估）
- [ ] 3.11 编写游戏引擎单元测试

## 4. AI 算法实现 (src/utils/ai.ts)

- [x] 4.1 定义棋型评分常量（五连、活四、冲四等）
- [x] 4.2 实现 evaluatePosition 函数（位置评估）
- [x] 4.3 实现 evaluateBoard 函数（局面评估）
- [x] 4.4 实现 getEmptyPositions 函数
- [x] 4.5 实现 minimax 函数
- [x] 4.6 实现 getBestMove 函数（整合难度配置）
- [x] 4.7 实现 getFirstMove 函数（开局策略）
- [ ] 4.8 编写 AI 算法单元测试

## 5. Pinia Store (src/stores/game.ts)

- [ ] 5.1 创建 game store 结构
- [ ] 5.2 实现 state（board, currentPlayer, isGameOver, winner 等）
- [ ] 5.3 实现 startGame action
- [ ] 5.4 实现 makeMove action
- [ ] 5.5 实现 aiMove action
- [ ] 5.6 实现 undoMove action
- [ ] 5.7 实现 resetGame action
- [ ] 5.8 实现 setDifficulty action
- [ ] 5.9 实现 setPlayerColor action
- [ ] 5.10 实现 getters（currentPlayerText, gameStatusText 等）

## 6. 历史记录 Store (src/stores/history.ts)

- [ ] 6.1 创建 history store 结构
- [ ] 6.2 实现 state（histories, currentReplay）
- [ ] 6.3 实现 saveGame action
- [ ] 6.4 实现从 Local Storage 加载历史
- [ ] 6.5 实现保存到 Local Storage
- [ ] 6.6 实现 deleteHistory action
- [ ] 6.7 实现 clearAll action
- [ ] 6.8 实现 startReplay action
- [ ] 6.9 实现 replayStep action
- [ ] 6.10 实现 exportHistory action

## 7. 统计数据 Store (src/stores/stats.ts)

- [ ] 7.1 创建 stats store 结构
- [ ] 7.2 实现 state（wins, losses, draws, bestScores）
- [ ] 7.3 实现从 Local Storage 加载统计数据
- [ ] 7.4 实现记录胜利 action
- [ ] 7.5 实现记录失败 action
- [ ] 7.6 实现记录和棋 action
- [ ] 7.7 实现更新最佳成绩 action
- [ ] 7.8 实现重置统计数据 action
- [ ] 7.9 实现 getters（winRate, totalGames 等）

## 8. 棋盘格子组件 (src/components/Cell.vue)

- [x] 8.1 创建 Cell.vue 组件
- [x] 8.2 定义 props（row, col, cellType, isLastMove）
- [x] 8.3 实现格子渲染（空白、黑子、白子）
- [x] 8.4 实现最后落子高亮效果
- [x] 8.5 实现 emit（cell-click）
- [x] 8.6 添加基础样式

## 9. 棋盘组件 (src/components/Board.vue)

- [x] 9.1 创建 Board.vue 组件
- [x] 9.2 集成 Cell 组件渲染 15×15 棋盘
- [x] 9.3 实现点击事件处理
- [x] 9.4 实现坐标标注（A-O, 1-15）
- [x] 9.5 添加响应式布局样式
- [x] 9.6 添加移动端适配

## 10. 游戏控制面板组件 (src/components/GameControls.vue)

- [x] 10.1 创建 GameControls.vue 组件
- [x] 10.2 实现"新游戏"按钮
- [x] 10.3 实现"悔棋"按钮
- [x] 10.4 实现难度选择（简单/中等/困难）
- [x] 10.5 实现执棋选择（执黑/执白）
- [x] 10.6 实现游戏状态显示（当前玩家、胜负信息）
- [x] 10.7 实现按钮状态控制（禁用/启用）
- [x] 10.8 添加样式和布局

## 11. 历史记录组件 (src/components/GameHistory.vue)

- [ ] 11.1 创建 GameHistory.vue 组件
- [ ] 11.2 实现历史记录列表显示
- [ ] 11.3 实现历史记录详情查看
- [ ] 11.4 实现删除单个记录
- [ ] 11.5 实现清空所有记录
- [ ] 11.6 添加样式和布局

## 12. 复盘组件 (src/components/GameReplay.vue)

- [ ] 12.1 创建 GameReplay.vue 组件
- [ ] 12.2 实现复盘棋盘显示
- [ ] 12.3 实现"首步"按钮
- [ ] 12.4 实现"上一步"按钮
- [ ] 12.5 实现"下一步"按钮
- [ ] 12.6 实现"末步"按钮
- [ ] 12.7 实现"自动播放"功能
- [ ] 12.8 实现进度条拖动
- [ ] 12.9 添加样式和动画

## 13. 排行榜组件 (src/components/Leaderboard.vue)

- [ ] 13.1 创建 Leaderboard.vue 组件
- [ ] 13.2 实现统计数据展示（胜/负/和/胜率）
- [ ] 13.3 实现最佳成绩列表
- [ ] 13.4 实现按难度分类显示
- [ ] 13.5 实现重置统计数据功能
- [ ] 13.6 实现导出数据功能
- [ ] 13.7 添加样式和布局

## 14. 音效系统 (src/utils/audio.ts)

- [ ] 14.1 创建 audio manager
- [ ] 14.2 实现音效预加载功能
- [ ] 14.3 实现播放落子音效
- [ ] 14.4 实现播放胜利音效
- [ ] 14.5 实现播放失败音效
- [ ] 14.6 实现播放和棋音效
- [ ] 14.7 实现播放 UI 交互音效
- [ ] 14.8 实现音量控制
- [ ] 14.9 实现音效开关
- [ ] 14.10 实现音效设置持久化

## 15. 游戏主页面 (src/views/Game.vue)

- [x] 15.1 创建 Game.vue 页面
- [x] 15.2 集成 Board 组件
- [x] 15.3 集成 GameControls 组件
- [x] 15.4 集成音效系统
- [x] 15.5 实现页面布局
- [x] 15.6 添加页面样式

## 16. 排行榜页面 (src/views/Leaderboard.vue)

- [x] 16.1 创建 Leaderboard.vue 页面
- [ ] 16.2 集成 Leaderboard 组件
- [x] 16.3 添加返回游戏按钮
- [x] 16.4 实现页面布局
- [x] 16.5 添加页面样式

## 17. 路由配置 (src/router/index.ts)

- [x] 17.1 配置游戏页面路由（/）
- [x] 17.2 配置排行榜页面路由（/leaderboard）
- [x] 17.3 添加路由导航

## 18. 根组件更新 (src/App.vue)

- [x] 18.1 更新 App.vue 模板
- [x] 18.2 添加 router-view
- [x] 18.3 添加全局样式
- [x] 18.4 添加导航链接

## 19. 动画效果实现

- [x] 19.1 实现棋子落子动画（缩放淡入）
- [ ] 19.2 实现悔棋消失动画
- [ ] 19.3 实现胜利连线高亮动画
- [x] 19.4 实现 UI 按钮悬停动画
- [ ] 19.5 实现面板展开/收起动画
- [ ] 19.6 实现模态框弹出动画
- [x] 19.7 实现 AI 思考加载动画
- [ ] 19.8 实现胜利/失败消息动画
- [ ] 19.9 实现 prefers-reduced-motion 支持

## 20. 单元测试

- [ ] 20.1 编写游戏引擎测试（src/utils/game.spec.ts）
- [ ] 20.2 编写 AI 算法测试（src/utils/ai.spec.ts）
- [ ] 20.3 编写 game store 测试
- [ ] 20.4 编写 history store 测试
- [ ] 20.5 编写 stats store 测试
- [ ] 20.6 编写 Cell 组件测试
- [ ] 20.7 编写 Board 组件测试
- [ ] 20.8 编写 GameControls 组件测试

## 21. E2E 测试 (e2e/)

- [ ] 21.1 编写游戏完整流程测试
- [ ] 21.2 编写胜负判定测试
- [ ] 21.3 编写悔棋功能测试
- [ ] 21.4 编写难度切换测试
- [ ] 21.5 编写历史记录测试
- [ ] 21.6 编写复盘功能测试
- [ ] 21.7 编写排行榜测试

## 22. 资源准备

- [ ] 22.1 准备落子音效文件（place.mp3）
- [ ] 22.2 准备胜利音效文件（win.mp3）
- [ ] 22.3 准备失败音效文件（lose.mp3）
- [ ] 22.4 准备和棋音效文件（draw.mp3）
- [ ] 22.5 准备 UI 点击音效文件（click.mp3）
- [ ] 22.6 准备棋子图标（可选）

## 23. 样式优化

- [ ] 23.1 设计棋盘颜色方案
- [ ] 23.2 设计棋子样式（黑子/白子）
- [ ] 23.3 设计按钮样式
- [ ] 23.4 设计面板样式
- [ ] 23.5 实现暗色主题支持（可选）
- [ ] 23.6 优化移动端布局
- [ ] 23.7 优化平板布局
- [ ] 23.8 优化桌面布局

## 24. 性能优化

- [ ] 24.1 优化 AI 计算性能
- [ ] 24.2 添加计算超时处理
- [ ] 24.3 优化棋盘渲染性能
- [ ] 24.4 实现虚拟滚动（历史记录列表）
- [ ] 24.5 优化动画性能
- [ ] 24.6 减少 bundle 体积

## 25. 最终检查和发布

- [x] 25.1 运行类型检查（pnpm type-check）
- [ ] 25.2 运行代码检查（pnpm lint）
- [ ] 25.3 运行单元测试（pnpm test:unit）
- [ ] 25.4 运行 E2E 测试（pnpm test:e2e）
- [x] 25.5 构建生产版本（pnpm build）
- [ ] 25.6 预览生产版本（pnpm preview）
- [ ] 25.7 更新 README.md
- [ ] 25.8 提交代码到 Git
