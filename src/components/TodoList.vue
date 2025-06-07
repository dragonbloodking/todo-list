<template>
  <div class="todo-container">
    <header class="app-header">
      <h1>四象限待办清单</h1>
      <div class="view-switcher">
        <button 
          @click="currentView = 'quadrant'"
          :class="{ active: currentView === 'quadrant' }"
          class="view-button"
        >
          四象限视图
        </button>
        <button 
          @click="currentView = 'week'"
          :class="{ active: currentView === 'week' }"
          class="view-button"
        >
          周视图
        </button>
      </div>
    </header>

    <main class="main-content">
      <section v-if="currentView === 'quadrant'" class="quadrants-section">
        <div class="quadrant important-urgent">
          <h2>重要且紧急</h2>
          <TodoForm @add-todo="addTodo" :quadrant="1" />
          <div class="todo-list">
            <div v-for="todo in getQuadrantTodos(1)" :key="todo.id" class="todo-item">
              <div class="todo-content" @click="startEdit(todo)">
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-time">
                  {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
                </div>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quadrant important-not-urgent">
          <h2>重要不紧急</h2>
          <TodoForm @add-todo="addTodo" :quadrant="2" />
          <div class="todo-list">
            <div v-for="todo in getQuadrantTodos(2)" :key="todo.id" class="todo-item">
              <div class="todo-content" @click="startEdit(todo)">
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-time">
                  {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
                </div>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quadrant not-important-urgent">
          <h2>紧急不重要</h2>
          <TodoForm @add-todo="addTodo" :quadrant="3" />
          <div class="todo-list">
            <div v-for="todo in getQuadrantTodos(3)" :key="todo.id" class="todo-item">
              <div class="todo-content" @click="startEdit(todo)">
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-time">
                  {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
                </div>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quadrant not-important-not-urgent">
          <h2>不重要不紧急</h2>
          <TodoForm @add-todo="addTodo" :quadrant="4" />
          <div class="todo-list">
            <div v-for="todo in getQuadrantTodos(4)" :key="todo.id" class="todo-item">
              <div class="todo-content" @click="startEdit(todo)">
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-time">
                  {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
                </div>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="week-section">
        <WeekView :todos="todos" />
      </section>

      <section class="stats-section">
        <div class="stats-card">
          <h3>统计信息</h3>
          <p>总任务数: {{ todos.length }}</p>
          <p>已完成: {{ completedTodos }}</p>
          <p>待完成: {{ pendingTodos }}</p>
          <div class="tags-stats">
            <h4>标签统计</h4>
            <p v-for="(count, tag) in tagStats" :key="tag">
              {{ getTagIcon(tag) }} {{ getTagName(tag) }}: {{ count }}
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- 编辑对话框 -->
    <div v-if="editingTodo" class="edit-dialog-overlay" @click="cancelEdit">
      <div class="edit-dialog" @click.stop>
        <h3>编辑待办事项</h3>
        <form @submit.prevent="saveEdit" class="edit-form">
          <div class="form-group">
            <label>标题</label>
            <input 
              v-model="editForm.title" 
              type="text" 
              required 
              minlength="3"
            >
          </div>
          <div class="form-group">
            <label>标签</label>
            <select v-model="editForm.tag">
              <option value="none">📌 无标签</option>
              <option value="life">🏠 生活</option>
              <option value="shopping">🛒 购物</option>
              <option value="travel">✈️ 旅行</option>
              <option value="study">📚 学习</option>
              <option value="exercise">💪 锻炼</option>
            </select>
          </div>
          <div class="form-group">
            <label>开始时间</label>
            <input 
              v-model="editForm.startTime" 
              type="datetime-local" 
              required
            >
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input 
              v-model="editForm.endTime" 
              type="datetime-local" 
              required
            >
          </div>
          <div class="form-group">
            <label>象限</label>
            <select v-model="editForm.quadrant">
              <option :value="1">重要且紧急</option>
              <option :value="2">重要不紧急</option>
              <option :value="3">紧急不重要</option>
              <option :value="4">不重要不紧急</option>
            </select>
          </div>
          <div class="dialog-buttons">
            <button type="submit" class="save-btn">保存</button>
            <button type="button" @click="cancelEdit" class="cancel-btn">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import TodoForm from './TodoForm.vue'
import WeekView from './WeekView.vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'TodoList',
  components: {
    TodoForm,
    WeekView
  },
  setup() {
    const todos = ref([])
    const currentView = ref('quadrant')
    const { currentUser } = useAuth()
    const editingTodo = ref(null)
    const editForm = ref({
      title: '',
      tag: 'none',
      startTime: '',
      endTime: '',
      quadrant: 1
    })

    const completedTodos = computed(() => todos.value.filter(todo => todo.completed).length)
    const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed).length)

    const tagStats = computed(() => {
      const stats = {}
      todos.value.forEach(todo => {
        stats[todo.tag] = (stats[todo.tag] || 0) + 1
      })
      return stats
    })

    const getQuadrantTodos = (quadrant) => {
      return todos.value.filter(todo => todo.quadrant === quadrant)
    }

    const loadTodos = () => {
      const userId = currentUser.value?.id
      if (userId) {
        const savedTodos = localStorage.getItem(`todos_${userId}`)
        if (savedTodos) {
          todos.value = JSON.parse(savedTodos)
        }
      }
    }

    const saveTodos = () => {
      const userId = currentUser.value?.id
      if (userId) {
        localStorage.setItem(`todos_${userId}`, JSON.stringify(todos.value))
      }
    }

    const addTodo = (title, quadrant, tag, timeData) => {
      const newTodo = {
        id: Date.now(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        quadrant,
        tag,
        startTime: timeData?.startTime,
        endTime: timeData?.endTime,
        userId: currentUser.value?.id
      }
      todos.value.push(newTodo)
      saveTodos()
    }

    const toggleTodo = (id) => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        saveTodos()
      }
    }

    const deleteTodo = (id) => {
      todos.value = todos.value.filter(t => t.id !== id)
      saveTodos()
    }

    const startEdit = (todo) => {
      editingTodo.value = todo
      editForm.value = {
        title: todo.title,
        tag: todo.tag,
        startTime: new Date(todo.startTime).toISOString().slice(0, 16),
        endTime: new Date(todo.endTime).toISOString().slice(0, 16),
        quadrant: todo.quadrant
      }
    }

    const saveEdit = () => {
      if (!editingTodo.value) return

      const start = new Date(editForm.value.startTime)
      const end = new Date(editForm.value.endTime)
      if (end <= start) {
        alert('结束时间必须晚于开始时间')
        return
      }

      const todo = todos.value.find(t => t.id === editingTodo.value.id)
      if (todo) {
        todo.title = editForm.value.title
        todo.tag = editForm.value.tag
        todo.startTime = new Date(editForm.value.startTime).toISOString()
        todo.endTime = new Date(editForm.value.endTime).toISOString()
        todo.quadrant = editForm.value.quadrant
        saveTodos()
      }
      cancelEdit()
    }

    const cancelEdit = () => {
      editingTodo.value = null
      editForm.value = {
        title: '',
        tag: 'none',
        startTime: '',
        endTime: '',
        quadrant: 1
      }
    }

    const formatDateTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
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

    onMounted(() => {
      loadTodos()
    })

    return {
      todos,
      currentView,
      completedTodos,
      pendingTodos,
      tagStats,
      editingTodo,
      editForm,
      getQuadrantTodos,
      addTodo,
      toggleTodo,
      deleteTodo,
      getTagIcon,
      getTagName,
      startEdit,
      saveEdit,
      cancelEdit,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.todo-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.app-header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.view-switcher {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.view-button {
  padding: 0.5rem 1rem;
  background: #6b46c1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.view-button:hover,
.view-button.active {
  background: #553c9a;
}

.main-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.quadrants-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1.5rem;
}

.quadrant {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quadrant h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2d3748;
}

.important-urgent {
  border-left: 4px solid #f56565;
}

.important-not-urgent {
  border-left: 4px solid #ed8936;
}

.not-important-urgent {
  border-left: 4px solid #48bb78;
}

.not-important-not-urgent {
  border-left: 4px solid #4299e1;
}

.todo-list {
  margin-top: 1rem;
}

.todo-item {
  padding: 0.75rem;
  border-bottom: 1px solid #edf2f7;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.todo-content input[type="checkbox"] {
  margin-right: 0.75rem;
}

.todo-content span {
  flex: 1;
}

.todo-content span.completed {
  text-decoration: line-through;
  color: #a0aec0;
}

.todo-time {
  font-size: 0.85rem;
  color: #718096;
  white-space: nowrap;
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.todo-tag {
  font-size: 1.2rem;
}

.delete-btn {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.delete-btn:hover {
  color: #c53030;
}

.stats-section {
  position: sticky;
  top: 2rem;
}

.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-card h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.stats-card p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.tags-stats {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
}

.tags-stats h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.edit-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-dialog h3 {
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4a5568;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6b46c1;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.save-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.save-btn {
  background: #6b46c1;
  color: white;
}

.save-btn:hover {
  background: #553c9a;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #cbd5e0;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .quadrants-section {
    grid-template-columns: 1fr;
  }

  .stats-section {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .todo-container {
    padding: 1rem;
  }

  .todo-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .todo-time {
    margin-left: 2.5rem;
  }

  .todo-actions {
    margin-left: 2.5rem;
  }
}
</style> 