<template>
  <div class="todo-container">
    <header class="app-header">
      <h1>待办事项管理</h1>
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
        <button 
          @click="currentView = 'stats'"
          :class="{ active: currentView === 'stats' }"
          class="view-button stats-button"
        >
          统计分析
        </button>
      </div>
    </header>

    <main class="main-content">
      <section v-if="currentView === 'quadrant'" class="quadrants-section">
        <div class="quadrant important-urgent">
          <div class="quadrant-header">
            <div class="quadrant-number">I</div>
            <h2>重要且紧急</h2>
            <button class="add-task-btn" @click="openAddForm(1)">+</button>
          </div>
          <div class="todo-list">
            <div 
              v-for="todo in getQuadrantTodos(1)" 
              :key="todo.id" 
              class="todo-item"
              draggable="true"
              @dragstart="startDrag($event, todo)"
              @dragover.prevent
              @drop="onDrop($event, 1)"
            >
              <div class="todo-content" @click="startEdit(todo)">
                <div class="todo-tag-marker" :style="{ backgroundColor: getTagColor(todo.tag) }"></div>
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
              <div class="todo-time">
                {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
              </div>
            </div>
            <div v-if="getQuadrantTodos(1).length === 0" class="empty-quadrant">
              <p>当前象限无事项</p>
            </div>
          </div>
        </div>
        
        <div class="quadrant important-not-urgent">
          <div class="quadrant-header">
            <div class="quadrant-number">II</div>
            <h2>重要不紧急</h2>
            <button class="add-task-btn" @click="openAddForm(2)">+</button>
          </div>
          <div class="todo-list"
            @dragover.prevent
            @drop="onDrop($event, 2)"
          >
            <div 
              v-for="todo in getQuadrantTodos(2)" 
              :key="todo.id" 
              class="todo-item"
              draggable="true"
              @dragstart="startDrag($event, todo)"
            >
              <div class="todo-content" @click="startEdit(todo)">
                <div class="todo-tag-marker" :style="{ backgroundColor: getTagColor(todo.tag) }"></div>
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
              <div class="todo-time">
                {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
              </div>
            </div>
            <div v-if="getQuadrantTodos(2).length === 0" class="empty-quadrant">
              <p>当前象限无事项</p>
            </div>
          </div>
        </div>
        
        <div class="quadrant not-important-urgent">
          <div class="quadrant-header">
            <div class="quadrant-number">III</div>
            <h2>紧急不重要</h2>
            <button class="add-task-btn" @click="openAddForm(3)">+</button>
          </div>
          <div class="todo-list"
            @dragover.prevent
            @drop="onDrop($event, 3)"
          >
            <div 
              v-for="todo in getQuadrantTodos(3)" 
              :key="todo.id" 
              class="todo-item"
              draggable="true"
              @dragstart="startDrag($event, todo)"
            >
              <div class="todo-content" @click="startEdit(todo)">
                <div class="todo-tag-marker" :style="{ backgroundColor: getTagColor(todo.tag) }"></div>
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
              <div class="todo-time">
                {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
              </div>
            </div>
            <div v-if="getQuadrantTodos(3).length === 0" class="empty-quadrant">
              <p>当前象限无事项</p>
            </div>
          </div>
        </div>
        
        <div class="quadrant not-important-not-urgent">
          <div class="quadrant-header">
            <div class="quadrant-number">IV</div>
            <h2>不重要不紧急</h2>
            <button class="add-task-btn" @click="openAddForm(4)">+</button>
          </div>
          <div class="todo-list"
            @dragover.prevent
            @drop="onDrop($event, 4)"
          >
            <div 
              v-for="todo in getQuadrantTodos(4)" 
              :key="todo.id" 
              class="todo-item"
              draggable="true"
              @dragstart="startDrag($event, todo)"
            >
              <div class="todo-content" @click="startEdit(todo)">
                <div class="todo-tag-marker" :style="{ backgroundColor: getTagColor(todo.tag) }"></div>
                <input 
                  type="checkbox" 
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  @click.stop
                >
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                <div class="todo-actions">
                  <span class="todo-tag">{{ getTagIcon(todo.tag) }}</span>
                  <button @click.stop="deleteTodo(todo.id)" class="delete-btn">×</button>
                </div>
              </div>
              <div class="todo-time">
                {{ formatDateTime(todo.startTime) }} - {{ formatDateTime(todo.endTime) }}
              </div>
            </div>
            <div v-if="getQuadrantTodos(4).length === 0" class="empty-quadrant">
              <p>当前象限无事项</p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="currentView === 'week'" class="week-section">
        <WeekView :todos="todos" />
      </section>
      
      <section v-else-if="currentView === 'stats'" class="stats-view-section">
        <StatsView :todos="todos" />
      </section>
    </main>

    <!-- 添加任务对话框 -->
    <div v-if="showAddForm" class="modal-overlay" @click="showAddForm = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <h3>添加任务到 {{ getQuadrantName(selectedQuadrant) }}</h3>
          <button @click="showAddForm = false" class="close-modal">×</button>
        </div>
        <TodoForm @add-todo="addTodo" :quadrant="selectedQuadrant" @task-added="showAddForm = false" />
      </div>
    </div>

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
import StatsView from './StatsView.vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'TodoList',
  components: {
    TodoForm,
    WeekView,
    StatsView
  },
  setup() {
    const todos = ref([])
    const currentView = ref('quadrant')
    const { currentUser } = useAuth()
    const editingTodo = ref(null)
    const showAddForm = ref(false)
    const selectedQuadrant = ref(1)
    const draggedTodo = ref(null)
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
    
    const getTagColor = (tag) => {
      const colors = {
        'none': '#cbd5e0',
        'life': '#4299e1',
        'shopping': '#ed8936',
        'travel': '#48bb78',
        'study': '#9f7aea',
        'exercise': '#f56565'
      }
      return colors[tag] || '#cbd5e0'
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
    
    const getQuadrantName = (quadrant) => {
      const names = {
        1: '重要且紧急',
        2: '重要不紧急',
        3: '紧急不重要',
        4: '不重要不紧急'
      }
      return names[quadrant] || ''
    }
    
    const openAddForm = (quadrant) => {
      selectedQuadrant.value = quadrant
      showAddForm.value = true
    }
    
    const startDrag = (event, todo) => {
      draggedTodo.value = todo
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', todo.id)
    }
    
    const onDrop = (event, quadrant) => {
      event.preventDefault()
      if (draggedTodo.value) {
        const todo = todos.value.find(t => t.id === draggedTodo.value.id)
        if (todo && todo.quadrant !== quadrant) {
          todo.quadrant = quadrant
          saveTodos()
        }
        draggedTodo.value = null
      }
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
      showAddForm,
      selectedQuadrant,
      draggedTodo,
      getQuadrantTodos,
      addTodo,
      toggleTodo,
      deleteTodo,
      getTagIcon,
      getTagName,
      getTagColor,
      startEdit,
      saveEdit,
      cancelEdit,
      formatDateTime,
      openAddForm,
      getQuadrantName,
      startDrag,
      onDrop
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
  padding: 0.5rem 1.5rem;
  background: #fff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.view-button:hover,
.view-button.active {
  background: #6b46c1;
  color: white;
  border-color: #6b46c1;
}

.stats-button {
  background: #f8f5ff;
  color: #6b46c1;
  border-color: #d6bcfa;
}

.stats-button.active {
  background: #6b46c1;
  color: white;
}

.main-content {
  width: 100%;
}

.quadrants-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, minmax(300px, 1fr));
  gap: 1.5rem;
  min-height: 700px;
}

.quadrant {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.quadrant-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #edf2f7;
  position: relative;
}

.quadrant-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
  color: white;
}

.important-urgent .quadrant-number {
  background-color: #f56565;
}

.important-not-urgent .quadrant-number {
  background-color: #ed8936;
}

.not-important-urgent .quadrant-number {
  background-color: #48bb78;
}

.not-important-not-urgent .quadrant-number {
  background-color: #4299e1;
}

.quadrant h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
  flex: 1;
}

.add-task-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #6b46c1;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-task-btn:hover {
  transform: scale(1.1);
}

.todo-list {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100% - 60px);
}

