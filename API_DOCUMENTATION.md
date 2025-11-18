# Documentation API - Format JSON

## Format de réponse standard

Tous les endpoints suivent le **modèle robuste** avec le format suivant :

### Succès

```json
{
  "status": "success",
  "data": {
    // Les données de la réponse ici
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0",
    "academicYear": "2024-2025"
  }
}
```

### Erreur

```json
{
  "status": "error",
  "error": {
    "code": "ERR_XXX",
    "message": "Message d'erreur explicite pour l'utilisateur",
    "details": "Informations techniques supplémentaires (optionnel)"
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

## Conventions de nommage

- ✅ **camelCase** pour toutes les propriétés JSON
- ✅ Propriétés en anglais
- ✅ Noms descriptifs et clairs

### Exemples :
- ✅ `firstName` (et non `first_name` ou `FirstName`)
- ✅ `studentNumber` (et non `student_number`)
- ✅ `averageGrade` (et non `average_grade`)

## Codes d'erreur

### Authentification (AUTH_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `AUTH_001` | 401 | Email ou mot de passe incorrect | Identifiants invalides |
| `AUTH_002` | 403 | Compte désactivé | Le compte n'est pas actif |
| `AUTH_003` | 401 | Token manquant ou invalide | Authorization header absent ou malformé |
| `AUTH_004` | 401 | Token expiré | Le token JWT a expiré |

### Étudiant (STU_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `STU_001` | 404 | Étudiant non trouvé | L'ID étudiant n'existe pas |
| `STU_002` | 403 | Accès non autorisé | L'étudiant n'a pas accès à cette ressource |

### Semestre (SEM_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `SEM_001` | 400 | Semestre invalide | Le semestre demandé n'existe pas (valeurs: 1-4) |

### Année (YEAR_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `YEAR_001` | 400 | Année invalide | L'année demandée n'existe pas (valeurs: L1, L2) |

### Base de données (DB_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `DB_001` | 503 | Erreur de connexion à la base de données | Impossible de se connecter à la BDD |
| `DB_002` | 504 | Timeout de la base de données | La requête a pris trop de temps |

### Validation (VAL_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `VAL_001` | 400 | Paramètres invalides | Les paramètres de la requête sont incorrects |
| `VAL_002` | 400 | Champ requis manquant | Un champ obligatoire est absent |

### Système (SYS_XXX)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `SYS_001` | 500 | Erreur système imprévue | Une erreur non gérée s'est produite |

## Endpoints détaillés

### 1. POST /api/auth/login

Authentification et génération de token JWT.

**Request:**
```json
{
  "email": "jean.rakoto@univ.mg",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjEsImlhdCI6MTYzOTU3ODAwMCwiZXhwIjoxNjM5NjY0NDAwfQ.abc123",
    "expiresIn": "24h",
    "student": {
      "id": 1,
      "firstName": "Jean",
      "lastName": "Rakoto",
      "email": "jean.rakoto@univ.mg",
      "studentNumber": "ETU2024001"
    }
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

**Response Error (401):**
```json
{
  "status": "error",
  "error": {
    "code": "AUTH_001",
    "message": "Email ou mot de passe incorrect",
    "details": "Vérifiez vos identifiants et réessayez"
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

---

### 2. GET /api/students/{studentId}/semesters/{semesterId}/grades

Récupérer les notes d'un étudiant pour un semestre.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `studentId` (integer): ID de l'étudiant
- `semesterId` (integer): ID du semestre (1, 2, 3, ou 4)

**Response Success (200):**
```json
{
  "status": "success",
  "data": {
    "student": {
      "id": 1,
      "firstName": "Jean",
      "lastName": "Rakoto",
      "studentNumber": "ETU2024001"
    },
    "semester": {
      "id": 4,
      "label": "S4"
    },
    "track": {
      "id": 1,
      "label": "Développeur"
    },
    "grades": [
      {
        "subject": {
          "code": "ALG401",
          "label": "Algorithmique avancée",
          "credits": 4.0,
          "type": "obligatoire"
        },
        "grade": 15.5,
        "session": "Session normale"
      },
      {
        "subject": {
          "code": "PRG401",
          "label": "Programmation orientée objet",
          "credits": 5.0,
          "type": "obligatoire"
        },
        "grade": 12.0,
        "session": "Session normale"
      },
      {
        "subject": {
          "code": "SYS401",
          "label": "Systèmes d'exploitation",
          "credits": 3.0,
          "type": "obligatoire"
        },
        "grade": 14.0,
        "session": "Session normale"
      }
    ],
    "summary": {
      "averageGrade": 13.83,
      "totalCredits": 12.0,
      "obtainedCredits": 12.0,
      "status": "Admis"
    }
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0",
    "academicYear": "2024-2025"
  }
}
```

**Response Error - Étudiant inexistant (404):**
```json
{
  "status": "error",
  "error": {
    "code": "STU_001",
    "message": "Étudiant non trouvé",
    "details": "L'ID étudiant 9999 n'existe pas dans la base de données"
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

**Response Error - Token manquant (401):**
```json
{
  "status": "error",
  "error": {
    "code": "AUTH_003",
    "message": "Token manquant ou invalide",
    "details": "Veuillez vous authentifier pour accéder à cette ressource"
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

---

### 3. GET /api/students/{studentId}/years/{yearLevel}/grades

Récupérer les notes d'un étudiant pour une année complète.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `studentId` (integer): ID de l'étudiant
- `yearLevel` (string): Niveau de l'année ("L1" ou "L2")
  - L1 = S1 + S2
  - L2 = S3 + S4

**Response Success (200):**
```json
{
  "status": "success",
  "data": {
    "student": {
      "id": 1,
      "firstName": "Jean",
      "lastName": "Rakoto",
      "studentNumber": "ETU2024001"
    },
    "yearLevel": "L2",
    "semesters": [
      {
        "semester": {
          "id": 3,
          "label": "S3"
        },
        "grades": [
          {
            "subject": {
              "code": "ALG301",
              "label": "Structures de données",
              "credits": 5.0
            },
            "grade": 13.5,
            "session": "Session normale"
          },
          {
            "subject": {
              "code": "WEB301",
              "label": "Développement Web",
              "credits": 4.0
            },
            "grade": 11.5,
            "session": "Session normale"
          }
        ],
        "summary": {
          "averageGrade": 12.5,
          "totalCredits": 30.0,
          "obtainedCredits": 28.0,
          "status": "Admis"
        }
      },
      {
        "semester": {
          "id": 4,
          "label": "S4"
        },
        "track": {
          "id": 1,
          "label": "Développeur"
        },
        "grades": [
          {
            "subject": {
              "code": "ALG401",
              "label": "Algorithmique avancée",
              "credits": 4.0,
              "type": "obligatoire"
            },
            "grade": 15.5,
            "session": "Session normale"
          },
          {
            "subject": {
              "code": "PRG401",
              "label": "Programmation orientée objet",
              "credits": 5.0,
              "type": "obligatoire"
            },
            "grade": 12.0,
            "session": "Session normale"
          }
        ],
        "summary": {
          "averageGrade": 13.83,
          "totalCredits": 30.0,
          "obtainedCredits": 30.0,
          "status": "Admis"
        }
      }
    ],
    "yearSummary": {
      "overallAverage": 13.17,
      "totalCredits": 60.0,
      "obtainedCredits": 58.0,
      "status": "Admis"
    }
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0",
    "academicYear": "2024-2025"
  }
}
```

**Response Error - Année invalide (400):**
```json
{
  "status": "error",
  "error": {
    "code": "YEAR_001",
    "message": "Année invalide",
    "details": "L'année doit être 'L1' ou 'L2'. Valeur reçue: 'L5'"
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

---

## Objet Meta

L'objet `meta` contient des informations contextuelles sur la réponse :

```json
{
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0",
    "academicYear": "2024-2025",
    "requestId": "req-12345" // Optionnel
  }
}
```

**Propriétés:**
- `timestamp`: Date et heure de la réponse (ISO 8601)
- `version`: Version de l'API
- `academicYear`: Année universitaire (pour les endpoints de notes)
- `requestId`: Identifiant unique de la requête (optionnel, utile pour le debugging)

## Gestion des erreurs de connexion BDD

En cas d'erreur de connexion à la base de données :

```json
{
  "status": "error",
  "error": {
    "code": "DB_001",
    "message": "Erreur de connexion à la base de données",
    "details": "Le service est temporairement indisponible. Veuillez réessayer dans quelques instants."
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "version": "1.0"
  }
}
```

HTTP Status: **503 Service Unavailable**

## Headers requis

### Requêtes authentifiées

Tous les endpoints (sauf `/api/auth/login`) nécessitent un header d'authentification :

```
Authorization: Bearer {token}
```

### Content-Type

Pour les requêtes POST :

```
Content-Type: application/json
```

## Exemple d'implémentation - Middleware d'erreur

### Node.js / Express

```javascript
// utils/response.js
class ApiResponse {
  static success(data, meta = {}) {
    return {
      status: 'success',
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        ...meta
      }
    };
  }

  static error(code, message, details = null) {
    return {
      status: 'error',
      error: {
        code,
        message,
        ...(details && { details })
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  }
}

module.exports = ApiResponse;

// middleware/errorHandler.js
const ApiResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Erreur de connexion BDD
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json(
      ApiResponse.error(
        'DB_001',
        'Erreur de connexion à la base de données',
        'Le service est temporairement indisponible'
      )
    );
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.error(
        'AUTH_003',
        'Token manquant ou invalide'
      )
    );
  }

  // Erreur par défaut
  return res.status(500).json(
    ApiResponse.error(
      'SYS_001',
      'Erreur système imprévue',
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  );
};

module.exports = errorHandler;
```

### Python / Flask

```python
# utils/response.py
from datetime import datetime

class ApiResponse:
    @staticmethod
    def success(data, meta=None):
        response = {
            'status': 'success',
            'data': data,
            'meta': {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'version': '1.0'
            }
        }
        if meta:
            response['meta'].update(meta)
        return response

    @staticmethod
    def error(code, message, details=None):
        response = {
            'status': 'error',
            'error': {
                'code': code,
                'message': message
            },
            'meta': {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'version': '1.0'
            }
        }
        if details:
            response['error']['details'] = details
        return response

# app.py
from utils.response import ApiResponse

@app.errorhandler(Exception)
def handle_error(error):
    if isinstance(error, pymysql.err.OperationalError):
        return ApiResponse.error(
            'DB_001',
            'Erreur de connexion à la base de données',
            'Le service est temporairement indisponible'
        ), 503
    
    return ApiResponse.error(
        'SYS_001',
        'Erreur système imprévue',
        str(error) if app.debug else None
    ), 500
```

## Tests

Chaque endpoint doit être testé pour :

1. ✅ Le format de réponse est correct (`status`, `data`/`error`, `meta`)
2. ✅ Utilisation de camelCase
3. ✅ Codes HTTP appropriés
4. ✅ Gestion des erreurs avec codes personnalisés
5. ✅ Authentification (token requis)

Utilisez la collection Postman fournie pour effectuer ces tests.
