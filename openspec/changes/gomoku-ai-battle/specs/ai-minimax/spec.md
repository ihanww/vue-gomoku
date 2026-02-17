# Spec: AI Minimax

## ADDED Requirements

### Requirement: Minimax 算法
AI 系统 SHALL 使用 Minimax 算法进行落子决策。

#### Scenario: 基础搜索
- **WHEN** AI 需要落子时
- **THEN** 系统使用 Minimax 算法搜索最优落子位置

### Requirement: 搜索深度配置
AI 系统 SHALL 支持不同的搜索深度以实现不同难度等级。

#### Scenario: 简单难度
- **WHEN** AI 难度设为简单
- **THEN** 搜索深度为 2 层

#### Scenario: 中等难度
- **WHEN** AI 难度设为中等
- **THEN** 搜索深度为 4 层

#### Scenario: 困难难度
- **WHEN** AI 难度设为困难
- **THEN** 搜索深度为 6 层

### Requirement: 局面评估
AI 系统 SHALL 使用评估函数对棋盘局面进行评分。

#### Scenario: 评估棋型
- **WHEN** 评估棋盘局面
- **THEN** 系统根据连子情况、棋型价值计算分数

### Requirement: 棋型评分规则
AI 系统 SHALL 根据不同棋型给予相应评分。

#### Scenario: 五连评分
- **WHEN** 检测到五连
- **THEN** 评分为 100000 分（必胜）

#### Scenario: 活四评分
- **WHEN** 检测到活四（两端开放的四连）
- **THEN** 评分为 10000 分

#### Scenario: 冲四评分
- **WHEN** 检测到冲四（一端被堵的四连）
- **THEN** 评分为 1000 分

#### Scenario: 活三评分
- **WHEN** 检测到活三（两端开放的三连）
- **THEN** 评分为 1000 分

#### Scenario: 眠三评分
- **WHEN** 检测到眠三（一端被堵的三连）
- **THEN** 评分为 100 分

#### Scenario: 活二评分
- **WHEN** 检测到活二（两端开放的二连）
- **THEN** 评分为 10 分

### Requirement: 攻防权衡
AI 系统 SHALL 同时考虑进攻和防守价值。

#### Scenario: 进攻评估
- **WHEN** 评估 AI 己方棋型
- **THEN** 计算进攻分数

#### Scenario: 防守评估
- **WHEN** 评估对方棋型
- **THEN** 计算防守分数

#### Scenario: 综合决策
- **WHEN** 选择落子位置
- **THEN** 综合进攻和防守分数做出最优决策

### Requirement: 思考状态
AI 系统 SHALL 在计算过程中显示思考状态。

#### Scenario: 思考中
- **WHEN** AI 正在计算落子
- **THEN** 界面显示 "AI 思考中..." 状态

#### Scenario: 思考完成
- **WHEN** AI 完成计算并落子
- **THEN** 思考状态消失，显示落子结果

### Requirement: 落子响应
AI 系统 SHALL 在玩家落子后自动进行 AI 落子。

#### Scenario: 玩家落子后 AI 响应
- **WHEN** 玩家完成落子
- **THEN** AI 自动计算并落子

### Requirement: 首步策略
AI 系统 SHOULD 在开局阶段使用预设的优秀开局位置。

#### Scenario: AI 先手
- **WHEN** AI 执黑先手
- **THEN** AI 优先选择棋盘中心区域落子

#### Scenario: AI 后手
- **WHEN** AI 执白后手且中心位置为空
- **THEN** AI 优先选择中心或其周边位置落子
