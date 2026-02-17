# Spec: Board System

## ADDED Requirements

### Requirement: 棋盘尺寸
棋盘系统 SHALL 渲染标准的 15×15 五子棋棋盘。

#### Scenario: 棋盘初始化
- **WHEN** 游戏启动时
- **THEN** 系统显示 15 行 15 列的棋盘网格

### Requirement: 棋盘格子渲染
棋盘系统 SHALL 为每个格子渲染正确的视觉样式，包括空白、黑子、白子三种状态。

#### Scenario: 空白格子
- **WHEN** 格子没有棋子时
- **THEN** 显示空的交叉点样式

#### Scenario: 黑子显示
- **WHEN** 格子状态为黑子
- **THEN** 显示黑色圆形棋子

#### Scenario: 白子显示
- **WHEN** 格子状态为白子
- **THEN** 显示白色圆形棋子

### Requirement: 点击交互
棋盘系统 SHALL 允许玩家点击空白格子进行落子。

#### Scenario: 有效落子
- **WHEN** 玩家点击空白格子且游戏未结束
- **THEN** 系统触发落子事件，传入行号和列号

#### Scenario: 无效点击
- **WHEN** 玩家点击已有棋子的格子
- **THEN** 系统忽略该点击操作

#### Scenario: 游戏结束点击
- **WHEN** 游戏已结束时玩家点击棋盘
- **THEN** 系统忽略该点击操作

### Requirement: 最后落子高亮
棋盘系统 SHALL 高亮显示最后落子的位置。

#### Scenario: 高亮最后落子
- **WHEN** 玩家或 AI 落子后
- **THEN** 最后落子位置的棋子显示高亮标记

### Requirement: 坐标标注
棋盘系统 SHOULD 在棋盘边缘显示行列坐标（A-O, 1-15）。

#### Scenario: 坐标显示
- **WHEN** 棋盘渲染时
- **THEN** 左侧显示列号 A-O，顶部显示行号 1-15

### Requirement: 响应式布局
棋盘系统 SHALL 适配不同屏幕尺寸，保持棋盘可见性和可操作性。

#### Scenario: 移动端适配
- **WHEN** 在小屏幕设备上显示
- **THEN** 棋盘自动缩放以适应屏幕宽度

#### Scenario: 桌面端显示
- **WHEN** 在桌面设备上显示
- **THEN** 棋盘以合适的尺寸居中显示
