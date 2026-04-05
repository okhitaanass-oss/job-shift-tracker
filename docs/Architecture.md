# Architecture Technique - Job Shift Tracker

## 1. Vue d'Ensemble du Système
Système distribué orienté événements pour garantir la scalabilité et le temps réel.

- **Frontend** : Next.js 14+ (App Router), Tailwind CSS (UI), Framer Motion (Animations), Socket.io-client (Real-time).
- **Backend (API)** : Node.js / Express (TypeScript).
- **Temps Réel** : WebSockets (Socket.io) avec adaptateur Redis pour la scalabilité horizontale.
- **Base de Données** : 
  - **PostgreSQL** (Données persistantes : Utilisateurs, Entreprises, Historique de postes).
  - **Redis** (Cache de sessions, Files d'attente pour notifications).
- **IA/NLP** : Microservice Python (FastAPI + LangChain + OpenAI GPT-4o) pour le parsing de profils.

## 2. Modèle de Données (PostgreSQL)
### Tables Principales :
- **Users** : `id, email, name, current_job_id, linkedin_url`
- **Companies** : `id, name, industry, size`
- **Jobs** : `id, title, company_id, user_id, status (ACTIVE/RELEASED), date_started, date_ended`
- **Notifications** : `id, recruiter_id, job_id, type, is_read, timestamp`

## 3. Flux de Données en Temps Réel
1. L'utilisateur met à jour son poste via le formulaire.
2. Le Backend enregistre le changement dans PostgreSQL.
3. Le Backend émet un événement `job_released` via Socket.io.
4. Le Dashboard Recruteur reçoit l'événement instantanément et met à jour l'UI sans rechargement.

## 4. Stratégie MVP
- **Sprint 1** : Core API (Auth, Job Update) + WebSocket setup.
- **Sprint 2** : Dashboard Recruteur (Live Feed + Search).
- **Sprint 3** : Module IA (LinkedIn Profile Parsing) + Notifications.
