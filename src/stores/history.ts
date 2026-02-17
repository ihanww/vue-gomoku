/**
 * 游戏历史记录 Store
 * 管理对局历史和复盘功能
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameHistory, ReplayState, Move, Player, Difficulty } from '@/types/game'

const HISTORY_STORAGE_KEY = 'gomoku_history'
const MAX_HISTORY_COUNT = 100

export const useHistoryStore = defineStore('history', () => {
  // ===== State =====

  /** 历史记录列表 */
  const histories = ref<GameHistory[]>([])

  /** 当前复盘状态 */
  const replayState = ref<ReplayState>({
    currentGame: null,
    currentStep: 0,
    isPlaying: false
  })

  /** 自动播放定时器 */
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null

  // ===== Actions =====

  /**
   * 从 Local Storage 加载历史记录
   */
  function loadFromStorage() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (data) {
        histories.value = JSON.parse(data)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
      histories.value = []
    }
  }

  /**
   * 保存到 Local Storage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(histories.value))
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }

  /**
   * 保存游戏记录
   */
  function saveGame(params: {
    result: 'win' | 'lose' | 'draw'
    difficulty: Difficulty
    moves: Move[]
    duration: number
  }) {
    const { result, difficulty, moves, duration } = params

    const history: GameHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      result,
      opponent: `AI (${difficulty})`,
      totalMoves: moves.length,
      difficulty,
      duration,
      moves: [...moves]
    }

    // 添加到开头
    histories.value.unshift(history)

    // 限制历史记录数量
    if (histories.value.length > MAX_HISTORY_COUNT) {
      histories.value = histories.value.slice(0, MAX_HISTORY_COUNT)
    }

    saveToStorage()
  }

  /**
   * 删除单个历史记录
   */
  function deleteHistory(id: string) {
    const index = histories.value.findIndex((h) => h.id === id)
    if (index !== -1) {
      histories.value.splice(index, 1)
      saveToStorage()
    }
  }

  /**
   * 清空所有历史记录
   */
  function clearAll() {
    histories.value = []
    saveToStorage()
  }

  /**
   * 开始复盘
   */
  function startReplay(historyId: string) {
    const history = histories.value.find((h) => h.id === historyId)
    if (history) {
      replayState.value = {
        currentGame: history,
        currentStep: 0,
        isPlaying: false
      }
      stopAutoPlay()
    }
  }

  /**
   * 退出复盘
   */
  function exitReplay() {
    stopAutoPlay()
    replayState.value = {
      currentGame: null,
      currentStep: 0,
      isPlaying: false
    }
  }

  /**
   * 复盘到指定步数
   */
  function replayStep(step: number) {
    if (!replayState.value.currentGame) {
      return
    }

    const maxStep = replayState.value.currentGame.totalMoves
    replayState.value.currentStep = Math.max(0, Math.min(step, maxStep))
  }

  /**
   * 复盘到第一步
   */
  function replayFirst() {
    replayStep(0)
  }

  /**
   * 复盘上一步
   */
  function replayPrev() {
    replayStep(replayState.value.currentStep - 1)
  }

  /**
   * 复盘下一步
   */
  function replayNext() {
    replayStep(replayState.value.currentStep + 1)
  }

  /**
   * 复盘到最后一步
   */
  function replayLast() {
    if (replayState.value.currentGame) {
      replayStep(replayState.value.currentGame.totalMoves)
    }
  }

  /**
   * 开始自动播放
   */
  function startAutoPlay(interval = 1000) {
    if (!replayState.value.currentGame) {
      return
    }

    stopAutoPlay()
    replayState.value.isPlaying = true

    autoPlayTimer = setInterval(() => {
      if (replayState.value.currentStep >= replayState.value.currentGame!.totalMoves) {
        stopAutoPlay()
      } else {
        replayNext()
      }
    }, interval)
  }

  /**
   * 停止自动播放
   */
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      autoPlayTimer = null
    }
    replayState.value.isPlaying = false
  }

  /**
   * 导出历史记录
   */
  function exportHistory(format: 'json' | 'text' = 'json') {
    if (format === 'json') {
      return JSON.stringify(histories.value, null, 2)
    }

    // 文本格式
    return histories.value
      .map(
        (h) => `
日期: ${new Date(h.date).toLocaleString()}
结果: ${h.result === 'win' ? '胜利' : h.result === 'lose' ? '失败' : '和棋'}
对手: ${h.opponent}
步数: ${h.totalMoves}
用时: ${Math.floor(h.duration / 60)}分${h.duration % 60}秒
`
      )
      .join('\n---\n')
  }

  /**
   * 导出单个对局
   */
  function exportGame(historyId: string, format: 'json' | 'sgf' = 'json') {
    const history = histories.value.find((h) => h.id === historyId)
    if (!history) {
      return null
    }

    if (format === 'json') {
      return JSON.stringify(history, null, 2)
    }

    // SGF 格式（简化版）
    const sgf = `(;GM[1]SZ[15]PB[Black]PW[White]
${history.moves.map((m) => `;${m.player === 'black' ? 'B' : 'W'}[${m.col},${m.row}]`).join('')}
)`
    return sgf
  }

  // ===== Getters =====

  /** 历史记录数量 */
  const historyCount = computed(() => histories.value.length)

  /** 是否正在复盘 */
  const isReplaying = computed(() => replayState.value.currentGame !== null)

  /** 当前复盘的棋盘状态 */
  const replayBoard = computed(() => {
    if (!replayState.value.currentGame) {
      return null
    }

    // 创建空棋盘
    const board: Array<Array<'empty' | 'black' | 'white'>> = Array.from({ length: 15 }, () =>
      Array(15).fill('empty')
    )

    // 应用到当前步的落子
    const { currentGame, currentStep } = replayState.value
    for (let i = 0; i < currentStep && i < currentGame.moves.length; i++) {
      const move = currentGame.moves[i]
      if (move && move.player) {
        const row = board[move.row]
        if (row) {
          row[move.col] = move.player
        }
      }
    }

    return board
  })

  /** 复盘是否已到最后 */
  const isReplayAtEnd = computed(() => {
    if (!replayState.value.currentGame) {
      return false
    }
    return replayState.value.currentStep >= replayState.value.currentGame.totalMoves
  })

  /** 复盘是否已到开始 */
  const isReplayAtStart = computed(() => replayState.value.currentStep === 0)

  return {
    // State
    histories,
    replayState,

    // Actions
    loadFromStorage,
    saveToStorage,
    saveGame,
    deleteHistory,
    clearAll,
    startReplay,
    exitReplay,
    replayStep,
    replayFirst,
    replayPrev,
    replayNext,
    replayLast,
    startAutoPlay,
    stopAutoPlay,
    exportHistory,
    exportGame,

    // Getters
    historyCount,
    isReplaying,
    replayBoard,
    isReplayAtEnd,
    isReplayAtStart
  }
})
