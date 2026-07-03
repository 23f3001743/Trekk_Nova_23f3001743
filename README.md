# TrekkNova 🏔️

A trekking management web application that connects trekkers with curated trekking packages, managed by admins and trek guides.

## About

TrekkNova lets users browse and book trekking packages across different regions and difficulty levels. The platform has three types of users — Admin, Trek Guide, and Trekker — each with their own dashboard and permissions.

## Tech Stack

- **Backend:** Flask, SQLAlchemy
- **Frontend:** Vue.js (CDN), Bootstrap
- **Database:** SQLite
- **Caching:** Redis
- **Background Jobs:** Celery + Celery Beat
- **Authentication:** JWT

## Roles

- **Admin** — Creates and manages treks, assigns guides, manages trekkers
- **Trek Guide (Staff)** — Manages assigned treks and participant lists
- **Trekker** — Browses, books, and tracks trekking trips

## Project Status

🚧 Work in progress — building milestone by milestone.

- [done] Milestone 0 — GitHub Setup
- [done ] Database Models and Schema
- [done ] Authentication and Role-Based Access
- [done ] Admin Dashboard
- [done] Trek Guide Dashboard
- [done ] Trekker Dashboard and Booking System
- [done ] Booking History and Status Tracking
- [ ] Celery Background Jobs
- [ ] Redis Caching

