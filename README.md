# Job Shift Tracker - Guide de Lancement Rapide

Ce SaaS est maintenant un prototype fonctionnel avec communication en temps réel entre le formulaire utilisateur et le dashboard recruteur.

## 1. Lancer le Backend
Allez dans le dossier `backend` et installez les dépendances :
```bash
cd backend
npm install
npm start
```
Le serveur tournera sur `http://localhost:5000`.

## 2. Lancer le Frontend
Vous pouvez ouvrir directement les fichiers HTML dans votre navigateur :
- **Dashboard Recruteur** : `frontend/DashboardRecruteur.html`
- **Formulaire Utilisateur** : `frontend/FormulaireUtilisateur.html`

## 3. Tester le flux en temps réel
1. Ouvrez les deux pages HTML côte à côte.
2. Remplissez le formulaire de changement de poste.
3. Observez le Dashboard Recruteur : il se mettra à jour instantanément sans recharger la page, affichant une notification d'alerte urgente.

## Prochaines Étapes prévues :
- **Persistance** : Remplacer l'objet `jobs` en mémoire par une base de données PostgreSQL.
- **Authentification** : Ajouter une connexion sécurisée pour les recruteurs.
- **Parsing LinkedIn** : Connecter le script IA pour remplir automatiquement le formulaire.
