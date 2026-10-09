# 🎓 Smart Campus Management System

A modern, full-stack web application designed to simplify academic information management for college students. The Smart Campus Management System provides a centralized dashboard where students can view their attendance, subject-wise marks, semester-wise SGPA/CGPA, and class timetables.

The project combines a responsive React frontend with a Java Spring Boot REST API and a MySQL database.

## ✨ Features

### 1. 📊 Student Dashboard
- View a summary of academic performance.
- Access important academic information from one place.
- Navigate easily between academic modules.

### 2. 📅 Attendance Management
- View subject-wise attendance records.
- Track classes attended and total classes conducted.
- Calculate attendance percentages.
- Identify subjects where attendance needs improvement.

### 3. 📝 Subject-wise Marks
- View marks obtained in individual subjects.
- Compare marks across different subjects.
- Track academic performance throughout the semester.

### 4. 🎯 SGPA / CGPA
- View semester-wise SGPA.
- View cumulative CGPA across semesters.
- Display academic results using backend-calculated values.

### 5. 🕒 Timetable Management
- View the weekly class timetable.
- Check subjects, class timings, and classrooms.
- Organize the academic schedule in one place.

## 🛠️ Technology Stack

### Frontend
- **React.js** — User interface
- **Vite** — Development server and build tool
- **Tailwind CSS** — Responsive styling
- **React Router** — Page navigation
- **Axios** — HTTP requests to the backend
- **JavaScript** — Frontend logic

### Backend
- **Java 17 or later** — Programming language
- **Spring Boot** — Backend application framework
- **Spring Web** — REST API development
- **Spring Data JPA** — Database operations
- **Hibernate** — Object-relational mapping
- **Maven** — Dependency and build management

### Database
- **MySQL** — Relational database

## 🏗️ System Architecture

The application follows a client-server architecture with a layered backend.

```text
Smart Campus Management System
             |
     React Frontend
  (Vite + Tailwind CSS)
             |
       Axios / HTTP
             |
    Spring Boot REST API
             |
        Controller
             |
          Service
             |
        Repository
             |
        JPA / Hibernate
             |
          MySQL
```

### Project Structure

```text
smart-campus-management-system/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── [application package]/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       └── config/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── README.md
```

*Note: The directory names above illustrate the intended organization. Adjust them to match the actual project files.*

## ⚙️ Prerequisites

Install the following before running the application:

- Java JDK 17 or later
- Node.js and npm
- MySQL Server
- Visual Studio Code or another suitable code editor
- Git

Verify your installations:

```bash
java -version
node -v
npm -v
git --version
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-campus-management-system.git
cd smart-campus-management-system
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Configure the MySQL Database

Start MySQL and create the database:

```sql
CREATE DATABASE smart_campus;
```

Configure the database connection in the backend's `application.properties` file.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

Set the `DB_PASSWORD` environment variable to your MySQL password before starting the backend. Adjust the configuration to match your existing application properties.

**Security note:** Never commit real database passwords, API keys, or other credentials to GitHub.

### Step 3: Run the Backend

Open a terminal in the backend directory:

```bash
cd backend
```

Run the application using Maven:

```bash
mvn spring-boot:run
```

If the project includes the Maven Wrapper, you can use:

Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend should be available at:

`http://localhost:8080`

### Step 4: Run the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, typically:

`http://localhost:5173`

Open that URL in your browser to access the application.

### Step 5: Connect Frontend and Backend

Ensure that:

- The Spring Boot backend is running on port `8080`.
- The React frontend is running on port `5173`.
- Axios uses the correct backend API base URL.
- Spring Boot CORS configuration allows requests from the frontend origin.
- The MySQL server is running and the database credentials are correct.

## 🔌 API Integration

The frontend communicates with the backend through REST APIs.

The exact endpoints depend on the implementation. A typical API organization may include:

| Module | Example endpoint |
|---|---|
| Student information | `GET /api/students/{id}` |
| Attendance | `GET /api/attendance/student/{studentId}` |
| Subject-wise marks | `GET /api/marks/student/{studentId}` |
| Semester results | `GET /api/results/student/{studentId}` |
| Timetable | `GET /api/timetable/student/{studentId}` |

These are illustrative endpoint examples. Use the actual routes implemented in the backend.

## 🎓 Academic Scope

This project focuses exclusively on four core academic modules:

- Attendance
- Subject-wise marks
- Semester-wise SGPA/CGPA
- Timetable

The system intentionally excludes unrelated modules such as fees, library management, hostel management, assignments, complaints, notices, and campus events.

## 🔒 Security and Data Handling

- Store database credentials outside version-controlled source files.
- Validate incoming data in the backend.
- Handle API errors appropriately.
- Configure CORS for the intended frontend origin.
- Keep academic calculations and authoritative results in the backend.

This project is intended as an academic application. Authentication, authorization, and production security should be implemented and tested before using it with real student records.

## 🔮 Future Improvements

Possible improvements within the existing academic scope include:

- Role-based access for students and authorized academic staff.
- Improved attendance and academic performance visualizations.
- Exportable academic reports.
- Enhanced mobile responsiveness.
- Automated testing and deployment.

## 👨‍💻 Author

**Yasir Malik**

B.Tech — Computer Science Engineering (AI/ML)

## 🎯 Project Purpose

Developed as a full-stack academic project to demonstrate frontend development, REST API integration, Java backend development, relational database management, and software architecture.

## 📄 License

This project is available for educational and learning purposes. Add a `LICENSE` file if you want to specify the terms under which others may use, modify, or distribute the code.

---

⭐ If you find this project useful, consider giving the repository a star!
