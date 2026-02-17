<script setup lang="ts">
/**
 * 游戏控制面板组件
 * 提供新游戏、悔棋、难度选择等功能
 */

import { useGameStore } from '@/stores/game'
import type { Difficulty, Player } from '@/types/game'

const game = useGameStore()

/** 开始新游戏 */
function handleNewGame() {
  if (game.moveCount > 0 && !game.isGameOver) {
    if (confirm('当前游戏正在进行中，确定要重新开始吗？')) {
      game.startGame()
    }
  } else {
    game.startGame()
  }
}

/** 悔棋 */
function handleUndo() {
  game.undoMove()
}

/** 难度选项 */
const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
]

/** 执棋选项 */
const playerColorOptions: { value: Exclude<Player, null>; label: string }[] = [
  { value: 'black', label: '执黑（先手）' },
  { value: 'white', label: '执白（后手）' }
]

/** 设置难度 */
function setDifficulty(difficulty: Difficulty) {
  game.setDifficulty(difficulty)
}

/** 设置执棋颜色 */
function setPlayerColor(color: Player) {
  if (game.moveCount > 0 && !game.isGameOver) {
    if (confirm('切换执棋颜色将重新开始游戏，确定吗？')) {
      game.setPlayerColor(color)
      game.startGame()
    }
  } else {
    game.setPlayerColor(color)
  }
}
</script>

<template>
  <div class="game-controls">
    <!-- 游戏状态显示 -->
    <div class="status-panel" :class="{ 'status-win': game.winner === game.playerColor, 'status-lose': game.winner && game.winner !== game.playerColor }">
      <div class="status-text" :class="{ 'status-gameover': game.isGameOver }">
        {{ game.currentPlayerText }}
      </div>
      <Transition name="result" appear>
        <div v-if="game.isGameOver" class="result-text">{{ game.gameStatusText }}</div>
        <div v-else class="move-count">第 {{ game.moveCount }} 步</div>
      </Transition>
    </div>

    <!-- 控制按钮 -->
    <div class="control-buttons">
      <button class="btn btn-primary" @click="handleNewGame">
        <span class="btn-icon">🔄</span>
        新游戏
      </button>
      <button
        class="btn"
        :class="{ 'btn-disabled': !game.canUndo }"
        :disabled="!game.canUndo"
        @click="handleUndo"
      >
        <span class="btn-icon">↩️</span>
        悔棋
      </button>
    </div>

    <!-- 难度选择 -->
    <div class="setting-group">
      <label class="setting-label">难度</label>
      <div class="button-group">
        <button
          v-for="option in difficultyOptions"
          :key="option.value"
          class="btn-sm"
          :class="{ 'btn-active': game.aiConfig.difficulty === option.value }"
          :disabled="game.moveCount > 0 && !game.isGameOver"
          @click="setDifficulty(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 执棋选择 -->
    <div class="setting-group">
      <label class="setting-label">执棋</label>
      <div class="button-group">
        <button
          v-for="option in playerColorOptions"
          :key="option.value"
          class="btn-sm"
          :class="{ 'btn-active': game.playerColor === option.value }"
          @click="setPlayerColor(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- AI 思考指示器 -->
    <div v-if="game.isAiThinking" class="ai-thinking">
      <div class="spinner" />
      <span>AI 思考中...</span>
    </div>
  </div>
</template>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  min-width: 280px;
}

/* 状态面板 */
.status-panel {
  text-align: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s;
}

.status-text.status-gameover {
  color: #1976d2;
}

.result-text {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.move-count {
  margin-top: 8px;
  font-size: 14px;
  color: #999;
}

/* 控制按钮 */
.control-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover:not(.btn-disabled) {
  background-color: #f0f0f0;
  border-color: #ccc;
}

.btn:active:not(.btn-disabled) {
  transform: translateY(1px);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.btn-primary:hover {
  background-color: #1565c0;
  border-color: #1565c0;
}

.btn-icon {
  font-size: 16px;
}

/* 设置组 */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.button-group {
  display: flex;
  gap: 4px;
}

.btn-sm {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.btn-sm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-active {
  background-color: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.btn-active:hover:not(:disabled) {
  background-color: #1565c0;
}

/* AI 思考指示器 */
.ai-thinking {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
}

.ai-thinking span {
  font-size: 14px;
  color: #856404;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffc107;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 胜利/失败面板动画 */
.status-panel {
  transition: all 0.3s;
}

.status-panel.status-win {
  background-color: #e8f5e9;
  border: 2px solid #4caf50;
}

.status-panel.status-lose {
  background-color: #ffebee;
  border: 2px solid #f44336;
}

/* 结果消息动画 */
.result-enter-active {
  animation: resultSlide 0.4s ease-out;
}

@keyframes resultSlide {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 640px) {
  .game-controls {
    padding: 16px;
    min-width: auto;
  }

  .status-text {
    font-size: 16px;
  }

  .result-text {
    font-size: 14px;
  }

  .control-buttons {
    flex-direction: column;
  }

  .btn {
    padding: 12px;
  }
}
</style>
