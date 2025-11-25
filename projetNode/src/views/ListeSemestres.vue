<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <button @click="goBack" class="btn-back">← Retour</button>
        <h1>Liste des Semestres</h1>
        <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
      </div>
    </header>

    <main class="page-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des semestres...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else class="semestres-grid">
        <div 
          v-for="semestre in semestres" 
          :key="semestre.id"
          class="semestre-card"
          @click="goToEtudiants(semestre.id)"
        >
          <div class="semestre-icon">🎓</div>
          <h3>{{ semestre.nom }}</h3>
          <p class="semestre-desc">{{ semestre.description || 'Semestre académique' }}</p>
          <div class="semestre-stats">
            <span class="stat-item">
              <strong>{{ semestre.nombreEtudiants || 0 }}</strong> étudiants
            </span>
          </div>
          <button class="btn btn-primary">Voir les étudiants →</button>
        </div>
      </div>

      <div v-if="semestres.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucun semestre trouvé</h3>
        <p>Il n'y a pas encore de semestres enregistrés dans le système.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService, notesService } from '@/services/api';

const router = useRouter();
const semestres = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  await loadSemestres();
});

const loadSemestres = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Charger toutes les moyennes pour extraire les semestres uniques
    const response = await notesService.getAllMoyennes();
    const moyennes = response.data || [];

    // Extraire les semestres uniques
    const semestresMap = new Map();
    
    moyennes.forEach(moy => {
      if (!semestresMap.has(moy.idSemestre)) {
        semestresMap.set(moy.idSemestre, {
          id: moy.idSemestre,
          nom: moy.nomSemestre,
          description: `Année ${moy.anneeUniversitaire}`,
          nombreEtudiants: 1
        });
      } else {
        const sem = semestresMap.get(moy.idSemestre);
        sem.nombreEtudiants++;
      }
    });

    semestres.value = Array.from(semestresMap.values()).sort((a, b) => a.id - b.id);
  } catch (err) {
    error.value = 'Erreur lors du chargement des semestres';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goToEtudiants = (idSemestre) => {
  router.push(`/semestres/${idSemestre}/etudiants`);
};

const goBack = () => {
  router.push('/');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.semestres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.semestre-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.semestre-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.semestre-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.semestre-card h3 {
  margin: 0 0 8px;
  color: #333;
  font-size: 20px;
}

.semestre-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 16px;
}

.semestre-stats {
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  color: #666;
  font-size: 14px;
}

.stat-item strong {
  color: #667eea;
  font-size: 18px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #333;
  margin: 0 0 8px;
  font-size: 24px;
}

.empty-state p {
  color: #666;
  font-size: 16px;
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
