# Entity Plan & Database Schema Analysis

This document outlines the database schema for the Intranet application, detailing entities, their attributes, relationships, and user capabilities.

## Visual Representation (Mermaid)

```mermaid
erDiagram
    EducationTrack ||--o{ Course : "contains"
    EducationTrack ||--o{ User : "has students"
    User ||--o{ TimeEntry : "logs time"
    User ||--o{ BulletinPost : "creates"
    User ||--o{ Inquiry : "submits"
    User ||--o{ Grade : "receives"
    User ||--o{ TeacherSkill : "has"
    User }|--|{ Course : "attends (Student)"
    User }|--|{ Course : "teaches (Teacher)"
    Course ||--o{ Exam : "includes"
    Course ||--o{ CourseTopic : "has topics"
    Course }|--|{ Tag : "has tags (via CourseTag)"
    Room ||--o{ CourseEvent : "hosts"
    Tag ||--o{ TeacherSkill : "part of"

    User {
        String id PK
        String name
        String email
        String role "admin, student, staff, teacher"
        String department "nullable"
        String measureNumber "nullable"
        String educationTrackId FK "nullable"
        DateTime createdAt
    }

    EducationTrack {
        String id PK
        String title
        DateTime startDate
        DateTime endDate
        DateTime createdAt
    }

    Course {
        String id PK
        String title
        String description "nullable"
        DateTime startDate
        DateTime endDate
        String educationTrackId FK "nullable"
        Int maxStudents
        DateTime createdAt
    }

    CourseTopic {
        String id PK
        String title
        Int durationUnits
        DateTime startDate
        DateTime endDate
        String courseId FK
    }

    Room {
        String id PK
        String name
        Int capacity
    }

    TimeEntry {
        String id PK
        String userId FK
        DateTime clockIn
        DateTime clockOut "nullable"
        Int duration "nullable"
        String location "ON_SITE, REMOTE"
        DateTime createdAt
    }

    Announcement {
        String id PK
        String title
        String content
        String author
        Boolean published
        DateTime createdAt
    }

    CourseEvent {
        String id PK
        String title
        String description "nullable"
        DateTime startTime
        DateTime endTime
        String roomId FK "nullable"
        String instructor "nullable"
        DateTime createdAt
    }

    BulletinPost {
        String id PK
        String title
        String description
        String type "OFFER, SEARCH"
        String contactInfo
        String userId FK "nullable"
        DateTime createdAt
    }

    Exam {
        String id PK
        String title
        DateTime date
        String content
        String location
        Int duration
        String courseId FK "nullable"
        DateTime createdAt
    }

    Inquiry {
        String id PK
        String userId FK
        String subject
        String message
        String category "ADMIN, TEACHER"
        String status "OPEN, ANSWERED"
        String answer "nullable"
        DateTime createdAt
        DateTime answeredAt "nullable"
    }

    Grade {
        String id PK
        String userId FK
        String examId FK "nullable"
        String subject
        Float value
        DateTime date
        DateTime updatedAt
    }

    TeacherSkill {
        String id PK
        String userId FK
        String tagId FK
        Boolean isVerified
        Boolean isActive
    }

    Tag {
        String id PK
        String name
    }

    CourseTag {
        String id PK
        String courseId FK
        String tagId FK
    }
    
    Notification {
        String id PK
        String userId FK
        String message
        Boolean isRead
        DateTime createdAt
    }
```

## Entity Descriptions

### 1. User
**Description**: Represents all actors in the system (Students, Teachers, Administrators, Staff).
**Attributes**:
*   `role`: Defines permissions (`admin`, `staff`, `teacher`, `student`).
*   `department`: For Admins/Staff (e.g., "IT-Support").
*   `measureNumber`: Specific ID for students (e.g., "123/456/2024").
*   `educationTrackId`: Links students to their specific cohort/year.
**Capabilities**:
*   **Admin**: Full CRUD. Manage Users, assign roles, verify skills.
*   **Staff**: Plan courses, assign teachers/students, manage schedules.
*   **Teacher**: View schedule, grade exams, manage own skills.
*   **Student**: View schedule, grades, clock in/out.

### 2. EducationTrack
**Description**: Represents a complete retraining program (e.g., "Fachinformatiker Winter 2025").
**Attributes**:
*   `startDate`, `endDate`: Duration of the entire program.
**Capabilities**:
*   **Staff**: Create and manage tracks.

### 3. Course (Module)
**Description**: A specific module within an EducationTrack (e.g., "Einführung Programmierung").
**Attributes**:
*   `maxStudents`: Limit for participants (default 25).
*   `topics`: Breakdown of content within the course.
*   `tags`: Links to `Tag` entity for skill matching.
**Capabilities**:
*   **Staff**: Create, assign teachers (with skill check) and students (max 25).

### 4. CourseTopic
**Description**: Granular topics within a course (e.g., "Java Basics" inside "Programmierung").
**Attributes**:
*   `durationUnits`: Number of teaching units (UE).

### 5. Room
**Description**: Physical or virtual spaces for instruction.
**Attributes**:
*   `capacity`: Max people.
*   `name`: e.g. "Raum 101" or "Remote".

### 6. TimeEntry
**Description**: Records of time spent working or studying (Time Tracking).
**Attributes**:
*   `location`: "ON_SITE" or "REMOTE".
**Capabilities**:
*   **Student/Staff**: Create (Clock In/Out).
*   **All**: Generate monthly log export.

### 7. Exam & Grade
**Description**: Assessment system.
**Attributes**:
*   `Exam`: Linked to a Course.
*   `Grade`: Linked to User and Exam.
**Capabilities**:
*   **Teacher**: Grade students via table view.
*   **Student**: View own grades and average.

### 8. TeacherSkill
**Description**: Pivot table linking `User` (Teacher) to `Tag`.
**Attributes**:
*   `isVerified`: Boolean indicating if Admin has approved this skill.
*   `isActive`: Boolean for availability.
**Capabilities**:
*   **Teacher**: Request/Add skills.
*   **Admin**: Verify skills.
*   **Staff**: Use these tags to filter suitable teachers for course assignment.

### 9. Tag
**Description**: Universal label for skills and course requirements (e.g. "React", "Accounting").
**Capabilities**:
*   Used for matching Course requirements with Teacher skills.
