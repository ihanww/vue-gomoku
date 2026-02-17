/**
 * 游戏状态管理 Store
 * 使用 Pinia Composition API 风格
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player, BoardType, Move, Difficulty, GameMode, AiConfig } from '@/types/game'
import {
  createEmptyBoard,
  isValidMove,
  makeMove,
  checkWin,
  isBoardFull
} from '@/utils/game'
import { getBestMove } from '@/utils/ai'

export const useGameStore = defineStore('game', () => {
  // ===== State =====

  /** 棋盘状态 */
  const board = ref<BoardType>(createEmptyBoard())

  /** 当前玩家 */
  const currentPlayer = ref<Player>('black')

  /** 游戏是否结束 */
  const isGameOver = ref(false)

  /** 获胜者 */
  const winner = ref<Player>(null)

  /** 落子历史 */
  const moveHistory = ref<Move[]>([])

  /** 游戏模式 */
  const gameMode = ref<GameMode>('pve')

  /** AI 配置 */
  const aiConfig = ref<AiConfig>({
    difficulty: 'medium',
    aiPlayer: 'white',
    searchDepth: 4
  })

  /** AI 是否正在思考 */
  const isAiThinking = ref(false)

  /** 玩家执棋颜色 */
  const playerColor = ref<Player>('black')

  // ===== Actions =====

  /**
   * 开始新游戏
   */
  function startGame() {
    board.value = createEmptyBoard()
    currentPlayer.value = 'black'
    isGameOver.value = false
    winner.value = null
    moveHistory.value = []
    isAiThinking.value = false

    // 如果 AI 执黑先行
    if (aiConfig.value.aiPlayer === 'black') {
      aiMove()
    }
  }

  /**
   * 执行落子
   */
  function makeMoveAction(row: number, col: number) {
    // 验证落子
    if (isGameOver.value || isAiThinking.value) {
      return false
    }

    if (!isValidMove(board.value, row, col)) {
      return false
    }

    // 执行落子
    const player = currentPlayer.value
    board.value = makeMove(board.value, row, col, player)

    // 记录历史
    moveHistory.value.push({ row, col, player })

    // 检查胜负
    if (checkWin(board.value, row, col, player)) {
      isGameOver.value = true
      winner.value = player
      return true
    }

    // 检查和棋
    if (isBoardFull(board.value)) {
      isGameOver.value = true
      winner.value = null
      return true
    }

    // 切换玩家
    currentPlayer.value = player === 'black' ? 'white' : 'black'

    // 如果轮到 AI，触发 AI 落子
    if (currentPlayer.value === aiConfig.value.aiPlayer && !isGameOver.value) {
      // 使用 setTimeout 让 UI 先更新
      setTimeout(() => {
        aiMove()
      }, 100)
    }

    return true
  }

  /**
   * AI 落子
   */
  async function aiMove() {
    if (isGameOver.value) {
      return
    }

    isAiThinking.value = true

    // 等待一帧，让 UI 显示"思考中"状态
    await new Promise((resolve) => requestAnimationFrame(resolve))

    // 获取最佳落子位置
    const bestMove = getBestMove(
      board.value,
      aiConfig.value.difficulty,
      aiConfig.value.aiPlayer
    )

    isAiThinking.value = false

    if (bestMove) {
      makeMoveAction(bestMove.row, bestMove.col)
    }
  }

  /**
   * 悔棋（撤销最近两步：玩家 + AI）
   */
  function undoMove() {
    if (moveHistory.value.length === 0 || isGameOver.value || isAiThinking.value) {
      return false
    }

    // 人机对战需要撤销两步（玩家一步 + AI 一步）
    // 除非 AI 先手且只走了一步
    const stepsToUndo =
      aiConfig.value.aiPlayer === 'black' && moveHistory.value.length === 1 ? 1 : 2

    if (moveHistory.value.length < stepsToUndo) {
      return false
    }

    // 撤销指定步数
    for (let i = 0; i < stepsToUndo; i++) {
      const lastMove = moveHistory.value.pop()
      if (lastMove) {
        const row = board.value[lastMove.row]
        if (row) {
          row[lastMove.col] = 'empty'
        }
      }
    }

    // 恢复游戏状态
    isGameOver.value = false
    winner.value = null

    // 恢复当前玩家
    if (moveHistory.value.length > 0) {
      const lastMove = moveHistory.value[moveHistory.value.length - 1]
      if (lastMove) {
        currentPlayer.value = lastMove.player === 'black' ? 'white' : 'black'
      }
    } else {
      currentPlayer.value = 'black'
    }

    return true
  }

  /**
   * 重置游戏
   */
  function resetGame() {
    startGame()
  }

  /**
   * 设置难度
   */
  function setDifficulty(difficulty: Difficulty) {
    aiConfig.value.difficulty = difficulty

    // 更新搜索深度
    const depthMap: Record<Difficulty, number> = {
      easy: 2,
      medium: 4,
      hard: 6
    }
    aiConfig.value.searchDepth = depthMap[difficulty]
  }

  /**
   * 设置玩家执棋颜色
   */
  function setPlayerColor(color: Player) {
    playerColor.value = color
    aiConfig.value.aiPlayer = color === 'black' ? 'white' : 'black'
  }

  // ===== Getters =====

  /** 当前玩家文本 */
  const currentPlayerText = computed(() => {
    if (isGameOver.value) {
      if (winner.value === playerColor.value) {
        return '你赢了！🎉'
      } else if (winner.value === null) {
        return '和棋'
      } else {
        return 'AI 赢了'
      }
    }

    if (isAiThinking.value) {
      return 'AI 思考中...'
    }

    return currentPlayer.value === playerColor.value ? '你的回合' : 'AI 思考中...'
  })

  /** 游戏状态文本 */
  const gameStatusText = computed(() => {
    if (isGameOver.value) {
      if (winner.value === playerColor.value) {
        return '恭喜你获胜！'
      } else if (winner.value === null) {
        return '平局'
      } else {
        return 'AI 获胜'
      }
    }
    return '游戏进行中'
  })

  /** 当前步数 */
  const moveCount = computed(() => moveHistory.value.length)

  /** 是否可以悔棋 */
  const canUndo = computed(
    () => !isGameOver.value && !isAiThinking.value && moveHistory.value.length >= 2
  )

  /** 最后落子位置 */
  const lastMove = computed(() => {
    if (moveHistory.value.length === 0) {
      return null
    }
    return moveHistory.value[moveHistory.value.length - 1]
  })

  return {
    // State
    board,
    currentPlayer,
    isGameOver,
    winner,
    moveHistory,
    gameMode,
    aiConfig,
    isAiThinking,
    playerColor,

    // Actions
    startGame,
    makeMove: makeMoveAction,
    aiMove,
    undoMove,
    resetGame,
    setDifficulty,
    setPlayerColor,

    // Getters
    currentPlayerText,
    gameStatusText,
    moveCount,
    canUndo,
    lastMove
  }
})
