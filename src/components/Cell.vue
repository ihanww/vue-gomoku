<script setup lang="ts">
/**
 * 棋盘格子组件
 * 显示单个棋盘格子（空白、黑子、白子）
 */

import { computed } from 'vue'

interface Props {
  /** 行号 */
  row: number
  /** 列号 */
  col: number
  /** 格子类型 */
  cellType: 'empty' | 'black' | 'white'
  /** 是否为最后落子位置 */
  isLastMove?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 是否为悔棋中的棋子（显示消失动画） */
  isUndoing?: boolean
  /** 是否在胜利连线上 */
  isWinLine?: boolean
}

interface Emits {
  (e: 'click', row: number, col: number): void
}

const props = withDefaults(defineProps<Props>(), {
  isLastMove: false,
  clickable: true,
  isUndoing: false,
  isWinLine: false,
})

const emit = defineEmits<Emits>()

/** 格子内容类名 */
const cellClass = computed(() => {
  const classes = ['cell']

  if (props.cellType !== 'empty') {
    classes.push(`cell-${props.cellType}`)
  }

  if (props.isLastMove) {
    classes.push('cell-last-move')
  }

  if (props.clickable && props.cellType === 'empty') {
    classes.push('cell-clickable')
  }

  if (props.isUndoing) {
    classes.push('cell-undoing')
  }

  if (props.isWinLine) {
    classes.push('cell-win-line')
  }

  return classes
})

/** 处理点击 */
function handleClick() {
  if (props.clickable && props.cellType === 'empty') {
    emit('click', props.row, props.col)
  }
}
</script>

<template>
  <div :class="cellClass" @click="handleClick">
    <!-- 棋子 -->
    <Transition name="undo">
      <span v-if="cellType !== 'empty'" class="stone" :class="`stone-${cellType}`">
        <!-- 最后落子标记 -->
        <span v-if="isLastMove" class="last-move-marker" />
      </span>
    </Transition>
    <!-- 胜利连线光晕效果 -->
    <span v-if="isWinLine && cellType !== 'empty'" class="win-glow" />
  </div>
</template>

<style scoped>
.cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #e8c47a;
  cursor: default;
  user-select: none;
}

.cell-clickable {
  cursor: pointer;
}

.cell-clickable:hover {
  background-color: #d4b066;
}

/* 棋盘线效果 - 简化细线 */
.cell::before,
.cell::after {
  position: absolute;
  z-index: 0;
  background-color: #a08020;
  content: '';
  opacity: 0.4;
}

.cell::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  transform: translateY(-50%);
}

.cell::after {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  transform: translateX(-50%);
}

/* 边缘格子处理 - 隐藏半个线 */
.cell[data-col='0']::before {
  left: 50%;
  width: 50%;
}

.cell[data-col='14']::before {
  width: 50%;
}

.cell[data-row='0']::after {
  top: 50%;
  height: 50%;
}

.cell[data-row='14']::after {
  height: 50%;
}

/* 黑子 */
.stone-black {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #555, #000);
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
}

/* 白子 */
.stone-white {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff, #ddd);
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

/* 最后落子标记 */
.last-move-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  height: 9px;
  background-color: #ff4444;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 落子动画 */
.stone {
  animation: stonePlace 0.2s ease-out;
}

@keyframes stonePlace {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 悔棋消失动画 */
.undo-enter-active,
.undo-leave-active {
  transition: all 0.3s ease;
}

.undo-enter-from {
  transform: scale(0);
  opacity: 0;
}

.undo-leave-to {
  transform: scale(0);
  opacity: 0;
}

/* 胜利连线光晕效果 */
.win-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: winPulse 1s ease-in-out infinite;
  pointer-events: none;
}

.cell-black .win-glow {
  box-shadow: 0 0 10px 3px rgba(0, 255, 0, 0.6);
}

.cell-white .win-glow {
  box-shadow: 0 0 10px 3px rgba(255, 215, 0, 0.6);
}

@keyframes winPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 1;
  }
}

/* 支持减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .stone,
  .undo-enter-active,
  .undo-leave-active,
  .win-glow {
    animation: none;
    transition: none;
  }
}

/* 响应式 */
@media (max-width: 640px) {
  .cell {
    width: 36px;
    height: 36px;
  }

  .stone-black,
  .stone-white {
    width: 30px;
    height: 30px;
  }

  .win-glow {
    width: 32px;
    height: 32px;
  }

  .last-move-marker {
    width: 7px;
    height: 7px;
  }
}
</style>