.todo-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  cursor: grab;
  transition: all 0.2s;
}

.todo-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.todo-tag-marker {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.todo-content input[type="checkbox"] {
  margin-right: 0.5rem;
}

.todo-content span {
  flex: 1;
  font-size: 0.95rem;
}

.todo-content span.completed {
  text-decoration: line-through;
  color: #a0aec0;
}

.todo-time {
  font-size: 0.8rem;
  color: #718096;
  margin-left: 1.8rem;
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.todo-tag {
  font-size: 1.1rem;
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

.empty-quadrant {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #a0aec0;
  font-style: italic;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
}

.week-section, .stats-view-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.modal-overlay {
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

.modal-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #6b46c1;
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-modal {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
  border-radius: 8px;
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
  border-radius: 8px;
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

.important-urgent {
  border-top: 3px solid #f56565;
}

.important-not-urgent {
  border-top: 3px solid #ed8936;
}

.not-important-urgent {
  border-top: 3px solid #48bb78;
}

.not-important-not-urgent {
  border-top: 3px solid #4299e1;
}

@media (max-width: 1024px) {
  .quadrants-section {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, minmax(200px, auto));
  }
}

@media (max-width: 768px) {
  .todo-container {
    padding: 1rem;
  }
  
  .view-switcher {
    flex-wrap: wrap;
  }
  
  .view-button {
    flex: 1;
    min-width: 120px;
  }
  
  .todo-time {
    margin-left: 1.8rem;
  }
}
</style> 