# Mumma Bear

> Reduce Mum's mental load.

Mumma Bear is an Android-first postpartum and baby companion designed to make everyday care easier for new mothers.

The app brings baby tracking, postpartum recovery, appointments, reminders, age-aware guidance, recipes, and practical care guides into one calm and accessible mobile experience.

Built with Angular, Ionic, TypeScript, and Capacitor, Mumma Bear is designed around a simple UX principle:

> The app does the work; Mum confirms.

Frequent actions are designed to pass the "3-AM test" — one-handed, few taps, minimal typing, no mental arithmetic, and no need to remember previous information.

---

## 📱 App Preview

<!-- Screenshots will be added here -->

Coming soon.

---

## ✨ Features

### Baby Tracking

- Feeding tracking
- Breastfeeding sessions
- Formula feeding
- Pumping sessions
- Pumped milk tracking
- Diaper tracking
- Sleep tracking
- Growth recording

### Mum's Recovery

Simple postpartum recovery check-ins designed to avoid creating additional mental load.

Users can quickly record how they are feeling using a lightweight Better / Same / Worse flow.

### 📅 Appointments & Reminders

- Appointment management
- In-app reminders
- Doctor questions
- Vaccination-related organization
- Persistent appointment and reminder data

### 👶 Around This Age

Baby development content adapts according to the baby's age.

Rather than using competitive milestone scoring, Mumma Bear presents development guidance as:

> Around this age...

Content progresses through stages such as:

- Coming Home
- Survive & Recover
- Finding a Rhythm
- Growing & Changing
- Starting Solids
- Exploring Everything
- Approaching One

### 🍼 Show Me How

Illustrated step-by-step practical guides for common baby-care activities.

Guides include:

- Burping
- Swaddling
- Cord care
- Diaper changing
- Bathing
- Safe sleep
- Tummy time
- Bottle feeding
- Pump setup
- Starting solids
- Cup introduction
- Baby-proofing

### 🍽️ Recipes

Age-aware recipe content for both Mum and Baby.

The recipe experience includes:

- Mum and Baby sections
- Image-first recipe cards
- Ingredients
- Step-by-step instructions
- Baby age relevance based on stored date of birth

---

## 🏠 Contextual Home

The Today screen acts as the contextual home of the application.

Instead of functioning as another feature catalogue, it brings together information that matters now based on stored Mum and baby information and recent activity.

Today connects to key areas including:

- Pump
- Feed
- Diaper
- Sleep
- Appointments

---

## 🛠️ Tech Stack

### Frontend & Mobile

- Angular
- Ionic
- TypeScript
- HTML
- SCSS
- Capacitor

### Development

- VS Code
- Git
- GitHub
- Android Studio

### Platform

- Android-first mobile development
- Physical Android device testing

---

## 🏗️ Application Architecture

Mumma Bear uses Ionic for the root application and routing shell, while feature-page interfaces are primarily built with Angular HTML and SCSS.

The application uses:

- Standalone Angular components
- Angular dependency injection with `inject()`
- Shared application-level navigation
- Persistent local application data
- Feature-based pages and services
- Reusable UI patterns

The global navigation is managed at the application-shell level rather than being duplicated across individual pages.

---

## 🧭 Main Navigation

The application is organized around five primary areas:

**Today** — What matters now  
**Baby** — Tracking, development, growth and practical guidance  
**Me** — Recovery, nutrition and postpartum support  
**Reminders** — Appointments and reminders  
**More** — Secondary features, profile and settings

---

## 💾 Persistent Tracking

Mumma Bear maintains local data across the application's core tracking experiences.

This includes information related to:

- Pumping
- Pumped milk
- Feeding
- Diapers
- Sleep
- Growth
- Recovery check-ins
- Appointments
- Reminders
- Mum and baby information

This allows recent activity and user context to remain available throughout the application.

---

## 📱 Real-Device Development

Mumma Bear is actively tested on a physical Android device rather than relying only on browser-based development.

Real-device testing has been used to identify and improve issues involving:

- Scrolling behavior
- Navigation
- Tap-target sizes
- Font readability
- Persistent page state
- Mobile layout behavior
- Bottom navigation
- Android safe areas

Typical development flow:

```text
Angular Development
       ↓
ng build
       ↓
Capacitor Sync
       ↓
Android Studio
       ↓
Physical Android Device
