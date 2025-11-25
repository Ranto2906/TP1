<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <button @click="goBack" class="btn-back">← Retour</button>
        <h1>Fiche Étudiant</h1>
        <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
      </div>
    </header>

    <main class="page-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des informations...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else>
        <!-- Informations étudiant -->
        <div class="student-info-card">
          <div class="student-header">
            <div class="student-avatar">
              <span>{{ initiales }}</span>
            </div>
            <div class="student-details">
              <h2>{{ etudiant.prenom }} {{ etudiant.nom }}</h2>
              <p class="student-meta">
                <span>N° Étudiant: <strong>{{ etudiant.idEtudiant }}</strong></span>
                <span v-if="etudiant.email">Email: <strong>{{ etudiant.email }}</strong></span>
                <span v-if="etudiant.parcours">Parcours: <strong>{{ etudiant.parcours }}</strong></span>
              </p>
            </div>
          </div>
        </div>

        <!-- Tableau des moyennes par semestre -->
        <div class="section-card">
          <h3>📊 Moyennes par Semestre</h3>
          
          <div class="table-container">
            <table class="moyennes-table">
              <thead>
                <tr>
                  <th>Semestre</th>
                  <th>Année Universitaire</th>
                  <th class="text-center">Moyenne</th>
                  <th class="text-center">Crédits Obtenus</th>
                  <th class="text-center">Total Crédits</th>
                  <th class="text-center">Résultat</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="moy in moyennes" :key="moy.idSemestre">
                  <td class="text-bold">{{ moy.nomSemestre }}</td>
                  <td>{{ moy.anneeUniversitaire }}</td>
                  <td class="text-center">
                    <span class="moyenne-badge" :class="getMoyenneClass(moy.moyenneSemestre)">
                      {{ moy.moyenneSemestre?.toFixed(2) || 'N/A' }}
                    </span>
                  </td>
                  <td class="text-center">{{ moy.creditsObtenus || 0 }}</td>
                  <td class="text-center">{{ moy.totalCredits || 0 }}</td>
                  <td class="text-center">
                    <span class="resultat-badge" :class="getResultatClass(moy.moyenneSemestre)">
                      {{ getResultatLabel(moy.moyenneSemestre) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Liens vers relevés L1 et L2 -->
          <div class="releves-links">
            <h4>Relevés de Notes</h4>
            <div class="links-grid">
              <button 
                @click="goToReleve('L1')"
                class="btn btn-releve"
              >
                <span class="releve-icon">📄</span>
                <div>
                  <strong>Relevé L1</strong>
                  <p>Semestres 1 et 2</p>
                </div>
              </button>

              <button 
                @click="goToReleve('L2')"
                class="btn btn-releve"
              >
                <span class="releve-icon">📄</span>
                <div>
                  <strong>Relevé L2</strong>
                  <p>Semestres 3 et 4</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Statistiques générales -->
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">{{ moyenneGenerale.toFixed(2) }}</div>
            <div class="stat-label">Moyenne Générale</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ totalCreditsObtenus }}</div>
            <div class="stat-label">Crédits Obtenus</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ totalCredits }}</div>
            <div class="stat-label">Total Crédits</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ moyennes.length }}</div>
            <div class="stat-label">Semestres Suivis</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService, notesService } from '@/services/api';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  idEtudiant: {
    type: [String, Number],
    required: true
  }
});

const etudiant = ref({});
const moyennes = ref([]);
const loading = ref(true);
const error = ref('');

const initiales = computed(() => {
  if (!etudiant.value.nom || !etudiant.value.prenom) return '?';
  return (etudiant.value.prenom.charAt(0) + etudiant.value.nom.charAt(0)).toUpperCase();
});

const moyenneGenerale = computed(() => {
  if (moyennes.value.length === 0) return 0;
  const sum = moyennes.value.reduce((acc, moy) => acc + (moy.moyenneSemestre || 0), 0);
  return sum / moyennes.value.length;
});

const totalCreditsObtenus = computed(() => {
  return moyennes.value.reduce((acc, moy) => acc + (moy.creditsObtenus || 0), 0);
});

const totalCredits = computed(() => {
  return moyennes.value.reduce((acc, moy) => acc + (moy.totalCredits || 0), 0);
});

