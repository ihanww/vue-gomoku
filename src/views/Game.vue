<script setup lang="ts">
/**
 * 游戏主页面
 * 整合棋盘和控制面板
 */

import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useHistoryStore } from '@/stores/history'
import { useStatsStore } from '@/stores/stats'
import Board from '@/components/Board.vue'
import GameControls from '@/components/GameControls.vue'
import { useRouter } from 'vue-router'

const game = useGameStore()
const history = useHistoryStore()
const stats = useStatsStore()
const router = useRouter()

// 初始化
onMounted(() => {
  // 加载历史数据和统计数据
  history.loadFromStorage()
  stats.loadFromStorage()

  // 开始新游戏
  game.startGame()
})

// 游戏结束时保存记录
function onGameOver() {
  if (game.isGameOver) {
    // 记录统计数据
    const result = game.winner === game.playerColor ? 'win' : game.winner === null ? 'draw' : 'lose'

    if (result === 'win') {
      stats.recordWin(game.aiConfig.difficulty, game.moveCount, 0)
    } else if (result === 'lose') {
      stats.recordLoss()
    } else {
      stats.recordDraw()
    }

    // 保存到历史记录
    history.saveGame({
      result,
      difficulty: game.aiConfig.difficulty,
      moves: game.moveHistory,
      duration: 0, // TODO: 添加计时功能
    })
  }
}

// 监听游戏结束
import { watch } from 'vue'
watch(
  () => game.isGameOver,
  (isOver) => {
    if (isOver) {
      onGameOver()
    }
  },
)

// 导航到排行榜
function goToLeaderboard() {
  router.push('/leaderboard')
}
</script>

<template>
  <div class="game-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">五子棋</h1>
      <button class="nav-link" @click="goToLeaderboard">📊 排行榜</button>
    </header>

    <!-- 主内容区 -->
    <main class="game-main">
      <!-- 棋盘区域 -->
      <div class="board-area">
        <Board />
      </div>

      <!-- 控制面板 -->
      <div class="controls-area">
        <GameControls />
      </div>
    </main>
  </div>
</template>

<style scoped>
.game-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
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
.game-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.board-area {
  display: flex;
  justify-content: center;
}

.controls-area {
  width: 100%;
  max-width: 320px;
}

/* 响应式布局 */
@media (min-width: 768px) {
  .game-main {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 40px;
  }

  .controls-area {
    flex-shrink: 0;
  }
}
</style>
