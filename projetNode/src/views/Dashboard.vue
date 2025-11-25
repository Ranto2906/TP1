<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>ITU - Relevé de Notes</h1>
        <div class="user-info">
          <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
          <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="welcome-section">
        <h2>Bienvenue, {{ user?.firstName }} !</h2>
        <p v-if="isAdmin">Vous êtes connecté en tant qu'administrateur</p>
        <p v-else>Numéro étudiant: {{ user?.id }}</p>
      </div>

      <div class="stats-cards">
        <div class="stat-card" v-if="!isAdmin">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>Mes Notes</h3>
            <p>Consulter tous mes relevés de notes</p>
            <router-link :to="`/etudiants/${user?.id}`" class="btn btn-primary">
              Voir mes notes
            </router-link>
          </div>
        </div>

        <div class="stat-card" v-if="isAdmin">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <h3>Gestion des Semestres</h3>
            <p>Voir tous les semestres et les étudiants</p>
            <router-link to="/semestres" class="btn btn-primary">
              Voir les semestres
            </router-link>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Moyennes</h3>
            <p>Consulter les moyennes par semestre</p>
            <button @click="loadMoyennes" class="btn btn-secondary">
              {{ showMoyennes ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showMoyennes && moyennes.length > 0" class="moyennes-section">
        <h3>Mes Moyennes</h3>
        <div class="table-container">
          <table class="moyennes-table">
            <thead>
              <tr>
                <th>Semestre</th>
                <th>Année Universitaire</th>
                <th>Moyenne</th>
                <th>Crédits Obtenus</th>
                <th>Total Crédits</th>
                <th>Nombre de Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="moy in moyennes" :key="moy.idSemestre">
                <td>{{ moy.nomSemestre }}</td>
                <td>{{ moy.anneeUniversitaire }}</td>
                <td class="moyenne-value">{{ moy.moyenneSemestre?.toFixed(2) || 'N/A' }}</td>
                <td>{{ moy.creditsObtenus || 0 }}</td>
                <td>{{ moy.totalCredits || 0 }}</td>
                <td>{{ moy.nombreNotes || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService, notesService } from '@/services/api';

const router = useRouter();
const user = ref(null);
const isAdmin = ref(false);
const moyennes = ref([]);
const showMoyennes = ref(false);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  user.value = authService.getCurrentUser();
  isAdmin.value = authService.isAdmin();
});

const loadMoyennes = async () => {
  if (showMoyennes.value) {
    showMoyennes.value = false;
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (isAdmin.value) {
      const response = await notesService.getAllMoyennes();
      moyennes.value = response.data || [];
    } else {
      const response = await notesService.getMesMoyennes();
      moyennes.value = response.data || [];
    }
    showMoyennes.value = true;
  } catch (err) {
    error.value = 'Erreur lors du chargement des moyennes';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .dashboard-header {
    padding: 28px 48px;
  }
}

@media (min-width: 1024px) {
  .dashboard-header {
    padding: 32px 64px;
  }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .header-content h1 {
    font-size: 28px;
  }
}

@media (min-width: 1024px) {
  .header-content h1 {
    font-size: 32px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

@media (min-width: 768px) {
  .user-info {
    gap: 16px;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .user-info {
    gap: 20px;
    font-size: 16px;
  }
}

.user-name {
  font-weight: 600;
  display: none;
}

@media (min-width: 768px) {
  .user-name {
    display: inline;
  }
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .btn-logout {
    padding: 10px 18px;
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  .btn-logout {
    padding: 12px 24px;
    font-size: 15px;
  }
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

@media (min-width: 768px) {
  .dashboard-main {
    padding: 48px 32px;
  }
}

@media (min-width: 1024px) {
  .dashboard-main {
    padding: 64px 48px;
  }
}

.welcome-section {
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .welcome-section {
    margin-bottom: 48px;
  }
}

.welcome-section h2 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 10px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .welcome-section h2 {
    font-size: 36px;
  }
}

@media (min-width: 1024px) {
  .welcome-section h2 {
    font-size: 42px;
  }
}

.welcome-section p {
  color: #718096;
  font-size: 15px;
}

@media (min-width: 768px) {
  .welcome-section p {
    font-size: 17px;
  }
}

@media (min-width: 1024px) {
  .welcome-section p {
    font-size: 19px;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 28px;
    margin-bottom: 48px;
  }
}

@media (min-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 32px;
  }
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .stat-card {
    padding: 28px;
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .stat-card {
    padding: 32px;
    border-radius: 20px;
  }
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.stat-icon {
  font-size: 42px;
  line-height: 1;
}

@media (min-width: 768px) {
  .stat-icon {
    font-size: 52px;
  }
}

@media (min-width: 1024px) {
  .stat-icon {
    font-size: 60px;
  }
}

.stat-content h3 {
  margin: 0 0 10px;
  color: #2d3748;
  font-size: 18px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .stat-content h3 {
    font-size: 22px;
    margin-bottom: 12px;
  }
}

@media (min-width: 1024px) {
  .stat-content h3 {
    font-size: 24px;
  }
}

.stat-content p {
  margin: 0 0 16px;
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .stat-content p {
    font-size: 15px;
    margin-bottom: 20px;
  }
}

@media (min-width: 1024px) {
  .stat-content p {
    font-size: 16px;
  }
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.moyennes-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.moyennes-section h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 20px;
}

.table-container {
  overflow-x: auto;
}

.moyennes-table {
  width: 100%;
  border-collapse: collapse;
}

.moyennes-table th,
.moyennes-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.moyennes-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.moyennes-table tr:hover {
  background: #f8f9fa;
}

.moyenne-value {
  font-weight: 600;
  color: #667eea;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
}

.alert-error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}
</style>
