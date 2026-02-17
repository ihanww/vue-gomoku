<script setup lang="ts">
/**
 * 棋盘组件
 * 渲染 15×15 五子棋棋盘
 */

import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import Cell from './Cell.vue'

const game = useGameStore()

/** 棋盘大小 */
const BOARD_SIZE = 15

/** 列号标签 (A-O) */
const columnLabels = 'ABCDEFGHIJKLMNO'.split('')

/** 行号是否可见 */
const showRowLabels = computed(() => true)

/** 列号是否可见 */
const showColumnLabels = computed(() => true)

/** 处理格子点击 */
function handleCellClick(row: number, col: number) {
  game.makeMove(row, col)
}

/** 检查是否为最后落子位置 */
function isLastMove(row: number, col: number) {
  return game.lastMove?.row === row && game.lastMove?.col === col
}

/** 格子是否可点击 */
function isCellClickable() {
  return !game.isGameOver && !game.isAiThinking
}
</script>

<template>
  <div class="board-container">
    <!-- 列标签 -->
    <div v-if="showColumnLabels" class="column-labels">
      <span v-for="label in columnLabels" :key="label" class="label">{{ label }}</span>
    </div>

    <div class="board-wrapper">
      <!-- 行标签 -->
      <div v-if="showRowLabels" class="row-labels">
        <span v-for="i in BOARD_SIZE" :key="i" class="label">{{ i }}</span>
      </div>

      <!-- 棋盘 -->
      <div class="board">
        <div v-for="row in BOARD_SIZE" :key="row" class="board-row">
          <Cell
            v-for="col in BOARD_SIZE"
            :key="col"
            :row="row - 1"
            :col="col - 1"
            :cell-type="(game.board[row - 1] ?? [])[col - 1] ?? 'empty'"
            :is-last-move="isLastMove(row - 1, col - 1)"
            :clickable="isCellClickable()"
            @click="handleCellClick"
          />
        </div>
      </div>
    </div>

    <!-- 天元点（中心点标记） -->
    <div class="star-points">
      <div class="star-point star-center" />
      <div class="star-point star-top-left" />
      <div class="star-point star-top-right" />
      <div class="star-point star-bottom-left" />
      <div class="star-point star-bottom-right" />
    </div>
  </div>
</template>

<style scoped>
.board-container {
  position: relative;
  display: inline-block;
  padding: 20px;
  background-color: #deb870;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 列标签 */
.column-labels {
  display: flex;
  justify-content: space-around;
  margin-left: 30px;
  margin-bottom: 8px;
  padding-right: 8px;
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

/* 棋盘包装器 */
.board-wrapper {
  display: flex;
}

/* 行标签 */
.row-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 8px;
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

/* 棋盘 */
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

/* 天元点（棋盘上的小圆点标记） - 简化 */
.star-points {
  position: absolute;
  top: 20px;
  left: 28px;
  pointer-events: none;
}

.star-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #a08020;
  border-radius: 50%;
  opacity: 0.5;
}

/* 中心天元点 */
.star-center {
  top: calc(50% + 10px);
  left: calc(50% + 10px);
  transform: translate(-50%, -50%);
}

/* 四个角的星位点 */
.star-top-left {
  top: calc(20px + 3 * 48px + 24px - 5px);
  left: calc(28px + 3 * 48px + 24px - 5px);
}

.star-top-right {
  top: calc(20px + 3 * 48px + 24px - 5px);
  left: calc(28px + 11 * 48px + 24px - 5px);
}

.star-bottom-left {
  top: calc(20px + 11 * 48px + 24px - 5px);
  left: calc(28px + 3 * 48px + 24px - 5px);
}

.star-bottom-right {
  top: calc(20px + 11 * 48px + 24px - 5px);
  left: calc(28px + 11 * 48px + 24px - 5px);
}

/* 响应式 */
@media (max-width: 640px) {
  .board-container {
    padding: 12px;
  }

  .column-labels {
    margin-left: 20px;
    margin-bottom: 4px;
  }

  .column-labels .label {
    width: 36px;
    font-size: 11px;
  }

  .row-labels {
    margin-right: 4px;
  }

  .row-labels .label {
    height: 36px;
    width: 16px;
    font-size: 11px;
  }

  .board {
    grid-template-rows: repeat(15, 36px);
  }

  .board-row {
    grid-template-columns: repeat(15, 36px);
  }

  /* 调整星位点位置 */
  .star-points {
    top: 12px;
    left: 20px;
  }

  .star-center {
    top: calc(50% + 6px);
    left: calc(50% + 6px);
  }

  .star-top-left {
    top: calc(12px + 3 * 36px + 18px - 4px);
    left: calc(20px + 3 * 36px + 18px - 4px);
  }

  .star-top-right {
    top: calc(12px + 3 * 36px + 18px - 4px);
    left: calc(20px + 11 * 36px + 18px - 4px);
  }

  .star-bottom-left {
    top: calc(12px + 11 * 36px + 18px - 4px);
    left: calc(20px + 3 * 36px + 18px - 4px);
  }

  .star-bottom-right {
    top: calc(12px + 11 * 36px + 18px - 4px);
    left: calc(20px + 11 * 36px + 18px - 4px);
  }

  .star-point {
    width: 6px;
    height: 6px;
  }
}
</style>