onMounted(async () => {
  await loadEtudiantData();
});

const loadEtudiantData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const isAdmin = authService.isAdmin();
    const currentUser = authService.getCurrentUser();

    // Vérifier les permissions
    if (!isAdmin && currentUser?.id !== parseInt(props.idEtudiant)) {
      error.value = 'Accès non autorisé';
      return;
    }

    let response;
    if (isAdmin) {
      // Admin peut voir tous les étudiants
      response = await notesService.getAllMoyennes();
      const allMoyennes = response.data || [];
      moyennes.value = allMoyennes.filter(m => m.idEtudiant === parseInt(props.idEtudiant));
    } else {
      // Étudiant ne peut voir que ses propres moyennes
      response = await notesService.getMesMoyennes();
      moyennes.value = response.data || [];
    }

    if (moyennes.value.length > 0) {
      const firstMoy = moyennes.value[0];
      etudiant.value = {
        idEtudiant: firstMoy.idEtudiant,
        nom: firstMoy.nomEtudiant,
        prenom: firstMoy.prenomEtudiant,
        email: firstMoy.emailEtudiant,
        parcours: firstMoy.nomParcours
      };
    } else {
      error.value = 'Aucune donnée trouvée pour cet étudiant';
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des données';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getMoyenneClass = (moyenne) => {
  if (!moyenne) return 'moyenne-na';
  if (moyenne >= 16) return 'moyenne-excellent';
  if (moyenne >= 14) return 'moyenne-tres-bien';
  if (moyenne >= 12) return 'moyenne-bien';
  if (moyenne >= 10) return 'moyenne-passable';
  return 'moyenne-insuffisant';
};

const getResultatClass = (moyenne) => {
  if (!moyenne) return 'resultat-na';
  if (moyenne >= 10) return 'resultat-admis';
  return 'resultat-non-admis';
};

const getResultatLabel = (moyenne) => {
  if (!moyenne) return 'N/A';
  if (moyenne >= 16) return 'Très Bien';
  if (moyenne >= 14) return 'Bien';
  if (moyenne >= 12) return 'Assez Bien';
  if (moyenne >= 10) return 'Passable';
  return 'Ajourné';
};

const goToReleve = (niveau) => {
  router.push(`/etudiants/${props.idEtudiant}/releve/${niveau}`);
};

const goBack = () => {
  const isAdmin = authService.isAdmin();
  if (isAdmin) {
    router.push('/semestres');
  } else {
    router.push('/');
  }
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

.btn-back,
.btn-logout {
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

.btn-back:hover,
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.student-info-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.student-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
}

.student-details h2 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #333;
}

.student-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0;
  color: #666;
  font-size: 14px;
}

.student-meta strong {
  color: #333;
  font-weight: 600;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.section-card h3 {
  margin: 0 0 24px;
  font-size: 22px;
  color: #333;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 32px;
}

.moyennes-table {
  width: 100%;
  border-collapse: collapse;
}

.moyennes-table th,
.moyennes-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.moyennes-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 13px;
  text-transform: uppercase;
}

.moyennes-table tbody tr:hover {
  background: #f8f9fa;
}

.text-center {
  text-align: center !important;
}

.text-bold {
  font-weight: 600;
  color: #333;
}

.moyenne-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.moyenne-excellent { background: #d4edda; color: #155724; }
.moyenne-tres-bien { background: #d1ecf1; color: #0c5460; }
.moyenne-bien { background: #fff3cd; color: #856404; }
.moyenne-passable { background: #f8d7da; color: #721c24; }
.moyenne-insuffisant { background: #f5c6cb; color: #721c24; }
.moyenne-na { background: #e9ecef; color: #6c757d; }

.resultat-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

.resultat-admis { background: #d4edda; color: #155724; }
.resultat-non-admis { background: #f8d7da; color: #721c24; }
.resultat-na { background: #e9ecef; color: #6c757d; }

.releves-links {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #e0e0e0;
}

.releves-links h4 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.btn-releve {
  background: white;
  border: 2px solid #667eea;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
  text-align: left;
}

.btn-releve:hover {
  background: #667eea;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.releve-icon {
  font-size: 32px;
}

.btn-releve strong {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

.btn-releve p {
  margin: 0;
  font-size: 13px;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
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
