<script setup lang="ts">
/**
 * 游戏历史记录组件
 * 显示历史对局列表，支持查看详情、删除记录
 */

import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import type { GameHistory } from '@/types/game'

const history = useHistoryStore()

/** 历史记录按日期分组 */
const groupedHistories = computed(() => {
  const groups: Record<string, GameHistory[]> = {}

  for (const item of history.histories) {
    const date = new Date(item.date).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  }

  return groups
})

/** 排序后的日期列表 */
const sortedDates = computed(() => {
  return Object.keys(groupedHistories.value).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })
})

/** 结果文本 */
function getResultText(result: string): string {
  switch (result) {
    case 'win':
      return '胜利'
    case 'lose':
      return '失败'
    case 'draw':
      return '和棋'
    default:
      return ''
  }
}

/** 结果样式类 */
function getResultClass(result: string): string {
  switch (result) {
    case 'win':
      return 'result-win'
    case 'lose':
      return 'result-lose'
    case 'draw':
      return 'result-draw'
    default:
      return ''
  }
}

/** 难度文本 */
function getDifficultyText(difficulty: string): string {
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

/** 格式化时长 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

/** 格式化时间 */
function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString()
  }
}

/** 删除单条记录 */
function handleDelete(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    history.deleteHistory(id)
  }
}

/** 清空所有记录 */
function handleClearAll() {
  if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
    history.clearAll()
  }
}

/** 导出记录 */
function handleExport() {
  const data = history.exportHistory('text')
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gomoku-history-${Date.now()}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="game-history">
    <!-- 头部 -->
    <div class="history-header">
      <h3 class="history-title">对局历史</h3>
      <div class="header-actions">
        <button v-if="history.histories.length > 0" class="btn-icon" title="导出" @click="handleExport">
          📥
        </button>
        <button
          v-if="history.histories.length > 0"
          class="btn-icon btn-danger"
          title="清空"
          @click="handleClearAll"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="history.histories.length === 0" class="empty-state">
      <div class="empty-icon">📜</div>
      <p class="empty-text">暂无历史记录</p>
      <p class="empty-hint">完成对局后，记录将显示在这里</p>
    </div>

    <!-- 历史记录列表 -->
    <div v-else class="history-list">
      <div v-for="date in sortedDates" :key="date" class="history-group">
        <div class="group-header">{{ date }}</div>
        <div class="group-items">
          <div
            v-for="item in groupedHistories[date]"
            :key="item.id"
            class="history-item"
            :class="getResultClass(item.result)"
          >
            <div class="item-main">
              <div class="item-result">{{ getResultText(item.result) }}</div>
              <div class="item-info">
                <span class="item-opponent">{{ item.opponent }}</span>
                <span class="item-moves">{{ item.totalMoves }} 步</span>
                <span v-if="item.duration > 0" class="item-duration">{{ formatDuration(item.duration) }}</span>
              </div>
            </div>
            <div class="item-meta">
              <span class="item-time">{{ formatTime(item.date) }}</span>
              <span class="item-difficulty">{{ getDifficultyText(item.difficulty) }}</span>
            </div>
            <div class="item-actions">
              <button class="btn-icon-small" title="删除" @click="handleDelete(item.id)">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  min-width: 280px;
  max-height: 500px;
  overflow: hidden;
}

/* 头部 */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.history-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 6px;
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
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
}

.btn-icon.btn-danger:hover {
  background-color: #fee;
  border-color: #fcc;
  color: #c00;
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

/* 历史列表 */
.history-list {
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}

.history-group {
  margin-bottom: 12px;
}

.group-header {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #999;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 历史项 */
.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background-color: #fff;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.history-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.history-item.result-win {
  border-left-color: #4caf50;
}

.history-item.result-lose {
  border-left-color: #f44336;
}

.history-item.result-draw {
  border-left-color: #ff9800;
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-result {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.result-win .item-result {
  color: #4caf50;
}

.result-lose .item-result {
  color: #f44336;
}

.result-draw .item-result {
  color: #ff9800;
}

.item-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.item-opponent {
  font-weight: 500;
}

.item-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.item-time {
  font-size: 11px;
  color: #999;
}

.item-difficulty {
  font-size: 11px;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  color: #666;
}

.item-actions {
  flex-shrink: 0;
}

.btn-icon-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 18px;
  color: #999;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-small:hover {
  background-color: #fee;
  color: #c00;
}

/* 响应式 */
@media (max-width: 640px) {
  .game-history {
    padding: 16px;
    min-width: auto;
    max-height: 400px;
  }

  .history-title {
    font-size: 14px;
  }

  .history-item {
    padding: 8px 10px;
  }

  .item-info {
    gap: 6px;
  }
}
</style>
