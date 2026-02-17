/**
 * 游戏引擎核心逻辑
 * 包含棋盘操作、胜负判定等核心功能
 */

import type { BoardType, BoardCell, Player, Move } from '@/types/game'

/** 棋盘大小 */
export const BOARD_SIZE = 15

/** 连成一线获胜所需棋子数 */
export const WIN_COUNT = 5

/**
 * 安全获取棋盘格子值
 */
function getCell(board: BoardType, row: number, col: number): BoardCell {
  return board[row]?.[col] ?? 'empty'
}

/**
 * 创建空棋盘
 * @returns 15×15 的空棋盘二维数组
 */
export function createEmptyBoard(): BoardType {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill('empty')
  ) as BoardType
}

/**
 * 检查落子是否有效
 * @param board 棋盘
 * @param row 行号 (0-14)
 * @param col 列号 (0-14)
 * @returns 是否可以落子
 */
export function isValidMove(board: BoardType, row: number, col: number): boolean {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE &&
    getCell(board, row, col) === 'empty'
  )
}

/**
 * 执行落子操作
 * @param board 棋盘
 * @param row 行号
 * @param col 列号
 * @param player 玩家
 * @returns 新的棋盘（不修改原棋盘）
 */
export function makeMove(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): BoardType {
  if (!isValidMove(board, row, col)) {
    return board
  }

  const newBoard = board.map((r) => [...r]) as BoardType
  const boardRow = newBoard[row]
  if (boardRow) {
    boardRow[col] = player as BoardCell
  }
  return newBoard
}

/**
 * 检查某个方向的连子数量
 * @param board 棋盘
 * @param row 起始行
 * @param col 起始列
 * @param deltaRow 行方向增量
 * @param deltaCol 列方向增量
 * @param player 检查的玩家
 * @returns 连续棋子数量
 */
function countDirection(
  board: BoardType,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  player: Player
): number {
  let count = 0
  let r = row + deltaRow
  let c = col + deltaCol

  while (
    r >= 0 &&
    r < BOARD_SIZE &&
    c >= 0 &&
    c < BOARD_SIZE &&
    getCell(board, r, c) === player
  ) {
    count++
    r += deltaRow
    c += deltaCol
  }

  return count
}

/**
 * 检查横向胜负
 * @param board 棋盘
 * @param row 落子行
 * @param col 落子列
 * @param player 玩家
 * @returns 是否获胜
 */
export function checkHorizontal(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): boolean {
  const count =
    1 + countDirection(board, row, col, 0, -1, player) + countDirection(board, row, col, 0, 1, player)
  return count >= WIN_COUNT
}

/**
 * 检查纵向胜负
 * @param board 棋盘
 * @param row 落子行
 * @param col 落子列
 * @param player 玩家
 * @returns 是否获胜
 */
export function checkVertical(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): boolean {
  const count =
    1 +
    countDirection(board, row, col, -1, 0, player) +
    countDirection(board, row, col, 1, 0, player)
  return count >= WIN_COUNT
}

/**
 * 检查主对角线胜负（左上到右下）
 * @param board 棋盘
 * @param row 落子行
 * @param col 落子列
 * @param player 玩家
 * @returns 是否获胜
 */
export function checkDiagonal(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): boolean {
  const count =
    1 +
    countDirection(board, row, col, -1, -1, player) +
    countDirection(board, row, col, 1, 1, player)
  return count >= WIN_COUNT
}

/**
 * 检查副对角线胜负（右上到左下）
 * @param board 棋盘
 * @param row 落子行
 * @param col 落子列
 * @param player 玩家
 * @returns 是否获胜
 */
export function checkAntiDiagonal(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): boolean {
  const count =
    1 +
    countDirection(board, row, col, -1, 1, player) +
    countDirection(board, row, col, 1, -1, player)
  return count >= WIN_COUNT
}

/**
 * 检查是否获胜
 * @param board 棋盘
 * @param row 落子行
 * @param col 落子列
 * @param player 玩家
 * @returns 是否获胜
 */
export function checkWin(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): boolean {
  return (
    checkHorizontal(board, row, col, player) ||
    checkVertical(board, row, col, player) ||
    checkDiagonal(board, row, col, player) ||
    checkAntiDiagonal(board, row, col, player)
  )
}

/**
 * 检查棋盘是否已满
 * @param board 棋盘
 * @returns 是否已满
 */
export function isBoardFull(board: BoardType): boolean {
  return board.every((row) => row.every((cell) => cell !== 'empty'))
}

