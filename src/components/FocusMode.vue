<template>
  <div class="focus-mode">
    <div class="focus-container">
      <button class="close-btn" @click="handleClose">×</button>
      <div class="timer">
        <span class="time">{{ formatTime(minutes) }}</span>
        <span class="separator">:</span>
        <span class="time">{{ formatTime(seconds) }}</span>
      </div>

      <div class="controls" v-if="!isRunning">
        <div class="time-presets">
          <button 
            v-for="preset in presets" 
            :key="preset"
            @click="setDuration(preset)"
            :class="{ active: duration === preset }"
            class="preset-btn"
          >
            {{ preset }}分钟
          </button>
        </div>
        <button @click="startTimer" class="start-btn">开始专注</button>
      </div>
      
      <div class="controls" v-else>
        <button @click="pauseTimer" class="control-btn" v-if="!isPaused">暂停</button>
        <button @click="resumeTimer" class="control-btn" v-else>继续</button>
        <button @click="stopTimer" class="control-btn stop">结束</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FocusMode',
  setup() {
    const router = useRouter()
    const isPaused = ref(false)
    const isRunning = ref(false)
    const duration = ref(30)
    const minutes = ref(duration.value)
    const seconds = ref(0)
    const timer = ref(null)
    const presets = [15, 25, 30, 45, 60]

    const handleClose = () => {
      if (timer.value) {
        clearInterval(timer.value)
      }
      router.push('/')
    }

    const formatTime = (time) => {
      return time.toString().padStart(2, '0')
    }

    const setDuration = (mins) => {
      duration.value = mins
      minutes.value = mins
      seconds.value = 0
    }

    const startTimer = () => {
      isRunning.value = true
      isPaused.value = false
      minutes.value = duration.value
      seconds.value = 0
      
      timer.value = setInterval(() => {
        if (seconds.value > 0) {
          seconds.value--
        } else if (minutes.value > 0) {
          minutes.value--
          seconds.value = 59
        } else {
          stopTimer()
          playAlarm()
          showNotification()
        }
      }, 1000)
    }

    const pauseTimer = () => {
      isPaused.value = true
      clearInterval(timer.value)
    }

    const resumeTimer = () => {
      isPaused.value = false
      timer.value = setInterval(() => {
        if (seconds.value > 0) {
          seconds.value--
        } else if (minutes.value > 0) {
          minutes.value--
          seconds.value = 59
        } else {
          stopTimer()
          playAlarm()
          showNotification()
        }
      }, 1000)
    }

    const stopTimer = () => {
      isRunning.value = false
      isPaused.value = false
      clearInterval(timer.value)
      minutes.value = duration.value
      seconds.value = 0
    }

    const playAlarm = () => {
      const audio = new Audio('data:audio/wav;base64,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')
      audio.play()
    }

    const showNotification = () => {
      if (Notification.permission === 'granted') {
        new Notification('专注时间结束', {
          body: '休息一下吧！',
          icon: '🎯'
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('专注时间结束', {
              body: '休息一下吧！',
              icon: '🎯'
            })
          }
        })
      }
    }

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })

    return {
      isPaused,
      isRunning,
      minutes,
      seconds,
      duration,
      presets,
      formatTime,
      setDuration,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      handleClose
    }
  }
}
</script>

<style scoped>
.focus-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.focus-container {
  text-align: center;
  position: relative;
}

.timer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 8rem;
  font-weight: 300;
  color: #ffffff;
}

.time {
  min-width: 160px;
  text-align: center;
}

.separator {
  color: #ffffff;
  animation: blink 1s infinite;
  font-weight: 200;
  position: relative;
  top: -0.5rem;
}

.controls {
  margin-top: 2rem;
}

.time-presets {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.preset-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover,
.preset-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.start-btn,
.control-btn {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  background: #6b46c1;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.start-btn:hover,
.control-btn:hover {
  background: #553c9a;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.2);
}

.control-btn {
  margin: 0 0.75rem;
  min-width: 120px;
}

.control-btn.stop {
  background: #e53e3e;
}

.control-btn.stop:hover {
  background: #c53030;
}

.close-btn {
  position: absolute;
  top: -4rem;
  right: -4rem;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .timer {
    font-size: 4rem;
    gap: 0.5rem;
  }

  .time {
    min-width: 100px;
  }

  .close-btn {
    top: -3rem;
    right: -1rem;
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }

  .preset-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style> 