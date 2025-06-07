<template>
  <div class="stats-container">
    <h2 class="stats-title">统计信息</h2>
    
    <div class="stats-menu">
      <div class="stats-card">
        <div class="stats-icon">📊</div>
        <div class="stats-content">
          <div class="stats-label">总任务数</div>
          <div class="stats-value">{{ todos.length }}</div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">✅</div>
        <div class="stats-content">
          <div class="stats-label">已完成</div>
          <div class="stats-value">{{ completedTodos }}</div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">⏳</div>
        <div class="stats-content">
          <div class="stats-label">待完成</div>
          <div class="stats-value">{{ pendingTodos }}</div>
        </div>
      </div>
      
      <div class="stats-divider"></div>
      
      <h3 class="section-title">标签统计</h3>
      
      <div v-for="(count, tag) in tagStats" :key="tag" class="tag-stats-card">
        <div class="tag-icon">{{ getTagIcon(tag) }}</div>
        <div class="tag-content">
          <div class="tag-name">{{ getTagName(tag) }}</div>
          <div class="tag-count">{{ count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatsView',
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const completedTodos = computed(() => props.todos.filter(todo => todo.completed).length)
    const pendingTodos = computed(() => props.todos.filter(todo => !todo.completed).length)
    
    const tagStats = computed(() => {
      const stats = {}
      props.todos.forEach(todo => {
        stats[todo.tag] = (stats[todo.tag] || 0) + 1
      })
      return stats
    })
    
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
    
    const getTagName = (tag) => {
      const names = {
        'none': '无标签',
        'life': '生活',
        'shopping': '购物',
        'travel': '旅行',
        'study': '学习',
        'exercise': '锻炼'
      }
      return names[tag] || '无标签'
    }
    
    return {
      completedTodos,
      pendingTodos,
      tagStats,
      getTagIcon,
      getTagName
    }
  }
}
</script>

<style scoped>
.stats-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stats-title {
  background: #6b46c1;
  color: white;
  margin: 0;
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

.stats-menu {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8f5ff;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.stats-card:hover {
  background: #ede9f8;
  transform: translateY(-2px);
}

.stats-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: #6b46c1;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.stats-value {
  font-weight: bold;
  color: #2d3748;
  font-size: 1.2rem;
}

.stats-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.section-title {
  font-size: 1rem;
  color: #6b46c1;
  margin: 0.5rem 0;
}

.tag-stats-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8f5ff;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.tag-stats-card:hover {
  background: #ede9f8;
  transform: translateY(-2px);
}

.tag-icon {
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  background: #6b46c1;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-name {
  font-size: 0.9rem;
  color: #4a5568;
}

.tag-count {
  font-weight: bold;
  color: #6b46c1;
  background: #ede9f8;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
}
</style> 