/**
 * 获取棋盘上某位置的分数（用于 AI 评估）
 * @param board 棋盘
 * @param row 行号
 * @param col 列号
 * @param player 玩家
 * @returns 该位置的价值分数
 */
export function getPositionScore(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): number {
  const opponent = player === 'black' ? 'white' : 'black'

  // 检查该位置对玩家的价值
  const playerScore = evaluateDirection(board, row, col, player)
  // 检查该位置对对手的价值（防守价值）
  const opponentScore = evaluateDirection(board, row, col, opponent)

  return playerScore + opponentScore * 0.9 // 防守权重略高
}

/**
 * 评估某位置在所有方向的价值
 * @param board 棋盘
 * @param row 行号
 * @param col 列号
 * @param player 玩家
 * @returns 该位置的评估分数
 */
function evaluateDirection(
  board: BoardType,
  row: number,
  col: number,
  player: Player
): number {
  const directions = [
    [0, 1], // 横向
    [1, 0], // 纵向
    [1, 1], // 主对角线
    [1, -1] // 副对角线
  ]

  let totalScore = 0

  for (const direction of directions) {
    const [dr = 0, dc = 0] = direction
    totalScore += evaluateLine(board, row, col, dr, dc, player)
  }

  return totalScore
}

/**
 * 评估某方向上的棋型
 * @param board 棋盘
 * @param row 起始行
 * @param col 起始列
 * @param deltaRow 行方向
 * @param deltaCol 列方向
 * @param player 玩家
 * @returns 该方向的分数
 */
function evaluateLine(
  board: BoardType,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  player: Player
): number {
  // 检查正向和反向
  let count = 1
  let openEnds = 0

  // 正向
  let r = row + deltaRow
  let c = col + deltaCol
  let blocked = false

  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
    const cell = getCell(board, r, c)
    if (cell === player) {
      count++
    } else if (cell === 'empty') {
      openEnds++
      break
    } else {
      blocked = true
      break
    }
    r += deltaRow
    c += deltaCol
  }

  // 反向
  r = row - deltaRow
  c = col - deltaCol

  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
    const cell = getCell(board, r, c)
    if (cell === player) {
      count++
    } else if (cell === 'empty') {
      openEnds++
      break
    } else {
      blocked = true
      break
    }
    r -= deltaRow
    c -= deltaCol
  }

  // 根据棋型评分
  if (count >= 5) return 100000 // 五连
  if (count === 4 && openEnds === 2) return 10000 // 活四
  if (count === 4 && openEnds === 1) return 1000 // 冲四
  if (count === 3 && openEnds === 2) return 1000 // 活三
  if (count === 3 && openEnds === 1) return 100 // 眠三
  if (count === 2 && openEnds === 2) return 10 // 活二

  return count
}

/**
 * 获取所有空位置
 * @param board 棋盘
 * @returns 空位置的坐标数组
 */
export function getEmptyPositions(board: BoardType): Array<{ row: number; col: number }> {
  const positions: Array<{ row: number; col: number }> = []

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (getCell(board, row, col) === 'empty') {
        positions.push({ row, col })
      }
    }
  }

  return positions
}

/**
 * 获取落子位置周围的邻近空位（用于 AI 优化）
 * @param board 棋盘
 * @param row 中心行
 * @param col 中心列
 * @param radius 邻近半径
 * @returns 邻近空位
 */
export function getNeighborEmptyPositions(
  board: BoardType,
  row: number,
  col: number,
  radius = 2
): Array<{ row: number; col: number }> {
  const positions: Array<{ row: number; col: number }> = []
  const startRow = Math.max(0, row - radius)
  const endRow = Math.min(BOARD_SIZE - 1, row + radius)
  const startCol = Math.max(0, col - radius)
  const endCol = Math.min(BOARD_SIZE - 1, col + radius)

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (getCell(board, r, c) === 'empty' && (r !== row || c !== col)) {
        positions.push({ row: r, col: c })
      }
    }
  }

  return positions
}

/**
 * 检查棋盘是否为空（游戏开始状态）
 * @param board 棋盘
 * @returns 是否为空
 */
export function isBoardEmpty(board: BoardType): boolean {
  return board.every((row) => row.every((cell) => cell === 'empty'))
}

/**
 * 获取中心位置坐标
 * @returns 中心坐标
 */
export function getCenterPosition(): { row: number; col: number } {
  const center = Math.floor(BOARD_SIZE / 2)
  return { row: center, col: center }
}
