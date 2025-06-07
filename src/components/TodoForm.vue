<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <div class="form-row">
      <input 
        type="text" 
        v-model="title"
        placeholder="添加新任务..."
        class="todo-input"
        :class="{ error: showError }"
        required
        minlength="3"
        ref="titleInput"
      >
      <select v-model="tag" class="tag-select">
        <option value="none">📌 无标签</option>
        <option value="life">🏠 生活</option>
        <option value="shopping">🛒 购物</option>
        <option value="travel">✈️ 旅行</option>
        <option value="study">📚 学习</option>
        <option value="exercise">💪 锻炼</option>
      </select>
    </div>
    <div class="time-row">
      <input 
        type="datetime-local" 
        v-model="startTime"
        class="time-input"
        :min="minDateTime"
        required
      >
      <span>至</span>
      <input 
        type="datetime-local" 
        v-model="endTime"
        class="time-input"
        :min="startTime"
        required
      >
      <button type="submit" class="add-btn">添加</button>
    </div>
    <div v-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'TodoForm',
  props: {
    quadrant: {
      type: Number,
      required: true
    }
  },
  emits: ['add-todo', 'task-added'],
  setup(props, { emit }) {
    const { currentUser } = useAuth()
    const title = ref('')
    const tag = ref('none')
    const startTime = ref('')
    const endTime = ref('')
    const showError = ref(false)
    const errorMessage = ref('')
    const titleInput = ref(null)

    const minDateTime = new Date().toISOString().slice(0, 16)
    
    onMounted(() => {
      if (titleInput.value) {
        titleInput.value.focus()
      }
      
      // 设置默认时间
      const now = new Date()
      const startDefault = new Date(now.getTime() + 30 * 60000) // 30分钟后
      startTime.value = startDefault.toISOString().slice(0, 16)
      
      const endDefault = new Date(now.getTime() + 90 * 60000) // 90分钟后
      endTime.value = endDefault.toISOString().slice(0, 16)
    })

    const validateForm = () => {
      if (!currentUser.value) {
        errorMessage.value = '请先登录'
        showError.value = true
        return false
      }

      if (title.value.trim().length < 3) {
        errorMessage.value = '任务描述至少需要3个字符'
        showError.value = true
        return false
      }

      const start = new Date(startTime.value)
      const end = new Date(endTime.value)
      if (end <= start) {
        errorMessage.value = '结束时间必须晚于开始时间'
        showError.value = true
        return false
      }

      showError.value = false
      errorMessage.value = ''
      return true
    }

    const handleSubmit = () => {
      if (validateForm()) {
        emit('add-todo', title.value.trim(), props.quadrant, tag.value, {
          startTime: new Date(startTime.value).toISOString(),
          endTime: new Date(endTime.value).toISOString()
        })
        title.value = ''
        tag.value = 'none'
        
        // 发送事件通知任务已添加
        emit('task-added')
      }
    }

    return {
      title,
      tag,
      startTime,
      endTime,
      showError,
      errorMessage,
      minDateTime,
      handleSubmit,
      titleInput
    }
  }
}
</script>

<style scoped>
.todo-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.todo-input:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.todo-input.error {
  border-color: #e53e3e;
}

.tag-select {
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  min-width: 120px;
}

.tag-select:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.time-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.time-row span {
  color: #4a5568;
}

.time-input {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.time-input:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.add-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  color: white;
  background-color: #6b46c1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
}

.add-btn:hover {
  background-color: #553c9a;
  transform: translateY(-2px);
}

.add-btn:active {
  transform: translateY(0);
}

.error-message {
  margin-top: 1rem;
  color: #e53e3e;
  font-size: 0.875rem;
  background-color: #fff5f5;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #e53e3e;
}

@media (max-width: 768px) {
  .time-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .time-input {
    width: 100%;
  }
  
  .add-btn {
    margin-top: 0.5rem;
    width: 100%;
  }
}
</style> 