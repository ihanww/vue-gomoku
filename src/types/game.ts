// 游戏相关类型定义

/**
 * 玩家类型
 * - 'black': 黑方
 * - 'white': 白方
 * - null: 无玩家（用于游戏未开始或和棋）
 */
export type Player = 'black' | 'white' | null

/**
 * 棋盘格子类型
 * - 'empty': 空格子
 * - 'black': 黑子
 * - 'white': 白子
 */
export type BoardCell = 'empty' | 'black' | 'white'

/**
 * 棋盘类型：15×15 二维数组
 */
export type BoardType = BoardCell[][]

/**
 * 落子记录
 */
export interface Move {
  /** 行号 (0-14) */
  row: number
  /** 列号 (0-14) */
  col: number
  /** 落子玩家 */
  player: Player
}

/**
 * 游戏难度
 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * 游戏模式
 */
export type GameMode = 'pve' // 玩家 vs AI

/**
 * AI 配置
 */
export interface AiConfig {
  /** 难度等级 */
  difficulty: Difficulty
  /** AI 执棋颜色 */
  aiPlayer: Player
  /** 搜索深度 */
  searchDepth: number
}

/**
 * 游戏状态
 */
export interface GameStatus {
  /** 棋盘状态 */
  board: BoardType
  /** 当前玩家 */
  currentPlayer: Player
  /** 游戏是否结束 */
  isGameOver: boolean
  /** 获胜者 */
  winner: Player
  /** 落子历史 */
  moveHistory: Move[]
  /** 游戏模式 */
  gameMode: GameMode
  /** AI 配置 */
  aiConfig: AiConfig
  /** AI 是否正在思考 */
  isAiThinking: boolean
}

/**
 * 对局历史记录
 */
export interface GameHistory {
  /** 唯一标识 */
  id: string
  /** 对局日期 */
  date: string
  /** 游戏结果 */
  result: 'win' | 'lose' | 'draw'
  /** 对手 */
  opponent: string
  /** 总步数 */
  totalMoves: number
  /** 难度 */
  difficulty: Difficulty
  /** 用时（秒） */
  duration: number
  /** 落子序列 */
  moves: Move[]
}

/**
 * 复盘状态
 */
export interface ReplayState {
  /** 当前复盘的对局 */
  currentGame: GameHistory | null
  /** 当前步数 */
  currentStep: number
  /** 是否正在自动播放 */
  isPlaying: boolean
}

/**
 * 最佳成绩记录
 */
export interface BestScore {
  /** 难度 */
  difficulty: Difficulty
  /** 最少步数 */
  minMoves: number
  /** 最快用时（秒） */
  bestTime: number
  /** 日期 */
  date: string
}

/**
 * 玩家统计数据
 */
export interface PlayerStats {
  /** 胜利次数 */
  wins: number
  /** 失败次数 */
  losses: number
  /** 和棋次数 */
  draws: number
  /** 最佳成绩（按难度分类） */
  bestScores: Record<Difficulty, BestScore | null>
}

/**
 * 音效设置
 */
export interface AudioSettings {
  /** 是否启用音效 */
  enabled: boolean
  /** 音量 (0-100) */
  volume: number
}

/**
 * 动画设置
 */
export interface AnimationSettings {
  /** 是否启用动画 */
  enabled: boolean
}
