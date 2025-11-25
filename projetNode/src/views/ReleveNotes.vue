<template>
  <div class="page-container">
    <header class="page-header no-print">
      <div class="header-content">
        <button @click="goBack" class="btn-back">← Retour</button>
        <h1>Relevé de Notes</h1>
        <div class="header-actions">
          <button @click="printReleve" class="btn btn-print">🖨️ Imprimer</button>
          <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="page-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement du relevé...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Relevé de notes ITU Style -->
      <div v-else class="releve-document" ref="releveContent">
        <!-- En-tête ITU -->
        <div class="releve-header">
          <div class="logo-section">
            <div class="itu-logo">ITU</div>
            <div class="university-name">
              <h1>INSTITUT DES TECHNOLOGIES DE L'UNIVERSITÉ</h1>
              <p>IT UNIVERSITY</p>
            </div>
          </div>
          <div class="document-title">
            <h2>RELEVÉ DE NOTES</h2>
            <p>Academic Transcript</p>
          </div>
        </div>

        <!-- Informations étudiant -->
        <div class="student-section">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Prénom(s):</span>
              <span class="info-value">{{ etudiant.prenom }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Né(e) le :</span>
              <span class="info-value">{{ etudiant.dateNaissance || '06/02/2005' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">N° d'inscription:</span>
              <span class="info-value">{{ String(etudiant.idEtudiant).padStart(6, '0') }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Inscrit(e) en</span>
              <span class="info-value">{{ etudiant.parcours }}</span>
            </div>
          </div>
          <p class="achievement-text">a obtenu les notes suivantes:</p>
        </div>

        <!-- Notes par semestre -->
        <div v-for="(semestre, index) in semestres" :key="semestre.id" class="semestre-section">
          <div class="semestre-title">
            <h3>{{ semestre.nom }}</h3>
          </div>

          <table class="notes-table">
            <thead>
              <tr>
                <th class="col-ue">UE</th>
                <th class="col-intitule">Intitulé</th>
                <th class="col-credits">Crédits</th>
                <th class="col-note">Note/20</th>
                <th class="col-resultat">Résultat</th>
                <th class="col-session">Session</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="note in semestre.notes" :key="note.idMatiere">
                <td class="col-ue">{{ note.codeMatiere }}</td>
                <td class="col-intitule">{{ note.nomMatiere }}</td>
                <td class="col-credits text-center">{{ note.credits }}</td>
                <td class="col-note text-center font-weight-bold">{{ note.note?.toFixed(2) || '-' }}</td>
                <td class="col-resultat text-center">
                  <span :class="getResultatClass(note.note)">
                    {{ getResultatLabel(note.note) }}
                  </span>
                </td>
                <td class="col-session text-center">{{ note.session || '04/2025' }}</td>
              </tr>

              <!-- Ligne de total du semestre -->
              <tr class="semestre-total-row">
                <td colspan="2" class="text-right font-weight-bold">{{ semestre.nom.toUpperCase() }}</td>
                <td class="text-center font-weight-bold">{{ semestre.totalCredits }}</td>
                <td class="text-center font-weight-bold text-primary">{{ semestre.moyenne?.toFixed(2) || '-' }}</td>
                <td class="text-center">
                  <span :class="getSemestreResultatClass(semestre.moyenne)">
                    {{ getSemestreResultatLabel(semestre.moyenne) }}
                  </span>
                </td>
                <td class="text-center">{{ semestre.session || '04/2025' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Résultat global -->
        <div class="resultat-section">
          <div class="resultat-grid">
            <div class="resultat-item">
              <span class="resultat-label">Résultat :</span>
              <span class="resultat-value">Crédits:</span>
            </div>
            <div class="resultat-item">
              <span class="resultat-value">{{ totalCredits }}</span>
            </div>
            <div class="resultat-item">
              <span class="resultat-label">Moyenne générale:</span>
              <span class="resultat-value font-large">{{ moyenneGenerale?.toFixed(3) || '0.000' }}</span>
            </div>
            <div class="resultat-item">
              <span class="resultat-label">Mention:</span>
              <span class="resultat-value">{{ getMention(moyenneGenerale) }}</span>
            </div>
            <div class="resultat-item">
              <span class="resultat-label">ADMIS(E)</span>
            </div>
            <div class="resultat-item">
              <span class="resultat-label">Session:</span>
              <span class="resultat-value">06/2025</span>
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <div class="releve-footer">
          <p class="footer-text">Fait à Antananarivo, le {{ dateJour }}</p>
          <p class="footer-signature">Le Recteur de l'IT University</p>
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
const releveContent = ref(null);

const props = defineProps({
  idEtudiant: {
    type: [String, Number],
    required: true
  },
  niveau: {
    type: String,
    required: true,
    validator: (value) => ['L1', 'L2'].includes(value)
  }
});

const etudiant = ref({});
const notes = ref([]);
const semestres = ref([]);
const loading = ref(true);
const error = ref('');

const dateJour = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

const totalCredits = computed(() => {
  return semestres.value.reduce((sum, sem) => sum + (sem.totalCredits || 0), 0);
});

const moyenneGenerale = computed(() => {
  if (semestres.value.length === 0) return 0;
  const sum = semestres.value.reduce((acc, sem) => acc + (sem.moyenne || 0), 0);
  return sum / semestres.value.length;
});

onMounted(async () => {
  await loadReleveData();
});

const loadReleveData = async () => {
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

    // Déterminer les semestres à charger selon le niveau
    const semestresIds = props.niveau === 'L1' ? [1, 2] : [3, 4];

    // Charger les notes
    let notesResponse;
    if (isAdmin) {
      notesResponse = await notesService.getNotesEtudiant(props.idEtudiant);
    } else {
      notesResponse = await notesService.getMesNotes();
    }

    const allNotes = notesResponse.data || [];
    notes.value = allNotes.filter(n => semestresIds.includes(n.idSemestre));

    if (notes.value.length > 0) {
      const firstNote = notes.value[0];
      etudiant.value = {
        idEtudiant: firstNote.idEtudiant,
        nom: firstNote.nomEtudiant,
        prenom: firstNote.prenomEtudiant,
        parcours: firstNote.nomParcours,
        dateNaissance: '06/02/2005' // TODO: récupérer depuis l'API si disponible
      };
    }

    // Charger les moyennes
    let moyennesResponse;
    if (isAdmin) {
      moyennesResponse = await notesService.getAllMoyennes();
      const allMoyennes = moyennesResponse.data || [];
      const etudiantMoyennes = allMoyennes.filter(m => 
        m.idEtudiant === parseInt(props.idEtudiant) && 
        semestresIds.includes(m.idSemestre)
      );
      
      // Organiser par semestre
      semestres.value = semestresIds.map(semId => {
        const semNotes = notes.value.filter(n => n.idSemestre === semId);
        const semMoyenne = etudiantMoyennes.find(m => m.idSemestre === semId);

        return {
          id: semId,
          nom: semMoyenne?.nomSemestre || `Semestre ${semId}`,
          notes: semNotes,
          totalCredits: semMoyenne?.totalCredits || semNotes.reduce((sum, n) => sum + (n.credits || 0), 0),
          moyenne: semMoyenne?.moyenneSemestre,
          session: '04/2025'
        };
      });
    } else {
      moyennesResponse = await notesService.getMesMoyennes();
      const mesMoyennes = (moyennesResponse.data || []).filter(m => semestresIds.includes(m.idSemestre));

      semestres.value = semestresIds.map(semId => {
        const semNotes = notes.value.filter(n => n.idSemestre === semId);
        const semMoyenne = mesMoyennes.find(m => m.idSemestre === semId);

        return {
          id: semId,
          nom: semMoyenne?.nomSemestre || `Semestre ${semId}`,
          notes: semNotes,
          totalCredits: semMoyenne?.totalCredits || semNotes.reduce((sum, n) => sum + (n.credits || 0), 0),
          moyenne: semMoyenne?.moyenneSemestre,
          session: '04/2025'
        };
      });
    }

  } catch (err) {
    error.value = 'Erreur lors du chargement du relevé';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getResultatClass = (note) => {
  if (!note) return 'resultat-na';
  if (note >= 10) return 'resultat-p';
  return 'resultat-comp';
};

const getResultatLabel = (note) => {
  if (!note) return '-';
  if (note >= 16) return 'TB';
  if (note >= 14) return 'B';
  if (note >= 12) return 'AB';
  if (note >= 10) return 'P';
  return 'Comp';
};

const getSemestreResultatClass = (moyenne) => {
  if (!moyenne) return '';
  if (moyenne >= 10) return 'resultat-admis';
  return 'resultat-ajourné';
};

const getSemestreResultatLabel = (moyenne) => {
  if (!moyenne) return '-';
  if (moyenne >= 10) return 'Passable';
  return 'Ajourné';
};

const getMention = (moyenne) => {
  if (!moyenne) return '-';
  if (moyenne >= 16) return 'Très Bien';
  if (moyenne >= 14) return 'Bien';
  if (moyenne >= 12) return 'Assez Bien';
  return 'Passable';
};

const printReleve = () => {
  window.print();
};

const goBack = () => {
  router.push(`/etudiants/${props.idEtudiant}`);
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-back,
.btn-logout,
.btn-print {
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
.btn-logout:hover,
.btn-print:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Style relevé ITU */
.releve-document {
  background: white;
  padding: 40px 50px;
  border: 2px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Times New Roman', serif;
}

.releve-header {
  border-bottom: 3px solid #000;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.itu-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  border-radius: 8px;
}

.university-name h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.university-name p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.document-title {
  text-align: center;
}

.document-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  letter-spacing: 2px;
}

.document-title p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.student-section {
  margin-bottom: 30px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 10px;
}

.info-label {
  font-weight: 600;
  color: #000;
  min-width: 140px;
}

.info-value {
  color: #333;
}

.achievement-text {
  margin: 20px 0 10px;
  font-style: italic;
  color: #333;
}

.semestre-section {
  margin-bottom: 30px;
}

.semestre-title {
  background: #f0f0f0;
  padding: 12px 16px;
  border-left: 4px solid #667eea;
  margin-bottom: 10px;
}

.semestre-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
}

.notes-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.notes-table th,
.notes-table td {
  border: 1px solid #333;
  padding: 8px 10px;
  font-size: 13px;
}

.notes-table th {
  background: #e0e0e0;
  font-weight: 700;
  text-align: center;
  color: #000;
}

.col-ue { width: 10%; }
.col-intitule { width: 35%; }
.col-credits { width: 10%; }
.col-note { width: 12%; }
.col-resultat { width: 13%; }
.col-session { width: 12%; }

.text-center { text-align: center; }
.text-right { text-align: right; }
.font-weight-bold { font-weight: 700; }
.text-primary { color: #667eea; }
.font-large { font-size: 15px; }

.semestre-total-row {
  background: #f8f8f8;
  font-weight: 700;
}

.resultat-p { color: #155724; }
.resultat-comp { color: #721c24; }
.resultat-na { color: #6c757d; }
.resultat-admis { color: #155724; font-weight: 700; }
.resultat-ajourné { color: #721c24; font-weight: 700; }

.resultat-section {
  border-top: 3px solid #000;
  padding-top: 20px;
  margin-top: 30px;
}

.resultat-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 12px 40px;
}

.resultat-item {
  display: flex;
  gap: 10px;
}

.resultat-label {
  font-weight: 600;
  color: #000;
}

.resultat-value {
  color: #333;
}

.releve-footer {
  margin-top: 50px;
  text-align: right;
}

.footer-text {
  margin: 0 0 40px;
  font-style: italic;
  color: #333;
}

.footer-signature {
  margin: 0;
  font-weight: 700;
  color: #000;
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

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .page-container {
    background: white;
  }

  .page-main {
    padding: 0;
    max-width: none;
  }

  .releve-document {
    box-shadow: none;
    padding: 20px;
  }
}
</style>
