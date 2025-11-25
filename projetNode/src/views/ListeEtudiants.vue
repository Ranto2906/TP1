<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <button @click="goBack" class="btn-back">← Retour</button>
        <h1>{{ semestreNom }} - Liste des Étudiants</h1>
        <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
      </div>
    </header>

    <main class="page-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des étudiants...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else class="table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th>N° Étudiant</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Parcours</th>
              <th class="text-center">Moyenne S1</th>
              <th class="text-center">Moyenne S2</th>
              <th class="text-center">Moyenne S3</th>
              <th class="text-center">Moyenne S4</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="etudiant in etudiants" :key="etudiant.idEtudiant">
              <td>{{ etudiant.idEtudiant }}</td>
              <td class="text-bold">{{ etudiant.nom }}</td>
              <td>{{ etudiant.prenom }}</td>
              <td>
                <span class="badge">{{ etudiant.parcours }}</span>
              </td>
              <td 
                class="text-center moyenne-cell"
                @click="goToReleve(etudiant.idEtudiant, 1)"
              >
                <span class="moyenne-link">
                  {{ etudiant.moyenneS1?.toFixed(2) || '-' }}
                </span>
              </td>
              <td 
                class="text-center moyenne-cell"
                @click="goToReleve(etudiant.idEtudiant, 2)"
              >
                <span class="moyenne-link">
                  {{ etudiant.moyenneS2?.toFixed(2) || '-' }}
                </span>
              </td>
              <td 
                class="text-center moyenne-cell"
                @click="goToReleve(etudiant.idEtudiant, 3)"
              >
                <span class="moyenne-link">
                  {{ etudiant.moyenneS3?.toFixed(2) || '-' }}
                </span>
              </td>
              <td 
                class="text-center moyenne-cell"
                @click="goToReleve(etudiant.idEtudiant, 4)"
              >
                <span class="moyenne-link">
                  {{ etudiant.moyenneS4?.toFixed(2) || '-' }}
                </span>
              </td>
              <td class="text-center">
                <button 
                  @click="goToFiche(etudiant.idEtudiant)"
                  class="btn btn-sm btn-primary"
                >
                  Voir la fiche
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="etudiants.length === 0" class="empty-state">
          <div class="empty-icon">👨‍🎓</div>
          <h3>Aucun étudiant trouvé</h3>
          <p>Il n'y a pas d'étudiants inscrits à ce semestre.</p>
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
  idSemestre: {
    type: [String, Number],
    required: true
  }
});

const etudiants = ref([]);
const semestreNom = ref('');
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  await loadEtudiants();
});

