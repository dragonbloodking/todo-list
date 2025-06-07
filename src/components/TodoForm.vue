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
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'TodoForm',
  props: {
    quadrant: {
      type: Number,
      required: true
    }
  },
  emits: ['add-todo'],
  setup(props, { emit }) {
    const { currentUser } = useAuth()
    const title = ref('')
    const tag = ref('none')
    const startTime = ref('')
    const endTime = ref('')
    const showError = ref(false)
    const errorMessage = ref('')

    const minDateTime = new Date().toISOString().slice(0, 16)

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
        startTime.value = ''
        endTime.value = ''
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
      handleSubmit
    }
  }
}
</script>

<style scoped>
.todo-form {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.todo-input:focus {
  outline: none;
  border-color: #6b46c1;
}

.todo-input.error {
  border-color: #e53e3e;
}

.tag-select {
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.tag-select:focus {
  outline: none;
  border-color: #6b46c1;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.time-input:focus {
  outline: none;
  border-color: #6b46c1;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  color: white;
  background-color: #6b46c1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #553c9a;
}

.error-message {
  margin-top: 0.5rem;
  color: #e53e3e;
  font-size: 0.875rem;
}
</style> 