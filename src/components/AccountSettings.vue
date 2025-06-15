<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-dialog">
      <div class="settings-header">
        <h2>账号设置</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="settings-section">
        <h3>修改密码</h3>
        <form @submit.prevent="handleChangePassword" class="settings-form">
          <input type="password" v-model="oldPassword" placeholder="原密码" required />
          <input type="password" v-model="newPassword" placeholder="新密码" required minlength="4" />
          <input type="password" v-model="confirmPassword" placeholder="确认新密码" required minlength="4" />
          <button type="submit">修改密码</button>
        </form>
        <div v-if="passwordMsg" class="settings-msg">{{ passwordMsg }}</div>
      </div>
      <div class="settings-section">
        <h3>数据导出/导入</h3>
        <button @click="exportData">导出数据</button>
        <input type="file" @change="importData" accept="application/json" />
        <div v-if="importMsg" class="settings-msg">{{ importMsg }}</div>
      </div>
      <div class="settings-section danger">
        <h3>危险操作</h3>
        <button @click="clearData" class="danger-btn">清空所有数据</button>
        <button @click="deleteAccount" class="danger-btn">注销账号</button>
        <div v-if="dangerMsg" class="settings-msg">{{ dangerMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'AccountSettings',
  setup(_, { emit }) {
    const { currentUser, logout } = useAuth()
    const oldPassword = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const passwordMsg = ref('')
    const importMsg = ref('')
    const dangerMsg = ref('')

    // 修改密码
    const handleChangePassword = () => {
      if (!currentUser.value) return
      if (newPassword.value !== confirmPassword.value) {
        passwordMsg.value = '两次新密码不一致'
        return
      }
      if (oldPassword.value !== currentUser.value.password) {
        passwordMsg.value = '原密码错误'
        return
      }
      // 修改localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const idx = users.findIndex(u => u.id === currentUser.value.id)
      if (idx !== -1) {
        users[idx].password = newPassword.value
        localStorage.setItem('users', JSON.stringify(users))
        currentUser.value.password = newPassword.value
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        passwordMsg.value = '密码修改成功'
        oldPassword.value = newPassword.value = confirmPassword.value = ''
      }
    }

    // 数据导出
    const exportData = () => {
      if (!currentUser.value) return
      const userId = currentUser.value.id
      const todos = localStorage.getItem(`todos_${userId}`)
      const notes = localStorage.getItem(`notes_${userId}`)
      const data = {
        todos: todos ? JSON.parse(todos) : [],
        notes: notes ? JSON.parse(notes) : []
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `todo_data_${userId}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    // 数据导入
    const importData = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (data.todos && Array.isArray(data.todos)) {
            localStorage.setItem(`todos_${currentUser.value.id}`, JSON.stringify(data.todos))
          }
          if (data.notes && Array.isArray(data.notes)) {
            localStorage.setItem(`notes_${currentUser.value.id}`, JSON.stringify(data.notes))
          }
          importMsg.value = '数据导入成功，请刷新页面查看'
        } catch {
          importMsg.value = '导入数据格式有误'
        }
      }
      reader.readAsText(file)
    }

    // 清空所有数据
    const clearData = () => {
      if (!currentUser.value) return
      if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) return
      localStorage.removeItem(`todos_${currentUser.value.id}`)
      localStorage.removeItem(`notes_${currentUser.value.id}`)
      dangerMsg.value = '数据已清空'
    }

    // 注销账号
    const deleteAccount = () => {
      if (!currentUser.value) return
      if (!confirm('确定要注销账号并删除所有数据吗？此操作不可恢复！')) return
      // 删除用户数据
      localStorage.removeItem(`todos_${currentUser.value.id}`)
      localStorage.removeItem(`notes_${currentUser.value.id}`)
      // 删除用户
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const idx = users.findIndex(u => u.id === currentUser.value.id)
      if (idx !== -1) {
        users.splice(idx, 1)
        localStorage.setItem('users', JSON.stringify(users))
      }
      localStorage.removeItem('currentUser')
      dangerMsg.value = '账号已注销'
      setTimeout(() => {
        logout()
        emit('close')
      }, 1000)
    }

    return {
      oldPassword,
      newPassword,
      confirmPassword,
      passwordMsg,
      exportData,
      importData,
      importMsg,
      clearData,
      deleteAccount,
      dangerMsg
    }
  }
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.settings-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  width: 400px;
  max-width: 90vw;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  position: relative;
}
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.settings-section {
  margin-bottom: 1.5rem;
}
.settings-form {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}
.settings-form input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.settings-form button {
  background: #6b46c1;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
}
.settings-msg {
  color: #6b46c1;
  margin-top: 0.5rem;
}
.danger {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
.danger-btn {
  background: #f56565;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
}
.danger-btn:hover {
  background: #c53030;
}
</style> 