# Spindel Eye Onboarding - Android Application

Complete 10-Day Intensive Foundational Onboarding Course for Ophthalmic Technicians - Android Mobile App

## 🌟 Key Application Features

### 1. 📋 10-Day Complete Clinical Curriculum
A rigorously structured module-by-module educational dashboard:

- **Day 1**: Foundations & The Elite Workup
- **Day 2**: Visual Acuity & Clinic Safety
- **Day 3**: Basic Eye Anatomy & Physiology
- **Day 4**: Triage & High-Stakes Scenarios
- **Day 5**: Exam Room Skills & Visual Fields
- **Day 6**: Essential Diagnostic Testing
- **Day 7**: Refraction & Slit Lamp Mechanics
- **Day 8**: Tonometry & Common Eye Diseases
- **Day 9**: Professional Skills & Patient Care
- **Day 10**: Clinical Simulation Capstone

### 2. ⚡ Dynamic Top Course Quick Selector
Interactive horizontal navigation rail with live status indicators (Locked, Play, In-Progress, Star, Completed).

### 3. 🔐 Administrative Access & Developer Portal
Secure authentication console for instructors and administrators to bypass course locks and test modules.

### 4. 🗄️ Offline-First Architecture & Sync
- **Room Database**: SQLite transactional storage
- **Simulation Handshake Sync**: Integration with secure clinic databases

## 🛠️ Technology Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Material Design 3)
- **Asynchronous Engine**: Kotlin Coroutines & Flows
- **Data Persistence**: Room ORM
- **Dependency Injection**: Constructor Injection
- **Testing**: Robolectric & Roborazzi

## 🚀 Getting Started

### Prerequisites
- Android Studio (Ladybug / Koala or later)
- JDK 17 or JDK 21

### Local Build
```bash
gradle assembleDebug
```

### Testing
```bash
# Run unit tests
gradle :app:testDebugUnitTest

# Run visual validation tests
gradle :app:verifyRoborazziDebug
```

## 📂 Project Structure

```
mobile/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/spindeleye/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   ├── data/
│   │   │   │   ├── model/
│   │   │   │   └── viewmodel/
│   │   │   └── res/
│   │   └── test/
│   └── build.gradle.kts
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

## 🔗 Integration with Backend

The mobile app connects to the Express backend server located in `/server`. Key integration points:

- **API Endpoint Base**: Configured in `gradle.properties`
- **Authentication**: Uses JWT tokens from the shared backend
- **Data Sync**: Offline-first with periodic sync to backend
- **Shared Models**: Located in `/shared` for type consistency

## 📖 Admin Access

**Default Admin Credentials:**
- Email: `admin@spindeleye.com`
- Password: `admin123`

Use admin portal to:
- Bypass course locks
- Bulk complete curriculum
- Test modules directly
- Verify progress tracking

## 🤝 Contributing

When making changes to the Android app:
1. Ensure Kotlin code follows standard Android best practices
2. Run tests: `gradle :app:testDebugUnitTest`
3. Update shared types in `/shared` if schema changes
4. Commit with clear messages referencing the curriculum module

## 📝 License

MIT License - See LICENSE file in root repository
