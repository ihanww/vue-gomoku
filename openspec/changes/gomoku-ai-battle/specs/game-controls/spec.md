# Spec: Game Controls

## ADDED Requirements

### Requirement: 新游戏按钮
控制面板 SHALL 提供开始新游戏的按钮。

#### Scenario: 点击新游戏
- **WHEN** 玩家点击"新游戏"按钮
- **THEN** 游戏重置到初始状态，开始新的对局

#### Scenario: 游戏中新游戏
- **WHEN** 游戏进行中点击"新游戏"按钮
- **THEN** 系统提示确认操作，确认后重置游戏

### Requirement: 悔棋按钮
控制面板 SHALL 提供悔棋按钮，允许玩家撤销最近的操作。

#### Scenario: 正常悔棋
- **WHEN** 玩家点击"悔棋"按钮且存在可撤销的步骤
- **THEN** 撤销玩家和 AI 的最近各一步落子

#### Scenario: 无步骤悔棋
- **WHEN** 游戏开始时点击"悔棋"按钮
- **THEN** 按钮禁用或操作无效

### Requirement: 难度选择
控制面板 SHALL 允许玩家选择 AI 难度等级。

#### Scenario: 选择难度
- **WHEN** 玩家选择难度（简单/中等/困难）
- **THEN** AI 使用对应的搜索深度进行决策

#### Scenario: 游戏中切换难度
- **WHEN** 游戏进行中切换难度
- **THEN** 新难度在下一局游戏生效

### Requirement: 执棋选择
控制面板 SHALL 允许玩家选择执黑先手或执白后手。

#### Scenario: 选择执黑
- **WHEN** 玩家选择执黑
- **THEN** 玩家先手，AI 后手

#### Scenario: 选择执白
- **WHEN** 玩家选择执白
- **THEN** AI 先手，玩家后手

### Requirement: 游戏状态显示
控制面板 SHALL 显示当前游戏状态信息。

#### Scenario: 显示当前玩家
- **WHEN** 游戏进行中
- **THEN** 显示当前轮到哪方落子

#### Scenario: 显示玩家回合
- **WHEN** 轮到玩家落子
- **THEN** 显示"你的回合"提示

#### Scenario: 显示 AI 回合
- **WHEN** 轮到 AI 落子
- **THEN** 显示"AI 思考中..."提示

### Requirement: 胜负结果显示
控制面板 SHALL 在游戏结束时显示胜负结果。

#### Scenario: 玩家胜利
- **WHEN** 玩家达成五连
- **THEN** 显示"你赢了！"胜利消息

#### Scenario: AI 胜利
- **WHEN** AI 达成五连
- **THEN** 显示"AI 赢了"失败消息

#### Scenario: 和棋
- **WHEN** 棋盘填满且无五连
- **THEN** 显示"和棋"消息

### Requirement: 游戏统计
控制面板 SHALL 显示当前对局的统计数据。

#### Scenario: 显示步数
- **WHEN** 游戏进行中
- **THEN** 显示当前总步数

#### Scenario: 显示用时
- **WHEN** 游戏进行中
- **THEN** 显示当前局用时（可选）

### Requirement: 控制按钮状态
控制面板 SHALL 根据游戏状态启用/禁用相应按钮。

#### Scenario: 游戏进行中
- **WHEN** 游戏正在进行
- **THEN** 新游戏、悔棋按钮启用，难度、执棋选择禁用

#### Scenario: 游戏结束
- **WHEN** 游戏已结束
- **THEN** 新游戏按钮启用，悔棋按钮禁用

#### Scenario: AI 思考中
- **WHEN** AI 正在计算
- **THEN** 悔棋、落子操作禁用
