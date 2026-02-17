<script setup lang="ts">
/**
 * 游戏复盘组件
 * 提供对局回放功能，支持手动步进和自动播放
 */

import { computed, ref, watch, onUnmounted } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { createEmptyBoard } from '@/utils/game'
import type { BoardType } from '@/types/game'
import Cell from './Cell.vue'

const history = useHistoryStore()

/** 自动播放速度选项 */
const playbackSpeeds = [
  { value: 2000, label: '慢速' },
  { value: 1000, label: '正常' },
  { value: 500, label: '快速' },
]

/** 当前播放速度 */
const currentSpeed = ref(1000)

/** 是否显示棋盘 */
const showBoard = computed(() => history.replayBoard !== null)

/** 当前游戏信息 */
const currentGame = computed(() => history.replayState.currentGame)

/** 当前步数 */
const currentStep = computed(() => history.replayState.currentStep)

/** 总步数 */
const totalSteps = computed(() => currentGame.value?.totalMoves ?? 0)

/** 是否正在播放 */
const isPlaying = computed(() => history.replayState.isPlaying)

/** 是否在开始 */
const isAtStart = computed(() => history.isReplayAtStart)

/** 是否在末尾 */
const isAtEnd = computed(() => history.isReplayAtEnd)

/** 进度百分比 */
const progressPercent = computed(() => {
  if (totalSteps.value === 0) return 0
  return (currentStep.value / totalSteps.value) * 100
})

/** 落子列表文本 */
const movesText = computed(() => {
  if (!currentGame.value) return []
  return currentGame.value.moves.map((move, index) => {
    const colLabel = String.fromCharCode(65 + move.col)
    const rowLabel = move.row + 1
    const player = move.player === 'black' ? '黑' : '白'
    return `${index + 1}. ${player}${colLabel}${rowLabel}`
  })
})

/** 当前高亮的落子 */
const highlightedMove = computed(() => {
  if (currentStep.value === 0 || !currentGame.value) return null
  return currentGame.value.moves[currentStep.value - 1]
})

/** 检查是否为最后落子位置 */
function isLastMove(row: number, col: number): boolean {
  return highlightedMove.value?.row === row && highlightedMove.value?.col === col
}

/** 跳转到指定步数 */
function handleSeek(step: number) {
  history.replayStep(step)
}

/** 拖动进度条 */
function handleProgressChange(event: Event) {
  const input = event.target as HTMLInputElement
  const step = parseInt(input.value)
  history.replayStep(step)
}

/** 首步 */
function goFirst() {
  history.replayFirst()
}

/** 上一步 */
function goPrev() {
  history.replayPrev()
}

/** 下一步 */
function goNext() {
  history.replayNext()
}

/** 末步 */
function goLast() {
  history.replayLast()
}

/** 切换播放/暂停 */
function togglePlay() {
  if (isPlaying.value) {
    history.stopAutoPlay()
  } else {
    history.startAutoPlay(currentSpeed.value)
  }
}

/** 退出复盘 */
function exitReplay() {
  history.exitReplay()
}

/** 监听播放速度变化 */
watch(currentSpeed, (newSpeed) => {
  if (isPlaying.value) {
    history.stopAutoPlay()
    history.startAutoPlay(newSpeed)
  }
})

/** 组件卸载时停止播放 */
onUnmounted(() => {
  history.stopAutoPlay()
})
</script>

