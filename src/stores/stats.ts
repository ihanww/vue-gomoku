/**
 * 玩家统计数据 Store
 * 管理游戏统计和排行榜数据
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayerStats, BestScore, Difficulty } from '@/types/game'

const STATS_STORAGE_KEY = 'gomoku_stats'

export const useStatsStore = defineStore('stats', () => {
  // ===== State =====

  /** 统计数据 */
  const stats = ref<PlayerStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    bestScores: {
      easy: null,
      medium: null,
      hard: null
    }
  })

  // ===== Actions =====

  /**
   * 从 Local Storage 加载统计数据
   */
  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STATS_STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        stats.value = {
          wins: parsed.wins || 0,
          losses: parsed.losses || 0,
          draws: parsed.draws || 0,
          bestScores: {
            easy: parsed.bestScores?.easy || null,
            medium: parsed.bestScores?.medium || null,
            hard: parsed.bestScores?.hard || null
          }
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  /**
   * 保存到 Local Storage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats.value))
    } catch (error) {
      console.error('Failed to save stats:', error)
    }
  }

  /**
   * 记录胜利
   */
  function recordWin(difficulty: Difficulty, moves: number, duration: number) {
    stats.value.wins++

    // 更新最佳成绩
    updateBestScore(difficulty, moves, duration)

    saveToStorage()
  }

  /**
   * 记录失败
   */
  function recordLoss() {
    stats.value.losses++
    saveToStorage()
  }

  /**
   * 记录和棋
   */
  function recordDraw() {
    stats.value.draws++
    saveToStorage()
  }

  /**
   * 更新最佳成绩
   */
  function updateBestScore(difficulty: Difficulty, moves: number, duration: number) {
    const current = stats.value.bestScores[difficulty]

    // 如果没有记录，或者创造了新纪录
    if (!current || moves < current.minMoves || (moves === current.minMoves && duration < current.bestTime)) {
      stats.value.bestScores[difficulty] = {
        difficulty,
        minMoves: moves,
        bestTime: duration,
        date: new Date().toISOString()
      }
    }
  }

  /**
   * 重置统计数据
   */
  function resetStats() {
    stats.value = {
      wins: 0,
      losses: 0,
      draws: 0,
      bestScores: {
        easy: null,
        medium: null,
        hard: null
      }
    }
    saveToStorage()
  }

  /**
   * 导出统计数据
   */
  function exportStats(format: 'json' | 'csv' = 'json') {
    if (format === 'json') {
      return JSON.stringify(stats.value, null, 2)
    }

    // CSV 格式
    const lines = [
      '项目,数值',
      `胜利,${stats.value.wins}`,
      `失败,${stats.value.losses}`,
      `和棋,${stats.value.draws}`,
      `总局数,${totalGames.value}`,
      `胜率,${winRate.value.toFixed(1)}%`,
      '',
      '难度,最少步数,最佳用时,日期'
    ]

    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      const score = stats.value.bestScores[difficulty]
      if (score) {
        lines.push(
          `${difficulty},${score.minMoves},${Math.floor(score.bestTime / 60)}:${(score.bestTime % 60).toString().padStart(2, '0')},${new Date(score.date).toLocaleDateString()}`
        )
      }
    }

    return lines.join('\n')
  }

  // ===== Getters =====

  /** 总游戏数 */
  const totalGames = computed(() => stats.value.wins + stats.value.losses + stats.value.draws)

  /** 胜率 */
  const winRate = computed(() => {
    if (totalGames.value === 0) {
      return 0
    }
    return (stats.value.wins / (stats.value.wins + stats.value.losses)) * 100
  })

  /** 当前连胜（简单实现，可以扩展） */
  const currentWinStreak = computed(() => {
    // 这里需要额外的历史数据来计算，暂时返回 0
    return 0
  })

  /** 最佳成绩列表（非空） */
  const bestScoresList = computed(() => {
    return Object.entries(stats.value.bestScores)
      .filter(([_, score]) => score !== null)
      .map(([difficulty, score]) => ({
        difficulty: difficulty as Difficulty,
        minMoves: score!.minMoves,
        bestTime: score!.bestTime,
        date: score!.date
      }))
      .sort((a, b) => {
        // 按难度排序
        const order = { hard: 0, medium: 1, easy: 2 }
        return order[a.difficulty] - order[b.difficulty]
      })
  })

  /** 是否有任何统计数据 */
  const hasStats = computed(() => totalGames.value > 0)

  return {
    // State
    stats,

    // Actions
    loadFromStorage,
    saveToStorage,
    recordWin,
    recordLoss,
    recordDraw,
    updateBestScore,
    resetStats,
    exportStats,

    // Getters
    totalGames,
    winRate,
    currentWinStreak,
    bestScoresList,
    hasStats
  }
})
