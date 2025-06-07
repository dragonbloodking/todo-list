<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username"
            v-model="username"
            required
            placeholder="请输入用户名"
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password"
            v-model="password"
            required
            placeholder="请输入密码"
          >
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <button type="submit" class="auth-button">登录</button>
        <div class="auth-links">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')

    const handleLogin = () => {
      // 从localStorage获取用户数据
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.username === username.value)

      if (!user) {
        error.value = '用户名不存在'
        return
      }

      if (user.password !== password.value) {
        error.value = '密码错误'
        return
      }

      // 登录成功，存储当前用户信息
      localStorage.setItem('currentUser', JSON.stringify(user))
      router.push('/')
    }

    return {
      username,
      password,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #666;
  font-size: 0.9rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #6b46c1;
}

.auth-button {
  background: #6b46c1;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-button:hover {
  background: #553c9a;
}

.error {
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
}

.auth-links {
  text-align: center;
  margin-top: 1rem;
}

.auth-links a {
  color: #6b46c1;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style> 