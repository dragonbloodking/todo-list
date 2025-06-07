<template>
  <div class="week-view">
    <div class="week-navigation">
      <button @click="previousWeek" class="nav-button">上一周</button>
      <span class="current-week">{{ formatDateRange() }}</span>
      <button @click="nextWeek" class="nav-button">下一周</button>
    </div>
    <div class="week-header">
      <div v-for="(day, index) in weekDays" :key="day" class="day-header">
        {{ day }}
        <div class="date">{{ formatDate(getDateOfDay(index)) }}</div>
      </div>
    </div>
    <div class="week-grid">
      <div v-for="(day, index) in weekDays" :key="day" class="day-column">
        <div class="day-content">
          <div v-for="todo in getDayTodos(index)" :key="todo.id" class="todo-item" :class="[
            getTodoQuadrantClass(todo.quadrant),
            { completed: todo.completed }
          ]">
            <div class="todo-time">
              {{ formatTime(todo.startTime) }} - {{ formatTime(todo.endTime) }}
            </div>
            <div class="todo-title">
              <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
              {{ todo.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'WeekView',
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { currentUser } = useAuth()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const currentWeekStart = ref(getStartOfWeek(new Date()))

    const userTodos = computed(() => {
      return props.todos.filter(todo => todo.userId === currentUser.value?.id)
    })

    function getStartOfWeek(date) {
      const d = new Date(date)
      const day = d.getDay()
      return new Date(d.setDate(d.getDate() - day))
    }

    function previousWeek() {
      const newDate = new Date(currentWeekStart.value)
      newDate.setDate(newDate.getDate() - 7)
      currentWeekStart.value = newDate
    }

    function nextWeek() {
      const newDate = new Date(currentWeekStart.value)
      newDate.setDate(newDate.getDate() + 7)
      currentWeekStart.value = newDate
    }

    function getDateOfDay(dayIndex) {
      const date = new Date(currentWeekStart.value)
      date.setDate(date.getDate() + dayIndex)
      return date
    }

    function formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }

    function formatDateRange() {
      const start = currentWeekStart.value
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
    }

    const getDayTodos = (dayIndex) => {
      const targetDate = getDateOfDay(dayIndex)
      return userTodos.value.filter(todo => {
        const todoDate = new Date(todo.startTime)
        return todoDate.getFullYear() === targetDate.getFullYear() &&
               todoDate.getMonth() === targetDate.getMonth() &&
               todoDate.getDate() === targetDate.getDate()
      }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getTagIcon = (tag) => {
      const icons = {
        'none': '📌',
        'life': '🏠',
        'shopping': '🛒',
        'travel': '✈️',
        'study': '📚',
        'exercise': '💪'
      }
      return icons[tag] || '📌'
    }

    const getTodoQuadrantClass = (quadrant) => {
      const classes = {
        1: 'important-urgent',
        2: 'important-not-urgent',
        3: 'not-important-urgent',
        4: 'not-important-not-urgent'
      }
      return classes[quadrant] || ''
    }

    return {
      weekDays,
      getDayTodos,
      formatTime,
      getTagIcon,
      getTodoQuadrantClass,
      previousWeek,
      nextWeek,
      formatDate,
      getDateOfDay,
      formatDateRange
    }
  }
}
</script>

<style scoped>
.week-view {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.nav-button {
  padding: 0.5rem 1rem;
  background: #6b46c1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-button:hover {
  background: #553c9a;
}

.current-week {
  font-weight: 500;
  color: #4a5568;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  color: #4a5568;
}

.date {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 600px;
}

.day-column {
  border-right: 1px solid #e2e8f0;
  padding: 1rem;
}

.day-column:last-child {
  border-right: none;
}

.day-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.todo-item:hover {
  transform: translateY(-2px);
}

.todo-time {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.todo-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-word;
}

.todo-tag {
  font-size: 1.1rem;
}

.important-urgent {
  background-color: #fff5f5;
  border-left: 3px solid #f56565;
}

.important-not-urgent {
  background-color: #fffaf0;
  border-left: 3px solid #ed8936;
}

.not-important-urgent {
  background-color: #f0fff4;
  border-left: 3px solid #48bb78;
}

.not-important-not-urgent {
  background-color: #f7fafc;
  border-left: 3px solid #4299e1;
}

.completed {
  opacity: 0.6;
}

.completed .todo-title {
  text-decoration: line-through;
}

@media (max-width: 768px) {
  .week-view {
    font-size: 0.9rem;
  }

  .day-header {
    padding: 0.75rem;
  }

  .day-column {
    padding: 0.5rem;
  }

  .todo-item {
    padding: 0.5rem;
  }
}
</style> 