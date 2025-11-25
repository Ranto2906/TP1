<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>ITU - Relevé de Notes</h1>
        <p>Système de Gestion des Notes</p>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="votre.email@univ.mg"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isAdminLogin" />
            <span>Se connecter en tant qu'administrateur</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <div class="login-footer">
        <p>© 2025 ITU University - Tous droits réservés</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const isAdminLogin = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isAdminLogin.value) {
      // Pour l'admin, l'API attend 'mot_de_passe' au lieu de 'password'
      await authService.loginAdmin(form.value.email, form.value.password);
      router.push('/semestres');
    } else {
      await authService.login(form.value.email, form.value.password);
      router.push('/');
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    error.value = err.response?.data?.error?.message || err.message || 'Erreur de connexion au serveur';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
}

@media (min-width: 768px) {
  .login-card {
    max-width: 700px;
    border-radius: 28px;
  }
}

@media (min-width: 1024px) {
  .login-card {
    max-width: 900px;
    border-radius: 32px;
  }
}

@media (min-width: 1280px) {
  .login-card {
    max-width: 1100px;
  }
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 45px 35px;
  text-align: center;
}

.login-header h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.login-header p {
  margin: 16px 0 0;
  opacity: 0.95;
  font-size: 18px;
  font-weight: 400;
}

@media (min-width: 768px) {
  .login-header {
    padding: 65px 55px;
  }
  
  .login-header h1 {
    font-size: 48px;
  }
  
  .login-header p {
    font-size: 22px;
    margin-top: 20px;
  }
}

@media (min-width: 1024px) {
  .login-header {
    padding: 80px 70px;
  }
  
  .login-header h1 {
    font-size: 56px;
  }
  
  .login-header p {
    font-size: 26px;
    margin-top: 24px;
  }
}

@media (min-width: 1280px) {
  .login-header {
    padding: 90px 80px;
  }
  
  .login-header h1 {
    font-size: 64px;
  }
  
  .login-header p {
    font-size: 28px;
  }
}

.login-form {
  padding: 45px 35px;
}

.form-group {
  margin-bottom: 28px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  color: #2d3748;
  font-size: 16px;
  letter-spacing: 0.3px;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 17px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

@media (min-width: 768px) {
  .login-form {
    padding: 60px 55px;
  }
  
  .form-group {
    margin-bottom: 36px;
  }
  
  .form-group label {
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  .form-group input[type="email"],
  .form-group input[type="password"] {
    padding: 20px 24px;
    font-size: 19px;
    border-radius: 14px;
  }
}

@media (min-width: 1024px) {
  .login-form {
    padding: 75px 70px;
  }
  
  .form-group {
    margin-bottom: 42px;
  }
  
  .form-group label {
    font-size: 20px;
    margin-bottom: 14px;
  }
  
  .form-group input[type="email"],
  .form-group input[type="password"] {
    padding: 24px 28px;
    font-size: 21px;
    border-radius: 16px;
  }
}

@media (min-width: 1280px) {
  .login-form {
    padding: 85px 80px;
  }
  
  .form-group {
    margin-bottom: 48px;
  }
  
  .form-group label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .form-group input[type="email"],
  .form-group input[type="password"] {
    padding: 18px 22px;
    font-size: 17px;
  }
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 16px;
  color: #4a5568;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
  font-weight: 500;
}

.checkbox-label:hover {
  color: #2d3748;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

@media (min-width: 768px) {
  .checkbox-label {
    font-size: 18px;
    gap: 16px;
  }
  
  .checkbox-label input[type="checkbox"] {
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 1024px) {
  .checkbox-label {
    font-size: 20px;
    gap: 18px;
  }
  
  .checkbox-label input[type="checkbox"] {
    width: 28px;
    height: 28px;
  }
}

@media (min-width: 1280px) {
  .checkbox-label {
    font-size: 22px;
  }
  
  .checkbox-label input[type="checkbox"] {
    width: 30px;
    height: 30px;
  }
}

.alert {
  padding: 14px 18px;
  border-radius: 10px;
  margin: 20px 30px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

@media (min-width: 768px) {
  .alert {
    padding: 16px 20px;
    margin: 20px 40px 0;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .alert {
    padding: 18px 24px;
    margin: 20px 50px 0;
    font-size: 16px;
  }
}

.btn {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (min-width: 768px) {
  .btn {
    padding: 22px;
    font-size: 20px;
    border-radius: 14px;
  }
}

@media (min-width: 1024px) {
  .btn {
    padding: 26px;
    font-size: 22px;
    border-radius: 16px;
  }
}

@media (min-width: 1280px) {
  .btn {
    padding: 28px;
    font-size: 24px;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  background: #f8f9fa;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-footer p {
  margin: 0;
}
</style>
