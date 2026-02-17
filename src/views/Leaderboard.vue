<script setup lang="ts">
/**
 * 排行榜页面
 * 显示玩家统计数据、最佳成绩和历史记录
 */

import { onMounted } from 'vue'
import { useStatsStore } from '@/stores/stats'
import { useHistoryStore } from '@/stores/history'
import { useRouter } from 'vue-router'

const stats = useStatsStore()
const history = useHistoryStore()
const router = useRouter()

// 页面初始化
onMounted(() => {
  stats.loadFromStorage()
  history.loadFromStorage()
})

/** 返回游戏 */
function goBack() {
  router.push('/')
}

/** 重置统计数据 */
function handleResetStats() {
  if (confirm('确定要重置所有统计数据吗？此操作不可撤销。')) {
    stats.resetStats()
  }
}

/** 导出数据 */
function handleExport(format: 'json' | 'csv') {
  const data = stats.exportStats(format)
  const mimeType = format === 'json' ? 'application/json' : 'text/csv'
  const extension = format === 'json' ? 'json' : 'csv'

  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gomoku-stats-${Date.now()}.${extension}`
  link.click()
  URL.revokeObjectURL(url)
}

/** 格式化时间 */
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

/** 格式化日期 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

/** 难度文本 */
function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return difficulty
  }
}
</script>

<template>
  <div class="leaderboard-page">
    <header class="page-header">
      <h1 class="page-title">📊 游戏统计</h1>
      <button class="nav-link" @click="goBack">← 返回游戏</button>
    </header>

    <main class="leaderboard-main">
      <!-- 统计数据卡片 -->
      <div class="stats-card">
        <div class="card-header">
          <h2>对局统计</h2>
          <button v-if="stats.hasStats" class="btn-icon" title="重置" @click="handleResetStats">
            🔄
          </button>
        </div>

        <div v-if="stats.hasStats" class="stats-grid">
          <div class="stat-item stat-win">
            <div class="stat-value">{{ stats.stats.wins }}</div>
            <div class="stat-label">胜利</div>
          </div>
          <div class="stat-item stat-lose">
            <div class="stat-value">{{ stats.stats.losses }}</div>
            <div class="stat-label">失败</div>
          </div>
          <div class="stat-item stat-draw">
            <div class="stat-value">{{ stats.stats.draws }}</div>
            <div class="stat-label">和棋</div>
          </div>
          <div class="stat-item stat-total">
            <div class="stat-value">{{ stats.totalGames }}</div>
            <div class="stat-label">总局数</div>
          </div>
          <div class="stat-item stat-rate">
            <div class="stat-value">{{ stats.winRate.toFixed(1) }}%</div>
            <div class="stat-label">胜率</div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📊</div>
          <p class="empty-text">暂无统计数据</p>
          <p class="empty-hint">完成对局后，统计数据将显示在这里</p>
        </div>
      </div>

      <!-- 最佳成绩卡片 -->
      <div class="stats-card">
        <div class="card-header">
          <h2>最佳成绩</h2>
        </div>

        <div v-if="stats.bestScoresList.length > 0" class="best-scores">
          <div
            v-for="score in stats.bestScoresList"
            :key="score.difficulty"
            class="best-score-item"
          >
            <div class="score-header">
              <span class="score-difficulty" :class="'difficulty-' + score.difficulty">
                {{ getDifficultyLabel(score.difficulty) }}
              </span>
            </div>
            <div class="score-stats">
              <div class="score-stat">
                <span class="stat-icon">⚡</span>
                <span class="stat-text">{{ score.minMoves }} 步</span>
              </div>
              <div class="score-stat">
                <span class="stat-icon">⏱</span>
                <span class="stat-text">{{ formatTime(score.bestTime) }}</span>
              </div>
              <div class="score-stat">
                <span class="stat-icon">📅</span>
                <span class="stat-text">{{ formatDate(score.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🏆</div>
          <p class="empty-text">暂无最佳成绩</p>
          <p class="empty-hint">赢得比赛后，最佳成绩将显示在这里</p>
        </div>
      </div>

      <!-- 导出数据 -->
      <div v-if="stats.hasStats" class="stats-card">
        <div class="card-header">
          <h2>数据管理</h2>
        </div>
        <div class="export-buttons">
          <button class="btn-export" @click="handleExport('json')">📄 导出 JSON</button>
          <button class="btn-export" @click="handleExport('csv')">📊 导出 CSV</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.leaderboard-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-link {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 主内容区 */
.leaderboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

/* 统计卡片 */
.stats-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 16px;
  color: #666;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #fee;
  border-color: #fcc;
  color: #c00;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-win .stat-value {
  color: #4caf50;
}

.stat-lose .stat-value {
  color: #f44336;
}

.stat-draw .stat-value {
  color: #ff9800;
}

.stat-total .stat-value {
  color: #2196f3;
}

.stat-rate .stat-value {
  color: #9c27b0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  margin: 0 0 4px;
  font-size: 14px;
  color: #666;
}

.empty-hint {
  margin: 0;
  font-size: 12px;
  color: #999;
}

/* 最佳成绩 */
.best-scores {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.best-score-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ddd;
}

.best-score-item:nth-child(1) {
  border-left-color: #f44336;
}

.best-score-item:nth-child(2) {
  border-left-color: #ff9800;
}

.best-score-item:nth-child(3) {
  border-left-color: #4caf50;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-difficulty {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
}

.difficulty-easy {
  background-color: #e8f5e9;
  color: #4caf50;
}

.difficulty-medium {
  background-color: #fff3e0;
  color: #ff9800;
}

.difficulty-hard {
  background-color: #ffebee;
  color: #f44336;
}

.score-stats {
  display: flex;
  gap: 16px;
}

.score-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.stat-icon {
  font-size: 14px;
}

/* 导出按钮 */
.export-buttons {
  display: flex;
  gap: 12px;
}

.btn-export {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #1976d2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-export:hover {
  background-color: #1565c0;
}

.btn-export:active {
  transform: translateY(1px);
}

/* 响应式 */
@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .nav-link {
    align-self: flex-end;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-card {
    padding: 16px;
  }

  .score-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
