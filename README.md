# Testez une application full-stack

## Installation du projet

### Installer la BDD
- Utiliser un éditeur comme **MySQL WorkBench**.
- Créer une connexion avec :
  - **Hostname** : `localhost`
  - **Port** : `3306`
  - **Username** : `root`
  - **Password** : à définir
- Importer ensuite la base à partir du script SQL :  
  📂 `ressources/sql/script.sql`

---

## Front

### Cloner le projet
Dans l’IDE de votre choix, exécutez :
```sh
git clone https://github.com/Yann-Rethore/Testez-une-application-full-stack.git
cd yoga/front
```

### Installer les dépendances
```sh
npm install
```

### Lancer le Front-end
```sh
npm run start
```

---

## Back-end

### Cloner et installer le projet
```sh
git clone https://github.com/Yann-Rethore/Testez-une-application-full-stack.git
cd Testez-une-application-full-stack/Yoga/back
mvn install
```

### Ouvrir le projet dans l’IDE choisi.

---

## Couverture de tests

### Lancer les tests Front-end
Dans le terminal :
```sh
npx jest --coverage
```
Si besoin, configurer **jest** :
```json
moduleNameMapper: {
  "^src/(.*)$": "<rootDir>/src/$1"
}
```
Et **tsconfig.json** :
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "src/*": ["src/*"]
    }
  }
}
```
📂 **Rapport de couverture** :  
`Testez-une-application-full-stack/front/coverage/jest/lcov-report/index.html`

---

### Tests End-to-End (E2E)
#### Exécuter Cypress :
```sh
npx cypress open
```
1. Ouvrir **E2E Testing**.
2. Choisir **Electron** et **Start Testing**.
3. Exécuter la spécification **testE2E**.
📂 **Rapport E2E** :  
`Testez-une-application-full-stack/front/coverage/lcov-report/index.html`

---

### Couverture Back-end
Exécuter les tests avec **JaCoCo** :
```sh
mvn clean test jacoco:report
```
📂 **Rapport de couverture** :  
`Testez-une-application-full-stack/back/target/site/jacoco/index.html`
```

