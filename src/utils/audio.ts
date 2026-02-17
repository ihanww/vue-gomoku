/**
 * 音效系统
 * 管理游戏中的各种音效播放
 */

/** 音效类型 */
export type SoundType =
  | 'place' // 落子
  | 'win' // 胜利
  | 'lose' // 失败
  | 'draw' // 和棋
  | 'click' // UI 点击
  | 'undo' // 悔棋
  | 'start' // 开始游戏

/** 音效配置 */
const SOUND_CONFIGS: Record<SoundType, { path: string; volume: number }> = {
  place: { path: '/sounds/place.mp3', volume: 0.6 },
  win: { path: '/sounds/win.mp3', volume: 0.7 },
  lose: { path: '/sounds/lose.mp3', volume: 0.6 },
  draw: { path: '/sounds/draw.mp3', volume: 0.6 },
  click: { path: '/sounds/click.mp3', volume: 0.4 },
  undo: { path: '/sounds/undo.mp3', volume: 0.5 },
  start: { path: '/sounds/start.mp3', volume: 0.5 }
}

/** 音效设置 */
interface AudioSettings {
  enabled: boolean
  masterVolume: number
  musicVolume: number
  sfxVolume: number
}

const SETTINGS_STORAGE_KEY = 'gomoku_audio_settings'

/** 默认设置 */
const DEFAULT_SETTINGS: AudioSettings = {
  enabled: true,
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.7
}

/**
 * 音频管理器类
 */
class AudioManager {
  private audioCache: Map<SoundType, HTMLAudioElement> = new Map()
  private settings: AudioSettings = { ...DEFAULT_SETTINGS }
  private currentMusic: HTMLAudioElement | null = null

  constructor() {
    this.loadSettings()
    this.preloadSounds()
  }

  /**
   * 加载音效设置
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error)
    }
  }

  /**
   * 保存音效设置
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings))
    } catch (error) {
      console.error('Failed to save audio settings:', error)
    }
  }

  /**
   * 预加载音效文件
   */
  private preloadSounds(): void {
    for (const [type, config] of Object.entries(SOUND_CONFIGS)) {
      try {
        const audio = new Audio()
        audio.src = config.path
        audio.preload = 'auto'
        audio.volume = this.calculateVolume(config.volume)
        this.audioCache.set(type as SoundType, audio)
      } catch (error) {
        console.warn(`Failed to preload sound: ${type}`, error)
      }
    }
  }

  /**
   * 计算实际音量（考虑主音量和类型音量）
   */
  private calculateVolume(typeVolume: number): number {
    return this.settings.masterVolume * this.settings.sfxVolume * typeVolume
  }

  /**
   * 播放音效
   */
  play(type: SoundType): void {
    if (!this.settings.enabled) {
      return
    }

    const audio = this.audioCache.get(type)
    if (!audio) {
      console.warn(`Sound not found: ${type}`)
      return
    }

    try {
      // 重置播放时间，允许快速重复播放
      audio.currentTime = 0
      audio.volume = this.calculateVolume(SOUND_CONFIGS[type].volume)
      audio.play().catch((error) => {
        // 忽略用户交互限制导致的播放失败
        if (error.name !== 'NotAllowedError') {
          console.warn(`Failed to play sound: ${type}`, error)
        }
      })
    } catch (error) {
      console.warn(`Error playing sound: ${type}`, error)
    }
  }

  /**
   * 播放落子音效
   */
  playPlace(): void {
    this.play('place')
  }

  /**
   * 播放胜利音效
   */
  playWin(): void {
    this.play('win')
  }

  /**
   * 播放失败音效
   */
  playLose(): void {
    this.play('lose')
  }

  /**
   * 播放和棋音效
   */
  playDraw(): void {
    this.play('draw')
  }

  /**
   * 播放 UI 点击音效
   */
  playClick(): void {
    this.play('click')
  }

  /**
   * 播放悔棋音效
   */
  playUndo(): void {
    this.play('undo')
  }

