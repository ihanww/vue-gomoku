/**
 * AI 对战系统
 * 使用贪心算法 + 威胁检测，简单可靠
 */

import type { BoardType, Player, Difficulty } from '@/types/game'
import {
  makeMove,
  checkWin,
  isBoardFull,
  getEmptyPositions,
  getNeighborEmptyPositions,
  isBoardEmpty,
  getCenterPosition,
  BOARD_SIZE,
} from './game'

/** 棋型评分 */
const SCORE = {
  FIVE: 1000000,
  LIVE_FOUR: 500000,
  RUSH_FOUR: 10000,
  LIVE_THREE: 5000,
  SLEEP_THREE: 500,
  LIVE_TWO: 100,
  ONE: 10,
} as const

function getCell(board: BoardType, row: number, col: number): 'empty' | 'black' | 'white' {
  return board[row]?.[col] ?? 'empty'
}

/**
 * 计算棋盘上的棋子数量
 */
function countStones(board: BoardType): number {
  let count = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (getCell(board, row, col) !== 'empty') count++
    }
  }
  return count
}

/**
 * 分析某个位置的棋型
 * 返回各个方向的棋型信息
 */
function analyzePatterns(
  board: BoardType,
  row: number,
  col: number,
  player: Player,
): {
  five: boolean
  liveFour: boolean
  rushFour: boolean
  liveThree: boolean
  sleepThree: boolean
  liveTwo: boolean
} {
  const result = {
    five: false,
    liveFour: false,
    rushFour: false,
    liveThree: false,
    sleepThree: false,
    liveTwo: false,
  }

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const

  for (const [dr, dc] of directions) {
    // 计算该方向的连续棋子数和开放端数
    let count = 1
    let openEnds = 0
    let blocked = 0

    // 正向
    let r = row + dr
    let c = col + dc
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      getCell(board, r, c) === player
    ) {
      count++
      r += dr
      c += dc
    }
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && getCell(board, r, c) === 'empty') {
      openEnds++
    } else {
      blocked++
    }

    // 反向
    r = row - dr
    c = col - dc
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      getCell(board, r, c) === player
    ) {
      count++
      r -= dr
      c -= dc
    }
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && getCell(board, r, c) === 'empty') {
      openEnds++
    } else {
      blocked++
    }

    // 判断棋型
    if (count >= 5) result.five = true
    else if (count === 4 && openEnds === 2) result.liveFour = true
    else if (count === 4 && openEnds === 1) result.rushFour = true
    else if (count === 3 && openEnds === 2) result.liveThree = true
    else if (count === 3 && openEnds === 1) result.sleepThree = true
    else if (count === 2 && openEnds === 2) result.liveTwo = true
  }

  return result
}

/**
 * 评估某个位置的综合得分
 */
function evaluatePosition(board: BoardType, row: number, col: number, player: Player): number {
  const opponent = player === 'black' ? 'white' : 'black'

  // 评估进攻价值（模拟落子后的棋型）
  const testBoard = makeMove(board, row, col, player)
  const attackPatterns = analyzePatterns(testBoard, row, col, player)

  let score = 0
  if (attackPatterns.five) score += SCORE.FIVE
  else if (attackPatterns.liveFour) score += SCORE.LIVE_FOUR
  else if (attackPatterns.rushFour) score += SCORE.RUSH_FOUR
  else if (attackPatterns.liveThree) score += SCORE.LIVE_THREE
  else if (attackPatterns.sleepThree) score += SCORE.SLEEP_THREE
  else if (attackPatterns.liveTwo) score += SCORE.LIVE_TWO
  else score += SCORE.ONE

  // 评估防守价值（如果不落子，对手落子会怎样）
  const testBoard2 = makeMove(board, row, col, opponent)
  const defensePatterns = analyzePatterns(testBoard2, row, col, opponent)

  let defenseScore = 0
  if (defensePatterns.five) defenseScore += SCORE.FIVE
  else if (defensePatterns.liveFour) defenseScore += SCORE.LIVE_FOUR
  else if (defensePatterns.rushFour) defenseScore += SCORE.RUSH_FOUR
  else if (defensePatterns.liveThree) defenseScore += SCORE.LIVE_THREE
  else if (defensePatterns.sleepThree) defenseScore += SCORE.SLEEP_THREE
  else if (defensePatterns.liveTwo) defenseScore += SCORE.LIVE_TWO
  else defenseScore += SCORE.ONE

  // 防守权重稍高
  return score + defenseScore * 1.2
}

/**
 * 获取最佳落子位置（贪心算法）
 */