const loadEtudiants = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Charger toutes les moyennes
    const response = await notesService.getAllMoyennes();
    const moyennes = response.data || [];

    // Grouper par étudiant
    const etudiantsMap = new Map();

    moyennes.forEach(moy => {
      if (!etudiantsMap.has(moy.idEtudiant)) {
        etudiantsMap.set(moy.idEtudiant, {
          idEtudiant: moy.idEtudiant,
          nom: moy.nomEtudiant,
          prenom: moy.prenomEtudiant,
          parcours: moy.nomParcours,
          moyenneS1: null,
          moyenneS2: null,
          moyenneS3: null,
          moyenneS4: null
        });
      }

      const etudiant = etudiantsMap.get(moy.idEtudiant);
      
      // Associer les moyennes par semestre
      if (moy.idSemestre === 1) etudiant.moyenneS1 = moy.moyenneSemestre;
      else if (moy.idSemestre === 2) etudiant.moyenneS2 = moy.moyenneSemestre;
      else if (moy.idSemestre === 3) etudiant.moyenneS3 = moy.moyenneSemestre;
      else if (moy.idSemestre === 4) etudiant.moyenneS4 = moy.moyenneSemestre;

      // Mémoriser le nom du semestre si c'est celui qu'on affiche
      if (moy.idSemestre === parseInt(props.idSemestre)) {
        semestreNom.value = moy.nomSemestre;
      }
    });

    etudiants.value = Array.from(etudiantsMap.values()).sort((a, b) => 
      a.nom.localeCompare(b.nom)
    );

  } catch (err) {
    error.value = 'Erreur lors du chargement des étudiants';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goToFiche = (idEtudiant) => {
  router.push(`/etudiants/${idEtudiant}`);
};

const goToReleve = (idEtudiant, semestre) => {
  // Déterminer le niveau (L1 = S1+S2, L2 = S3+S4)
  const niveau = semestre <= 2 ? 'L1' : 'L2';
  router.push(`/etudiants/${idEtudiant}/releve/${niveau}`);
};

const goBack = () => {
  router.push('/semestres');
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
  padding: 20px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .page-header {
    padding: 24px 48px;
  }
}

@media (min-width: 1024px) {
  .page-header {
    padding: 28px 64px;
  }
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  flex: 1;
  text-align: center;
}

@media (min-width: 768px) {
  .header-content h1 {
    font-size: 26px;
  }
}

@media (min-width: 1024px) {
  .header-content h1 {
    font-size: 30px;
  }
}

.btn-back,
.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .btn-back,
  .btn-logout {
    padding: 10px 18px;
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  .btn-back,
  .btn-logout {
    padding: 12px 24px;
    font-size: 15px;
    border-radius: 10px;
  }
}

.btn-back:hover,
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.page-main {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 24px;
}

@media (min-width: 768px) {
  .page-main {
    padding: 48px 32px;
  }
}

@media (min-width: 1024px) {
  .page-main {
    padding: 56px 48px;
  }
}

.table-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .table-container {
    padding: 28px;
  }
}

@media (min-width: 1024px) {
  .table-container {
    padding: 36px;
    border-radius: 20px;
  }
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

@media (min-width: 768px) {
  .students-table {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .students-table {
    font-size: 16px;
  }
}

.students-table th,
.students-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .students-table th,
  .students-table td {
    padding: 16px 14px;
  }
}

@media (min-width: 1024px) {
  .students-table th,
  .students-table td {
    padding: 18px 16px;
  }
}

.students-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #2d3748;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

@media (min-width: 768px) {
  .students-table th {
    font-size: 13px;
  }
}

@media (min-width: 1024px) {
  .students-table th {
    font-size: 14px;
  }
}

.students-table tbody tr {
  transition: background 0.2s;
}

.students-table tbody tr:hover {
  background: #f8f9fa;
}

.text-center {
  text-align: center !important;
}

.text-bold {
  font-weight: 600;
  color: #333;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  background: #e0e7ff;
  color: #4c51bf;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

@media (min-width: 768px) {
  .badge {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 16px;
  }
}

@media (min-width: 1024px) {
  .badge {
    padding: 7px 16px;
    font-size: 13px;
  }
}

.moyenne-cell {
  cursor: pointer;
}

.moyenne-link {
  display: inline-block;
  padding: 6px 12px;
  font-weight: 700;
  color: #667eea;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

@media (min-width: 768px) {
  .moyenne-link {
    padding: 8px 14px;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .moyenne-link {
    padding: 10px 16px;
    font-size: 16px;
    border-radius: 10px;
  }
}

.moyenne-link:hover {
  background: #eef2ff;
  color: #5568d3;
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .btn {
    padding: 10px 18px;
    font-size: 13px;
  }
}

@media (min-width: 1024px) {
  .btn {
    padding: 12px 22px;
    font-size: 14px;
    border-radius: 10px;
  }
}

.btn-sm {
  padding: 6px 10px;
  font-size: 11px;
}

@media (min-width: 768px) {
  .btn-sm {
    padding: 8px 14px;
    font-size: 12px;
  }
}

@media (min-width: 1024px) {
  .btn-sm {
    padding: 10px 18px;
    font-size: 13px;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.35);
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