<template>
  <div class="game-replay">
    <!-- 棋盘区域 -->
    <div v-if="showBoard && history.replayBoard" class="replay-board">
      <div class="board-header">
        <h3>对局复盘</h3>
        <button class="btn-close" @click="exitReplay">✕</button>
      </div>

      <!-- 棋盘 -->
      <div class="board-container">
        <!-- 列标签 -->
        <div class="column-labels">
          <span v-for="label in 'ABCDEFGHIJKLMNO'.split('')" :key="label" class="label">{{
            label
          }}</span>
        </div>

        <div class="board-wrapper">
          <!-- 行标签 -->
          <div class="row-labels">
            <span v-for="i in 15" :key="i" class="label">{{ i }}</span>
          </div>

          <!-- 棋盘 -->
          <div class="board">
            <div v-for="row in 15" :key="row" class="board-row">
              <Cell
                v-for="col in 15"
                :key="col"
                :row="row - 1"
                :col="col - 1"
                :cell-type="history.replayBoard[row - 1]?.[col - 1] ?? 'empty'"
                :is-last-move="isLastMove(row - 1, col - 1)"
                :clickable="false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-bar">
          <input
            type="range"
            min="0"
            :max="totalSteps"
            :value="currentStep"
            class="progress-input"
            @input="handleProgressChange"
          />
          <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
        <div class="progress-text">{{ currentStep }} / {{ totalSteps }}</div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-section">
        <div class="playback-controls">
          <button class="btn-control" :disabled="isAtStart" @click="goFirst" title="首步">
            ⏮
          </button>
          <button class="btn-control" :disabled="isAtStart" @click="goPrev" title="上一步">
            ◀
          </button>
          <button
            class="btn-control btn-play"
            @click="togglePlay"
            :title="isPlaying ? '暂停' : '播放'"
          >
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="btn-control" :disabled="isAtEnd" @click="goNext" title="下一步">▶</button>
          <button class="btn-control" :disabled="isAtEnd" @click="goLast" title="末步">⏭</button>
        </div>

        <!-- 播放速度 -->
        <div class="speed-controls">
          <button
            v-for="speed in playbackSpeeds"
            :key="speed.value"
            class="btn-speed"
            :class="{ active: currentSpeed === speed.value }"
            @click="currentSpeed = speed.value"
          >
            {{ speed.label }}
          </button>
        </div>
      </div>

      <!-- 游戏信息 -->
      <div v-if="currentGame" class="game-info">
        <div class="info-row">
          <span class="info-label">结果：</span>
          <span class="info-value" :class="'result-' + currentGame.result">
            {{
              currentGame.result === 'win'
                ? '胜利'
                : currentGame.result === 'lose'
                  ? '失败'
                  : '和棋'
            }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">难度：</span>
          <span class="info-value">
            {{
              currentGame.difficulty === 'easy'
                ? '简单'
                : currentGame.difficulty === 'medium'
                  ? '中等'
                  : '困难'
            }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">日期：</span>
          <span class="info-value">{{ new Date(currentGame.date).toLocaleString() }}</span>
        </div>
      </div>

      <!-- 落子记录 -->
      <div class="moves-list">
        <div class="moves-header">落子记录</div>
        <div class="moves-content">
          <div
            v-for="(text, index) in movesText"
            :key="index"
            class="move-item"
            :class="{ active: index === currentStep - 1 }"
            @click="handleSeek(index + 1)"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-replay">
      <div class="empty-icon">🎬</div>
      <p class="empty-text">请选择一局对局进行复盘</p>
    </div>
  </div>
</template>

<style scoped>
.game-replay {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  min-width: 320px;
}

/* 棋盘区域 */
.replay-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 18px;
  color: #666;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #e0e0e0;
}

/* 棋盘容器 */
.board-container {
  align-self: center;
}

.column-labels {
  display: flex;
  justify-content: space-around;
  margin-left: 30px;
  margin-bottom: 4px;
  padding-right: 4px;
}

.column-labels .label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  font-size: 14px;
  font-weight: 500;
  color: #a08020;
  opacity: 0.7;
}

.board-wrapper {
  display: flex;
}

.row-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 4px;
}

.row-labels .label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #a08020;
  opacity: 0.7;
}

.board {
  display: grid;
  grid-template-rows: repeat(15, 48px);
  gap: 0;
  background-color: #e8c47a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.board-row {
  display: grid;
  grid-template-columns: repeat(15, 48px);
  gap: 0;
}

/* 进度条 */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  position: relative;
  flex: 1;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background-color: #1976d2;
  transition: width 0.1s;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 60px;
  text-align: right;
}

/* 控制按钮 */
.control-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playback-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-control:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.btn-control:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-play {
  width: 48px;
  font-size: 18px;
  background-color: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.btn-play:hover:not(:disabled) {
  background-color: #1565c0;
}

.speed-controls {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.btn-speed {
  padding: 6px 12px;
  font-size: 12px;
  color: #666;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-speed:hover {
  background-color: #f0f0f0;
}

.btn-speed.active {
  background-color: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

/* 游戏信息 */
.game-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
}

.info-row {
  display: flex;
  gap: 6px;
  font-size: 13px;
}

.info-label {
  color: #999;
}

.info-value {
  font-weight: 500;
  color: #333;
}

.info-value.result-win {
  color: #4caf50;
}

.info-value.result-lose {
  color: #f44336;
}

.info-value.result-draw {
  color: #ff9800;
}

/* 落子记录 */
.moves-list {
  max-height: 200px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 6px;
}

.moves-header {
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
}

.moves-content {
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.moves-content::-webkit-scrollbar {
  width: 4px;
}

.moves-content::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.move-item {
  padding: 4px 8px;
  font-size: 11px;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.move-item:hover {
  background-color: #e0e0e0;
}

.move-item.active {
  background-color: #1976d2;
  color: #fff;
}

/* 空状态 */
.empty-replay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 响应式 */
@media (max-width: 640px) {
  .game-replay {
    padding: 16px;
    min-width: auto;
  }

  .board {
    grid-template-rows: repeat(15, 36px);
  }

  .board-row {
    grid-template-columns: repeat(15, 36px);
  }

  .column-labels .label {
    width: 36px;
    font-size: 11px;
  }

  .row-labels .label {
    height: 36px;
    width: 16px;
    font-size: 11px;
  }
}
</style>