export function getBestMove(
  board: BoardType,
  difficulty: Difficulty,
  aiPlayer: Player,
): { row: number; col: number } | null {
  const stoneCount = countStones(board)

  // 空棋盘开局
  if (stoneCount === 0) {
    const center = getCenterPosition()
    return { row: center.row, col: center.col }
  }

  const opponent = aiPlayer === 'black' ? 'white' : 'black'

  // 首先检查是否有直接获胜的位置
  const winMove = findCriticalMove(board, aiPlayer, true)
  if (winMove) return winMove.move

  // 检查是否需要紧急防守
  const blockMove = findCriticalMove(board, opponent, false)
  if (blockMove && blockMove.score >= SCORE.LIVE_FOUR) {
    return blockMove.move
  }

  // 开局策略：前几手下在天元附近
  if (stoneCount <= 4) {
    const openingMove = getOpeningMove(board, aiPlayer)
    if (openingMove) return openingMove
  }

  // 根据难度调整搜索策略
  const searchDepth = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 20

  // 获取候选位置并评分
  const candidates = getCandidatesAndScore(board, aiPlayer, searchDepth)

  // 添加一些随机性，让AI不那么机械
  if (difficulty === 'easy' && candidates.length > 1) {
    // 简单模式：从前3名中随机选择
    const topCandidates = candidates.slice(0, Math.min(3, candidates.length))
    const randomIndex = Math.floor(Math.random() * topCandidates.length)
    return topCandidates[randomIndex]?.move || null
  }

  // 选择得分最高的位置
  return candidates[0]?.move || null
}

/**
 * 查找关键位置（获胜或需要防守）
 */
function findCriticalMove(
  board: BoardType,
  player: Player,
  checkWin: boolean,
): { move: { row: number; col: number }; score: number } | null {
  const emptyPositions = getEmptyPositions(board)

  for (const { row, col } of emptyPositions) {
    // 只考虑有棋子邻近的位置
    const neighbors = getNeighborEmptyPositions(board, row, col, 2)
    const hasNeighbor = neighbors.some(({ row: r, col: c }) => getCell(board, r, c) !== 'empty')
    if (!hasNeighbor) continue

    const testBoard = makeMove(board, row, col, player)
    const patterns = analyzePatterns(testBoard, row, col, player)

    if (checkWin) {
      if (patterns.five) return { move: { row, col }, score: SCORE.FIVE }
      if (patterns.liveFour) return { move: { row, col }, score: SCORE.LIVE_FOUR }
      if (patterns.rushFour) return { move: { row, col }, score: SCORE.RUSH_FOUR }
    } else {
      // 防守时，只关注最紧急的威胁
      if (patterns.five || patterns.liveFour || patterns.rushFour) {
        const score = patterns.five
          ? SCORE.FIVE
          : patterns.liveFour
            ? SCORE.LIVE_FOUR
            : SCORE.RUSH_FOUR
        return { move: { row, col }, score }
      }
    }
  }

  return null
}

/**
 * 获取候选位置并评分
 */
function getCandidatesAndScore(
  board: BoardType,
  player: Player,
  maxCount: number,
): { move: { row: number; col: number }; score: number }[] {
  const emptyPositions = getEmptyPositions(board)
  const candidates: { move: { row: number; col: number }; score: number }[] = []

  // 根据棋子数量决定搜索范围
  const stoneCount = countStones(board)
  const searchRange = stoneCount <= 8 ? 1 : 2

  for (const { row, col } of emptyPositions) {
    // 只考虑有棋子邻近的位置
    const neighbors = getNeighborEmptyPositions(board, row, col, searchRange)
    const hasNeighbor = neighbors.some(({ row: r, col: c }) => getCell(board, r, c) !== 'empty')
    if (!hasNeighbor) continue

    const score = evaluatePosition(board, row, col, player)
    candidates.push({ move: { row, col }, score })
  }

  // 如果没有邻近位置，返回中心附近的空位
  if (candidates.length === 0) {
    const center = getCenterPosition()
    for (const { row, col } of emptyPositions) {
      const dist = Math.abs(row - center.row) + Math.abs(col - center.col)
      if (dist <= 5) {
        candidates.push({ move: { row, col }, score: SCORE.ONE })
      }
    }
  }

  // 按分数排序
  candidates.sort((a, b) => b.score - a.score)

  return candidates.slice(0, maxCount)
}

/**
 * 开局策略
 */
function getOpeningMove(board: BoardType, aiPlayer: Player): { row: number; col: number } | null {
  const center = getCenterPosition()

  // 如果中心为空，返回中心
  if (getCell(board, center.row, center.col) === 'empty') {
    return { row: center.row, col: center.col }
  }

  // 返回中心周围的位置
  const positions = [
    { row: center.row - 1, col: center.col },
    { row: center.row + 1, col: center.col },
    { row: center.row, col: center.col - 1 },
    { row: center.row, col: center.col + 1 },
    { row: center.row - 1, col: center.col - 1 },
    { row: center.row - 1, col: center.col + 1 },
    { row: center.row + 1, col: center.col - 1 },
    { row: center.row + 1, col: center.col + 1 },
  ]

  for (const pos of positions) {
    if (
      pos.row >= 0 &&
      pos.row < BOARD_SIZE &&
      pos.col >= 0 &&
      pos.col < BOARD_SIZE &&
      getCell(board, pos.row, pos.col) === 'empty'
    ) {
      return pos
    }
  }

  return null
}

/**
 * 获取首步落子位置
 */
export function getFirstMove(
  board: BoardType,
  aiPlayer: Player,
): { row: number; col: number } | null {
  return getBestMove(board, 'medium', aiPlayer)
}
