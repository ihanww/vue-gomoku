# Spec: Game Engine

## ADDED Requirements

### Requirement: 游戏状态管理
游戏引擎 SHALL 维护完整的游戏状态，包括棋盘、当前玩家、游戏状态等。

#### Scenario: 游戏初始化
- **WHEN** 新游戏开始时
- **THEN** 棋盘重置为空，当前玩家设为黑方，游戏状态设为进行中

#### Scenario: 游戏状态查询
- **WHEN** 查询游戏状态
- **THEN** 系统返回当前棋盘、当前玩家、是否结束、获胜者等信息

### Requirement: 落子逻辑
游戏引擎 SHALL 执行落子操作并更新游戏状态。

#### Scenario: 有效落子
- **WHEN** 当前玩家在空位置落子
- **THEN** 棋盘对应位置更新为当前玩家的棋子，切换到下一个玩家

#### Scenario: 落子记录
- **WHEN** 执行落子操作
- **THEN** 系统将落子位置（行、列）和玩家记录到历史中

### Requirement: 胜负判定
游戏引擎 SHALL 在每次落子后检查是否达成五连胜利条件。

#### Scenario: 横向五连
- **WHEN** 落子后横向连续五个相同棋子
- **THEN** 当前玩家获胜，游戏结束

#### Scenario: 纵向五连
- **WHEN** 落子后纵向连续五个相同棋子
- **THEN** 当前玩家获胜，游戏结束

#### Scenario: 主对角线五连
- **WHEN** 落子后主对角线方向（左上到右下）连续五个相同棋子
- **THEN** 当前玩家获胜，游戏结束

#### Scenario: 副对角线五连
- **WHEN** 落子后副对角线方向（右上到左下）连续五个相同棋子
- **THEN** 当前玩家获胜，游戏结束

#### Scenario: 未分胜负
- **WHEN** 落子后未达成五连且棋盘未满
- **THEN** 游戏继续进行

#### Scenario: 和棋
- **WHEN** 棋盘已满且未达成五连
- **THEN** 游戏结束，结果为和棋

### Requirement: 悔棋功能
游戏引擎 SHALL 允许玩家撤销最近的落子操作。

#### Scenario: 人机对战悔棋
- **WHEN** 玩家请求悔棋
- **THEN** 系统撤销最近的玩家落子和 AI 落子（共两步）

#### Scenario: 开局无法悔棋
- **WHEN** 游戏开始前或开局时请求悔棋
- **THEN** 系统拒绝悔棋请求

### Requirement: 游戏重置
游戏引擎 SHALL 支持重置游戏到初始状态。

#### Scenario: 重置游戏
- **WHEN** 玩家请求重新开始
- **THEN** 棋盘清空，历史记录清空，游戏状态重置为初始状态

### Requirement: 玩家轮换
游戏引擎 SHALL 在每次落子后自动切换当前玩家。

#### Scenario: 黑方落子后
- **WHEN** 黑方完成落子
- **THEN** 当前玩家切换为白方

#### Scenario: 白方落子后
- **WHEN** 白方完成落子
- **THEN** 当前玩家切换为黑方

### Requirement: 游戏模式
游戏引擎 SHALL 支持人机对战模式。

#### Scenario: 人机模式
- **WHEN** 选择人机对战模式
- **THEN** 系统设置玩家和 AI 的角色（执黑或执白）
