<template>
  <div class="notes-container">
    <div class="notes-header">
      <h1 class="notes-title">我的回忆笔记</h1>
      <button @click="showAddForm = !showAddForm" class="toggle-form-btn">
        {{ showAddForm ? '收起' : '新建笔记' }}
      </button>
    </div>
    
    <!-- 添加笔记表单 -->
    <div v-if="showAddForm" class="add-note-form">
      <div class="form-header">
        <h2>{{ isEditing ? '编辑回忆' : '记录新回忆' }}</h2>
        <div class="form-header-actions">
          <button v-if="isEditing" @click="resetForm" class="icon-btn">
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>
      
      <input
        v-model="newNote.title"
        type="text"
        placeholder="标题"
        class="note-input"
      />
      <textarea
        v-model="newNote.content"
        placeholder="记录你的回忆..."
        class="note-textarea"
      ></textarea>
      <div class="form-actions">
        <button @click="resetForm" class="cancel-btn" v-if="isEditing">取消</button>
        <button @click="saveNote" class="save-btn">
          <i class="material-icons">{{ isEditing ? 'save' : 'add' }}</i>
          {{ isEditing ? '保存更改' : '保存回忆' }}
        </button>
      </div>
    </div>
    
    <!-- 笔记列表 -->
    <div class="notes-wrapper">
      <div v-if="notes.length === 0" class="empty-notes">
        <div class="empty-icon">📝</div>
        <p>暂无回忆笔记</p>
        <p class="empty-subtitle">点击"新建笔记"按钮开始记录美好回忆</p>
      </div>
      
      <div v-else class="note-grid">
        <div v-for="(note, index) in notes" :key="index" class="note-card">
          <div class="note-card-content">
            <div class="note-card-header">
              <h3 class="note-card-title">{{ note.title }}</h3>
              <div class="note-card-actions">
                <button @click="editNote(index)" class="icon-btn edit-icon">
                  <i class="material-icons">edit</i>
                </button>
                <button @click="deleteNote(index)" class="icon-btn delete-icon">
                  <i class="material-icons">delete</i>
                </button>
              </div>
            </div>
            <p class="note-card-text">{{ note.content }}</p>
            <div class="note-card-footer">
              <span class="note-date">
                <i class="material-icons date-icon">event</i>
                {{ formatDate(note.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Notes',
  setup() {
    const { currentUser } = useAuth()
    const notes = ref([])
    const isEditing = ref(false)
    const editingIndex = ref(-1)
    const showAddForm = ref(false)
    const newNote = ref({
      title: '',
      content: '',
      createdAt: null
    })

    // 从localStorage加载笔记
    const loadNotes = () => {
      if (!currentUser.value) return
      
      const userId = currentUser.value.id
      const userNotes = localStorage.getItem(`notes_${userId}`)
      
      if (userNotes) {
        try {
          notes.value = JSON.parse(userNotes)
        } catch (e) {
          notes.value = []
        }
      }
    }

    // 保存笔记到localStorage
    const saveNotesToStorage = () => {
      if (!currentUser.value) return
      
      const userId = currentUser.value.id
      localStorage.setItem(`notes_${userId}`, JSON.stringify(notes.value))
    }

    // 添加或更新笔记
    const saveNote = () => {
      if (!newNote.value.title.trim() || !newNote.value.content.trim()) {
        alert('标题和内容不能为空')
        return
      }

      if (isEditing.value) {
        // 更新已有笔记
        notes.value[editingIndex.value] = {
          ...newNote.value,
          updatedAt: new Date().toISOString()
        }
      } else {
        // 添加新笔记
        notes.value.push({
          ...newNote.value,
          createdAt: new Date().toISOString()
        })
      }

      saveNotesToStorage()
      resetForm()
      showAddForm.value = false
    }

    // 编辑笔记
    const editNote = (index) => {
      isEditing.value = true
      editingIndex.value = index
      newNote.value = { ...notes.value[index] }
      showAddForm.value = true
    }

    // 删除笔记
    const deleteNote = (index) => {
      if (confirm('确定要删除这条笔记吗？')) {
        notes.value.splice(index, 1)
        saveNotesToStorage()
      }
    }

    // 重置表单
    const resetForm = () => {
      newNote.value = {
        title: '',
        content: '',
        createdAt: null
      }
      isEditing.value = false
      editingIndex.value = -1
    }

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    onMounted(() => {
      loadNotes()
    })

    return {
      notes,
      newNote,
      isEditing,
      showAddForm,
      saveNote,
      editNote,
      deleteNote,
      resetForm,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 引入Material Icons */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.notes-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.notes-title {
  color: #6b46c1;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.toggle-form-btn {
  background-color: #6b46c1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-form-btn:hover {
  background-color: #5a3aa9;
  transform: translateY(-2px);
}

.add-note-form {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  color: #4a5568;
  margin: 0;
  font-weight: 600;
  font-size: 1.4rem;
}

.note-input, .note-textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  transition: border 0.2s, box-shadow 0.2s;
  background-color: white;
}

.note-input:focus, .note-textarea:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.2);
}

.note-textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #cbd5e0;
}

.save-btn {
  background-color: #6b46c1;
  color: white;
}

.save-btn:hover {
  background-color: #5a3aa9;
  transform: translateY(-2px);
}

.save-btn:active {
  transform: translateY(0);
}

.notes-wrapper {
  min-height: 300px;
}

.empty-notes {
  text-align: center;
  color: #718096;
  padding: 3rem 2rem;
  background-color: #f9f9fb;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-notes p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.empty-subtitle {
  font-size: 0.95rem !important;
  color: #a0aec0;
  margin-top: 0.5rem !important;
}

.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  height: 100%;
  border: 1px solid #f0f0f0;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.note-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.note-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  word-break: break-word;
}

.note-card-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-btn .material-icons {
  font-size: 1.2rem;
}

.icon-btn:hover {
  background-color: #f7fafc;
}

.edit-icon .material-icons {
  color: #4299e1;
}

.delete-icon .material-icons {
  color: #e53e3e;
}

.note-card-text {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  flex-grow: 1;
  white-space: pre-line;
}

.note-card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  color: #a0aec0;
}

.note-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-icon {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .notes-container {
    padding: 1rem;
  }
  
  .notes-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .note-grid {
    grid-template-columns: 1fr;
  }
  
  .add-note-form {
    padding: 1.5rem;
  }
  
  .toggle-form-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 