  /**
   * 播放开始游戏音效
   */
  playStart(): void {
    this.play('start')
  }

  /**
   * 切换音效开关
   */
  toggleEnabled(): boolean {
    this.settings.enabled = !this.settings.enabled
    this.saveSettings()
    return this.settings.enabled
  }

  /**
   * 设置音效开关状态
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled
    this.saveSettings()
  }

  /**
   * 设置主音量
   */
  setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
    this.saveSettings()
  }

  /**
   * 设置音效音量
   */
  setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
    this.saveSettings()
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.currentMusic) {
      this.currentMusic.volume = this.settings.masterVolume * this.settings.musicVolume
    }
    this.saveSettings()
  }

  /**
   * 更新所有缓存的音频音量
   */
  private updateAllVolumes(): void {
    for (const [type, audio] of this.audioCache) {
      audio.volume = this.calculateVolume(SOUND_CONFIGS[type].volume)
    }
  }

  /**
   * 获取当前设置
   */
  getSettings(): Readonly<AudioSettings> {
    return { ...this.settings }
  }

  /**
   * 检查音效是否启用
   */
  isEnabled(): boolean {
    return this.settings.enabled
  }

  /**
   * 播放背景音乐（可选功能）
   */
  playMusic(url: string, loop = true): void {
    if (!this.settings.enabled) {
      return
    }

    try {
      this.stopMusic()
      this.currentMusic = new Audio(url)
      this.currentMusic.loop = loop
      this.currentMusic.volume = this.settings.masterVolume * this.settings.musicVolume
      this.currentMusic.play().catch((error) => {
        console.warn('Failed to play music:', error)
      })
    } catch (error) {
      console.warn('Error playing music:', error)
    }
  }

  /**
   * 停止背景音乐
   */
  stopMusic(): void {
    if (this.currentMusic) {
      try {
        this.currentMusic.pause()
        this.currentMusic.currentTime = 0
      } catch (error) {
        console.warn('Error stopping music:', error)
      }
      this.currentMusic = null
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseMusic(): void {
    if (this.currentMusic) {
      try {
        this.currentMusic.pause()
      } catch (error) {
        console.warn('Error pausing music:', error)
      }
    }
  }

  /**
   * 恢复背景音乐
   */
  resumeMusic(): void {
    if (this.currentMusic && this.settings.enabled) {
      try {
        this.currentMusic.play().catch((error) => {
          console.warn('Failed to resume music:', error)
        })
      } catch (error) {
        console.warn('Error resuming music:', error)
      }
    }
  }
}

/** 单例实例 */
let audioManagerInstance: AudioManager | null = null

/**
 * 获取音频管理器实例
 */
export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}

/**
 * 便捷函数：播放落子音效
 */
export function playPlaceSound(): void {
  getAudioManager().playPlace()
}

/**
 * 便捷函数：播放胜利音效
 */
export function playWinSound(): void {
  getAudioManager().playWin()
}

/**
 * 便捷函数：播放失败音效
 */
export function playLoseSound(): void {
  getAudioManager().playLose()
}

/**
 * 便捷函数：播放和棋音效
 */
export function playDrawSound(): void {
  getAudioManager().playDraw()
}

/**
 * 便捷函数：播放点击音效
 */
export function playClickSound(): void {
  getAudioManager().playClick()
}

/**
 * 便捷函数：播放悔棋音效
 */
export function playUndoSound(): void {
  getAudioManager().playUndo()
}

/**
 * 便捷函数：播放开始游戏音效
 */
export function playStartSound(): void {
  getAudioManager().playStart()
}

/**
 * 便捷函数：切换音效开关
 */
export function toggleSoundEnabled(): boolean {
  return getAudioManager().toggleEnabled()
}

/**
 * 便捷函数：检查音效是否启用
 */
export function isSoundEnabled(): boolean {
  return getAudioManager().isEnabled()
}

export type { AudioSettings }
export { AudioManager }
