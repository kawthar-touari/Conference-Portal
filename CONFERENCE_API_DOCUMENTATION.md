# Conference Management System - Complete API Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture & Models](#architecture--models)
3. [Model Relationships](#model-relationships)
4. [Authentication](#authentication)
5. [Public API Endpoints](#public-api-endpoints)
6. [Admin API Endpoints](#admin-api-endpoints)
7. [Testing Guide](#testing-guide)
8. [Environment Setup](#environment-setup)

---

## 🎯 System Overview

This is a comprehensive **Conference Management System** built with Node.js, Express, and MongoDB. It handles the complete lifecycle of academic conferences including:

- Conference event management
- Paper submission and review workflow
- Speaker and session scheduling
- Participant registration
- Certificate generation and verification
- Committee member management
- Role-based admin access control

### Key Features

✅ **Multi-conference support** - Manage multiple conferences simultaneously  
✅ **Paper submission workflow** - From submission to acceptance/rejection  
✅ **Automatic ID generation** - Public-friendly IDs (SUB-2025-0001, REG-2025-0001, CERT-2025-0001)  
✅ **Certificate system** - Auto-generated certificates with verification codes  
✅ **Role-based access** - ADMIN, REVIEWER, EDITOR roles for committee members  
✅ **Duplicate prevention** - Smart checks for existing participants and registrations  

---

## 🏗️ Architecture & Models

### 1. Conference Model
**Purpose**: Core entity representing a conference event

```javascript
{
  name: String (required, max 200),
  slogan: String (max 250),
  description: String,
  startDate: Date (required),
  endDate: Date (required),
  venue: String (required, max 200),
  city: String (max 100),
  country: String (max 100),
  contactEmail: String (lowercase),
  isActive: Boolean (default: true)
}
```

**Necessity**: ✅ **ESSENTIAL** - All other models reference this as the parent entity

---

### 2. Theme Model
**Purpose**: Conference tracks/topics (e.g., "AI", "Machine Learning", "Data Science")

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  code: String (required, uppercase, max 30),
  label: String (required, max 120),
  description: String,
  displayOrder: Number (default: 0)
}
```

**Indexes**: 
- Unique: `{conferenceId, code}`
- Standard: `{conferenceId, label}`

**Necessity**: ✅ **ESSENTIAL** - Categorizes submissions and sessions

---

### 3. Speaker Model
**Purpose**: Keynote/guest speakers for the conference

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  fullName: String (required, max 150),
  academicTitle: String (max 80),
  affiliation: String (required, max 200),
  country: String (max 100),
  topic: String (required, max 200),
  biography: String,
  photoUrl: String,
  email: String (lowercase)
}
```

**Necessity**: ✅ **ESSENTIAL** - Manages invited speakers separately from paper authors

---

### 4. Session Model
**Purpose**: Scheduled presentations/time slots during the conference

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  themeId: ObjectId → Theme (required, indexed),
  speakerId: ObjectId → Speaker (optional, default: null),
  sessionTitle: String (required, max 200),
  startsAt: Date (required, indexed),
  endsAt: Date (required, indexed),
  room: String (max 80),
  description: String
}
```

**Validation**: `endsAt` must be after `startsAt`

**Necessity**: ✅ **ESSENTIAL** - Manages conference schedule and program

---

### 5. Submission Model
**Purpose**: Paper submissions with multiple authors

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  themeId: ObjectId → Theme (required, indexed),
  submissionId: String (unique, auto-generated: SUB-YYYY-NNNN),
  paperTitle: String (required, max 250),
  abstract: String (required, min 50 chars),
  institution: String (max 200),
  country: String (max 100),
  status: Enum ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'PUBLISHED'],
  reviewComment: String (max 2000),
  pdfUrl: String,
  submittedAt: Date (default: now),
  authors: [{
    fullName: String (required),
    email: String (required, lowercase),
    affiliation: String,
    country: String,
    authorOrder: Number (required, unique per submission),
    isCorresponding: Boolean (exactly one per submission)
  }]
}
```

**Validations**:
- Exactly one corresponding author required
- Author order values must be unique within submission
- Auto-generates `submissionId` on creation

**Necessity**: ✅ **ESSENTIAL** - Core paper management system

---

### 6. Participant Model
**Purpose**: Reusable attendee profiles (can register for multiple conferences)

```javascript
{
  fullName: String (required, max 150),
  email: String (required, unique, lowercase, indexed),
  phone: String (max 30),
  affiliation: String (max 200),
  country: String (max 100),
  participantType: Enum ['STUDENT', 'RESEARCHER', 'PROFESSOR', 'GUEST', 'INDUSTRY']
}
```

**Necessity**: ✅ **ESSENTIAL** - Avoids duplicate data when same person attends multiple conferences

---

### 7. Registration Model
**Purpose**: Links participants to specific conferences

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  participantId: ObjectId → Participant (required, indexed),
  registrationId: String (unique, auto-generated: REG-YYYY-NNNN),
  registrationStatus: Enum ['REGISTERED', 'CONFIRMED', 'CANCELLED'],
  attendanceConfirmed: Boolean (default: false),
  notes: String (max 500),
  registeredAt: Date (default: now)
}
```

**Validations**:
- Unique constraint: `{conferenceId, participantId}` - prevents duplicate registration
- Auto-generates `registrationId` on creation

**Necessity**: ✅ **ESSENTIAL** - Tracks conference-specific attendance

---

### 8. Certificate Model
**Purpose**: Participation/speaker certificates with verification

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  registrationIdRef: ObjectId → Registration (required, unique, indexed),
  participantId: ObjectId → Participant (required, indexed),
  certificateId: String (unique, auto-generated: CERT-YYYY-NNNN),
  certificateType: Enum ['PARTICIPANT', 'SPEAKER'],
  ownerName: String (required, max 150),
  ownerEmail: String (required, lowercase, max 150),
  issueDate: Date (default: now),
  verificationCode: String (unique, auto-generated random 8-char),
  status: Enum ['GENERATED', 'ISSUED', 'DOWNLOADED', 'REVOKED'],
  pdfUrl: String
}
```

**Auto-generation**:
- `certificateId`: CERT-YYYY-NNNN format
- `verificationCode`: Random 8-character uppercase string

**Necessity**: ✅ **ESSENTIAL** - Professional certificate system with public verification

---

### 9. CommitteeMember Model
**Purpose**: Public-facing organizing team members

```javascript
{
  conferenceId: ObjectId → Conference (required, indexed),
  fullName: String (required, max 150),
  academicTitle: String (max 80),
  role: String (required, max 120),
  team: Enum ['ORGANIZING', 'SCIENTIFIC', 'REVIEW', 'HONORARY'],
  affiliation: String (required, max 200),
  email: String (lowercase),
  photoUrl: String,
  displayOrder: Number (default: 0),
  isVisible: Boolean (default: true)
}
```

**Necessity**: ✅ **ESSENTIAL** - Displays organizing teams on public pages

---

### 10. CommitteeUser Model
**Purpose**: Admin/reviewer accounts with authentication

```javascript
{
  memberId: ObjectId → CommitteeMember (optional, links to public profile),
  fullName: String (required, max 150),
  email: String (required, unique, lowercase),
  passwordHash: String (required, bcrypt),
  role: Enum ['ADMIN', 'REVIEWER', 'EDITOR'],
  isActive: Boolean (default: true),
  lastLoginAt: Date
}
```

**Methods**:
- `comparePassword(plainPassword)` - Bcrypt comparison

**Necessity**: ✅ **ESSENTIAL** - Staff authentication and authorization system

---

### 11. Counter Model
**Purpose**: Auto-increment sequences for public IDs

```javascript
{
  name: String (required, unique), // 'submission', 'registration', 'certificate'
  seq: Number (default: 0)
}
```

**Usage**: Generates sequential numbers for:
- SUB-2025-0001, SUB-2025-0002...
- REG-2025-0001, REG-2025-0002...
- CERT-2025-0001, CERT-2025-0002...

**Necessity**: ✅ **ESSENTIAL** - Provides clean, readable public identifiers

---

## 🔗 Model Relationships

```
┌─────────────────┐
│   Conference    │ ← Root entity (all models connect here)
└────────┬────────┘
         │
    ┌────┼────┬──────────┬────────────┬──────────────┐
    │    │    │          │            │              │
    ▼    ▼    ▼          ▼            ▼              ▼
┌────────┐ ┌──────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐
│ Theme  │ │Speaker│ │Session  │ │Submission│ │CommitteeMember│ │Registration  │
└───┬────┘ └───┬──┘ └────┬────┘ └─────┬────┘ └──────────────┘ └──────┬───────┘
    │          │        │             │                               │
    │          │        │             │                         ┌─────┴──────┐
    │          │        │             │                         │Participant │
    │          │        │             │                         └────────────┘
    │          │        │             │                               │
    │          │        │             │                               ▼
    │          │        │             │                         ┌────────────┐
    │          │        │             │                         │Certificate │
    │          │        │             │                         └────────────┘
    │          │        │             │
    ▼          │        │             │
┌──────────────┘        │             │
│   (referenced by)     │             │
│                       │             │
▼                       ▼             ▼
Session            Session      Submission
(themeId)         (speakerId)   
```

### Relationship Summary

| Model | References | Referenced By |
|-------|-----------|---------------|
| Conference | - | Theme, Speaker, Session, Submission, Registration, Certificate, CommitteeMember |
| Theme | Conference | Session, Submission |
| Speaker | Conference | Session (optional) |
| Session | Conference, Theme, Speaker (optional) | - |
| Submission | Conference, Theme | - |
| Participant | - | Registration |
| Registration | Conference, Participant | Certificate |
| Certificate | Conference, Registration, Participant | - |
| CommitteeMember | Conference | CommitteeUser (optional) |
| CommitteeUser | CommitteeMember (optional) | - |
| Counter | - | Used by Submission, Registration, Certificate |

---

## 🔐 Authentication

### Login Endpoint

**POST** `/api/admin/auth/login`

**Request Body**:
```json
{
  "email": "admin@conference.com",
  "password": "securePassword123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "fullName": "John Admin",
    "email": "admin@conference.com",
    "role": "ADMIN"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials or inactive account

### Using Auth Token

Include the token in all protected admin requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access

Roles hierarchy:
- **ADMIN**: Full access to all endpoints
- **EDITOR**: Can manage content (submissions, speakers, sessions)
- **REVIEWER**: Can review submissions only

---

## 🌐 Public API Endpoints

### Conference

#### Get Active Conference
**GET** `/api/public/conference`

**Response**:
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "International AI Conference 2025",
  "slogan": "Advancing AI Research",
  "description": "...",
  "startDate": "2025-06-15T00:00:00.000Z",
  "endDate": "2025-06-17T00:00:00.000Z",
  "venue": "Grand Convention Center",
  "city": "San Francisco",
  "country": "USA",
  "contactEmail": "info@ai-conf-2025.com",
  "isActive": true
}
```

---

### Themes

#### Get All Themes
**GET** `/api/public/themes`

**Query Parameters**: None (uses active conference)

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
    "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "code": "AI01",
    "label": "Artificial Intelligence",
    "description": "AI and machine learning topics",
    "displayOrder": 1
  },
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
    "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "code": "DS02",
    "label": "Data Science",
    "description": "Big data and analytics",
    "displayOrder": 2
  }
]
```

---

### Speakers

#### Get All Speakers
**GET** `/api/public/speakers`

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9k1",
    "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "fullName": "Dr. Jane Smith",
    "academicTitle": "Professor",
    "affiliation": "MIT",
    "country": "USA",
    "topic": "Deep Learning Advances",
    "biography": "...",
    "photoUrl": "https://...",
    "email": "jane@mit.edu"
  }
]
```

#### Get Speaker by ID
**GET** `/api/public/speakers/:id`

---

### Sessions

#### Get All Sessions
**GET** `/api/public/sessions`

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9m1",
    "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "themeId": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
      "code": "AI01",
      "label": "Artificial Intelligence"
    },
    "speakerId": null,
    "sessionTitle": "Opening Keynote",
    "startsAt": "2025-06-15T09:00:00.000Z",
    "endsAt": "2025-06-15T10:30:00.000Z",
    "room": "Main Hall",
    "description": "Conference opening ceremony"
  }
]
```

---

### Submissions

#### Submit Paper
**POST** `/api/public/submit`

**Request Body**:
```json
{
  "themeId": "64f5a1b2c3d4e5f6g7h8i9j1",
  "paperTitle": "Advanced Neural Networks for Image Recognition",
  "abstract": "This paper presents a novel approach to image recognition using advanced neural network architectures. Our method achieves state-of-the-art results on benchmark datasets... (min 50 characters)",
  "institution": "Stanford University",
  "country": "USA",
  "pdfUrl": "https://storage.example.com/papers/paper123.pdf",
  "authors": [
    {
      "fullName": "Dr. Alice Johnson",
      "email": "alice@stanford.edu",
      "affiliation": "Stanford University",
      "country": "USA",
      "authorOrder": 1,
      "isCorresponding": true
    },
    {
      "fullName": "Prof. Bob Williams",
      "email": "bob@stanford.edu",
      "affiliation": "Stanford University",
      "country": "USA",
      "authorOrder": 2,
      "isCorresponding": false
    }
  ]
}
```

**Validation Rules**:
- At least one author required
- Exactly one `isCorresponding: true` author
- Unique `authorOrder` values
- Abstract minimum 50 characters

**Success Response** (200 OK):
```json
{
  "submissionId": "SUB-2025-0001",
  "_id": "64f5a1b2c3d4e5f6g7h8i9n1",
  "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "themeId": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
    "code": "AI01",
    "label": "Artificial Intelligence"
  },
  "submissionId": "SUB-2025-0001",
  "paperTitle": "Advanced Neural Networks for Image Recognition",
  "abstract": "...",
  "institution": "Stanford University",
  "country": "USA",
  "status": "PENDING",
  "reviewComment": null,
  "pdfUrl": "https://storage.example.com/papers/paper123.pdf",
  "submittedAt": "2025-01-15T10:30:00.000Z",
  "authors": [
    {
      "fullName": "Dr. Alice Johnson",
      "email": "alice@stanford.edu",
      "affiliation": "Stanford University",
      "country": "USA",
      "authorOrder": 1,
      "isCorresponding": true
    },
    {
      "fullName": "Prof. Bob Williams",
      "email": "bob@stanford.edu",
      "affiliation": "Stanford University",
      "country": "USA",
      "authorOrder": 2,
      "isCorresponding": false
    }
  ]
}
```

#### Track Submission Status
**GET** `/api/public/submission-status`

**Query Parameters** (provide ONE of these options):

Option 1 - By submission ID:
```
?submissionId=SUB-2025-0001
```

Option 2 - By email and paper title:
```
?email=alice@stanford.edu&paperTitle=Advanced Neural Networks for Image Recognition
```

**Response**:
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9n1",
  "submissionId": "SUB-2025-0001",
  "paperTitle": "Advanced Neural Networks for Image Recognition",
  "status": "UNDER_REVIEW",
  "reviewComment": null,
  "submittedAt": "2025-01-15T10:30:00.000Z",
  "themeId": {
    "code": "AI01",
    "label": "Artificial Intelligence"
  },
  "authors": [...]
}
```

---

### Registration

#### Register Participant
**POST** `/api/public/register`

**Request Body**:
```json
{
  "fullName": "Dr. Sarah Connor",
  "email": "sarah@techcorp.com",
  "phone": "+1-555-0123",
  "affiliation": "Tech Corp Industries",
  "country": "USA",
  "participantType": "INDUSTRY",
  "notes": "Vegetarian meal preference"
}
```

**participantType Options**: `STUDENT`, `RESEARCHER`, `PROFESSOR`, `GUEST`, `INDUSTRY`

**Success Response** (200 OK):

First-time registration:
```json
{
  "registrationId": "REG-2025-0001",
  "alreadyRegistered": false
}
```

Already registered (same email):
```json
{
  "registrationId": "REG-2025-0001",
  "alreadyRegistered": true
}
```

**Note**: If a participant with the same email exists, they will be re-registered for the current conference without creating a duplicate participant record.

---

### Certificates

#### Verify Certificate by Code
**GET** `/api/public/certificate/:code`

**Example**: `GET /api/public/certificate/A1B2C3D4`

**Response**:
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9p1",
  "certificateId": "CERT-2025-0001",
  "certificateType": "PARTICIPANT",
  "ownerName": "Dr. Sarah Connor",
  "ownerEmail": "sarah@techcorp.com",
  "issueDate": "2025-06-17T15:00:00.000Z",
  "verificationCode": "A1B2C3D4",
  "status": "ISSUED",
  "conferenceId": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "International AI Conference 2025",
    "startDate": "2025-06-15T00:00:00.000Z",
    "endDate": "2025-06-17T00:00:00.000Z"
  }
}
```

#### Check Certificate (POST alternative)
**POST** `/api/public/certificate-check`

**Request Body**:
```json
{
  "verificationCode": "A1B2C3D4"
}
```

---

### Committee Members

#### Get Committee Members
**GET** `/api/public/committee-members`

**Query Parameters** (optional):
- `?team=ORGANIZING` - Filter by team
- `?team=SCIENTIFIC` - Filter by team

**Team Options**: `ORGANIZING`, `SCIENTIFIC`, `REVIEW`, `HONORARY`

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9q1",
    "conferenceId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "fullName": "Prof. Michael Brown",
    "academicTitle": "Professor",
    "role": "Conference Chair",
    "team": "ORGANIZING",
    "affiliation": "University of California",
    "email": "michael@uc.edu",
    "photoUrl": "https://...",
    "displayOrder": 1,
    "isVisible": true
  }
]
```

---

## 🔧 Admin API Endpoints

**All admin endpoints require authentication**. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication

#### Login
**POST** `/api/admin/auth/login`

See [Authentication section](#authentication) above.

---

### Dashboard

#### Get Dashboard Statistics
**GET** `/api/admin/dashboard/stats`

**Response**:
```json
{
  "totalSubmissions": 156,
  "pendingReviews": 23,
  "acceptedPapers": 45,
  "rejectedPapers": 12,
  "totalRegistrations": 230,
  "confirmedAttendance": 180,
  "certificatesIssued": 175,
  "activeSpeakers": 12
}
```

---

### Submissions Management

#### Get All Submissions
**GET** `/api/admin/submissions`

**Query Parameters** (optional):
- `?status=PENDING` - Filter by status
- `?themeId=64f5a1b2c3d4e5f6g7h8i9j1` - Filter by theme
- `?page=1&limit=20` - Pagination

**Status Options**: `PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `PUBLISHED`

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9n1",
    "submissionId": "SUB-2025-0001",
    "paperTitle": "Advanced Neural Networks for Image Recognition",
    "status": "PENDING",
    "submittedAt": "2025-01-15T10:30:00.000Z",
    "themeId": {
      "code": "AI01",
      "label": "Artificial Intelligence"
    },
    "authors": [
      {
        "fullName": "Dr. Alice Johnson",
        "email": "alice@stanford.edu",
        "isCorresponding": true
      }
    ]
  }
]
```

#### Get Single Submission
**GET** `/api/admin/submissions/:id`

**Response**: Full submission details including all authors and review comments.

#### Update Submission Status
**PUT** `/api/admin/submissions/:id/status`

**Request Body**:
```json
{
  "status": "ACCEPTED",
  "reviewComment": "Excellent paper with novel contributions. Minor revisions suggested for final version."
}
```

**Status Options**: `PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `PUBLISHED`

**Success Response**:
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9n1",
  "submissionId": "SUB-2025-0001",
  "status": "ACCEPTED",
  "reviewComment": "Excellent paper with novel contributions...",
  "updatedAt": "2025-01-20T14:00:00.000Z"
}
```

---

### Registrations Management

#### Get All Registrations
**GET** `/api/admin/registrations`

**Query Parameters** (optional):
- `?status=REGISTERED` - Filter by status
- `?attendanceConfirmed=true` - Filter by attendance
- `?page=1&limit=20` - Pagination

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9o1",
    "registrationId": "REG-2025-0001",
    "registrationStatus": "REGISTERED",
    "attendanceConfirmed": false,
    "notes": "Vegetarian meal preference",
    "registeredAt": "2025-01-16T09:00:00.000Z",
    "participantId": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9l1",
      "fullName": "Dr. Sarah Connor",
      "email": "sarah@techcorp.com",
      "participantType": "INDUSTRY"
    }
  }
]
```

#### Get Single Registration
**GET** `/api/admin/registrations/:id`

#### Update Registration
**PUT** `/api/admin/registrations/:id`

**Request Body**:
```json
{
  "registrationStatus": "CONFIRMED",
  "attendanceConfirmed": true,
  "notes": "VIP guest, front row seating"
}
```

**Success Response**: Updated registration object.

#### Delete Registration
**DELETE** `/api/admin/registrations/:id`

**Success Response**:
```json
{
  "message": "Registration deleted successfully."
}
```

---

### Certificates Management

#### Get All Certificates
**GET** `/api/admin/certificates`

**Query Parameters** (optional):
- `?status=GENERATED` - Filter by status
- `?type=PARTICIPANT` - Filter by type

**Response**:
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9p1",
    "certificateId": "CERT-2025-0001",
    "certificateType": "PARTICIPANT",
    "ownerName": "Dr. Sarah Connor",
    "ownerEmail": "sarah@techcorp.com",
    "issueDate": "2025-06-17T15:00:00.000Z",
    "verificationCode": "A1B2C3D4",
    "status": "ISSUED",
    "pdfUrl": "https://storage.example.com/certificates/CERT-2025-0001.pdf"
  }
]
```

#### Get Single Certificate
**GET** `/api/admin/certificates/:id`

#### Generate Certificate
**POST** `/api/admin/certificates/generate`

**Prerequisites**: 
- Participant must be registered
- Registration status must be `CONFIRMED` OR `attendanceConfirmed: true`

**Request Body**:
```json
{
  "registrationId": "REG-2025-0001"
}
```

**Success Response**:
```json
{
  "certificate": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9p1",
    "certificateId": "CERT-2025-0001",
    "certificateType": "PARTICIPANT",
    "ownerName": "Dr. Sarah Connor",
    "ownerEmail": "sarah@techcorp.com",
    "issueDate": "2025-06-17T15:00:00.000Z",
    "verificationCode": "A1B2C3D4",
    "status": "GENERATED"
  },
  "previewData": {
    "conferenceName": "International AI Conference 2025",
    "ownerName": "Dr. Sarah Connor",
    "eventDate": "2025-06-17T00:00:00.000Z",
    "certificateId": "CERT-2025-0001",
    "verificationCode": "A1B2C3D4"
  }
}
```

**Error Response** (if not eligible):
```json
{
  "message": "Participant is not eligible for a certificate yet."
}
```

#### Update Certificate
**PUT** `/api/admin/certificates/:id`

**Request Body**:
```json
{
  "status": "ISSUED",
  "pdfUrl": "https://storage.example.com/certificates/CERT-2025-0001.pdf"
}
```

**Status Options**: `GENERATED`, `ISSUED`, `DOWNLOADED`, `REVOKED`

---

### Speakers Management

#### Get All Speakers
**GET** `/api/admin/speakers`

**Query Parameters** (optional):
- `?page=1&limit=20` - Pagination

#### Create Speaker
**POST** `/api/admin/speakers`

**Request Body**:
```json
{
  "fullName": "Dr. Emily Chen",
  "academicTitle": "Associate Professor",
  "affiliation": "Carnegie Mellon University",
  "country": "USA",
  "topic": "Reinforcement Learning in Robotics",
  "biography": "Dr. Chen is a leading expert in RL with 10+ years of experience...",
  "photoUrl": "https://storage.example.com/speakers/emily-chen.jpg",
  "email": "emily.chen@cmu.edu"
}
```

**Note**: Automatically associates with the active conference.

#### Update Speaker
**PUT** `/api/admin/speakers/:id`

**Request Body**: Any fields from create endpoint (partial update supported).

#### Delete Speaker
**DELETE** `/api/admin/speakers/:id`

---

### Sessions Management

#### Get All Sessions
**GET** `/api/admin/sessions`

**Query Parameters** (optional):
- `?themeId=64f5a1b2c3d4e5f6g7h8i9j1` - Filter by theme
- `?date=2025-06-15` - Filter by date

#### Create Session
**POST** `/api/admin/sessions`

**Request Body**:
```json
{
  "themeId": "64f5a1b2c3d4e5f6g7h8i9j1",
  "speakerId": "64f5a1b2c3d4e5f6g7h8i9k1",
  "sessionTitle": "Workshop: Hands-on Deep Learning",
  "startsAt": "2025-06-15T14:00:00.000Z",
  "endsAt": "2025-06-15T16:00:00.000Z",
  "room": "Workshop Room A",
  "description": "Interactive workshop on deep learning frameworks"
}
```

**Validation**: `endsAt` must be after `startsAt`

**Note**: `speakerId` is optional. Leave null for sessions without a specific speaker.

#### Update Session
**PUT** `/api/admin/sessions/:id`

**Request Body**: Any fields from create endpoint.

#### Delete Session
**DELETE** `/api/admin/sessions/:id`

---

### Committee Members Management

#### Get All Committee Members
**GET** `/api/admin/committee-members`

**Query Parameters** (optional):
- `?team=ORGANIZING` - Filter by team
- `?isVisible=true` - Filter by visibility

#### Create Committee Member
**POST** `/api/admin/committee-members`

**Request Body**:
```json
{
  "fullName": "Prof. Robert Taylor",
  "academicTitle": "Professor",
  "role": "Technical Program Chair",
  "team": "SCIENTIFIC",
  "affiliation": "Georgia Institute of Technology",
  "email": "robert.taylor@gatech.edu",
  "photoUrl": "https://storage.example.com/committee/robert-taylor.jpg",
  "displayOrder": 5,
  "isVisible": true
}
```

**Team Options**: `ORGANIZING`, `SCIENTIFIC`, `REVIEW`, `HONORARY`

#### Update Committee Member
**PUT** `/api/admin/committee-members/:id`

#### Delete Committee Member
**DELETE** `/api/admin/committee-members/:id`

---

## 🧪 Testing Guide

### Prerequisites

1. **MongoDB** running locally or connection string configured
2. **Node.js** v16+ installed
3. **Environment variables** set (see [Environment Setup](#environment-setup))

### Step 1: Start the Server

```bash
cd server
npm install
npm run dev
```

Server should start on `http://localhost:3000` (or configured port).

### Step 2: Create Initial Admin User

You need to manually create the first admin user in MongoDB:

```javascript
// Use MongoDB Compass or mongosh
use conferenceDB

// First, create a committee member
db.committeemembers.insertOne({
  fullName: "System Administrator",
  academicTitle: "Admin",
  role: "System Admin",
  team: "ORGANIZING",
  affiliation: "Conference Org",
  email: "admin@conference.com",
  isVisible: true,
  displayOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Then create the committee user with hashed password
// Password: "Admin123!" (hash this with bcrypt)
db.committeeusers.insertOne({
  memberId: ObjectId("<insert-member-id-from-above>"),
  fullName: "System Administrator",
  email: "admin@conference.com",
  passwordHash: "$2a$10$...", // Generate with bcrypt.hashSync("Admin123!", 10)
  role: "ADMIN",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use this Node.js script to create admin:

```javascript
// create-admin.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const CommitteeUser = require('./src/models/committeeUser.model');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/conferenceDB');
  
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  
  await CommitteeUser.create({
    fullName: 'System Administrator',
    email: 'admin@conference.com',
    passwordHash: passwordHash,
    role: 'ADMIN',
    isActive: true
  });
  
  console.log('Admin user created!');
  process.exit(0);
}

createAdmin();
```

### Step 3: Test Authentication

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@conference.com",
    "password": "Admin123!"
  }'
```

Save the returned `token` for subsequent requests.

### Step 4: Complete Testing Workflow

#### 4.1 Create Conference (via MongoDB or seed script)

```javascript
// In MongoDB
db.conferences.insertOne({
  name: "International AI Conference 2025",
  slogan: "Advancing AI Research",
  description: "Premier conference for AI research",
  startDate: ISODate("2025-06-15"),
  endDate: ISODate("2025-06-17"),
  venue: "Grand Convention Center",
  city: "San Francisco",
  country: "USA",
  contactEmail: "info@ai-conf-2025.com",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

#### 4.2 Create Themes (Admin)

```bash
# You'll need to add POST /themes endpoint if not exists
# Or insert directly in MongoDB
db.themes.insertMany([
  {
    conferenceId: ObjectId("<conference-id>"),
    code: "AI01",
    label: "Artificial Intelligence",
    description: "AI and ML topics",
    displayOrder: 1
  },
  {
    conferenceId: ObjectId("<conference-id>"),
    code: "DS02",
    label: "Data Science",
    description: "Big data and analytics",
    displayOrder: 2
  }
])
```

#### 4.3 Test Public Endpoints

```bash
# Get active conference
curl http://localhost:3000/api/public/conference

# Get themes
curl http://localhost:3000/api/public/themes

# Submit a paper
curl -X POST http://localhost:3000/api/public/submit \
  -H "Content-Type: application/json" \
  -d '{
    "themeId": "<theme-id>",
    "paperTitle": "Test Paper Title",
    "abstract": "This is a test abstract with more than 50 characters to meet the minimum requirement.",
    "institution": "Test University",
    "country": "USA",
    "authors": [
      {
        "fullName": "Test Author",
        "email": "test@example.com",
        "affiliation": "Test University",
        "country": "USA",
        "authorOrder": 1,
        "isCorresponding": true
      }
    ]
  }'

# Register participant
curl -X POST http://localhost:3000/api/public/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Participant",
    "email": "participant@example.com",
    "phone": "+1-555-0123",
    "affiliation": "Test Corp",
    "country": "USA",
    "participantType": "RESEARCHER"
  }'
```

#### 4.4 Test Admin Endpoints

```bash
TOKEN="<your-jwt-token>"

# Get submissions
curl http://localhost:3000/api/admin/submissions \
  -H "Authorization: Bearer $TOKEN"

# Update submission status
curl -X PUT http://localhost:3000/api/admin/submissions/<submission-id>/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACCEPTED",
    "reviewComment": "Great paper!"
  }'

# Get registrations
curl http://localhost:3000/api/admin/registrations \
  -H "Authorization: Bearer $TOKEN"

# Update registration (confirm attendance)
curl -X PUT http://localhost:3000/api/admin/registrations/<registration-id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationStatus": "CONFIRMED",
    "attendanceConfirmed": true
  }'

# Generate certificate
curl -X POST http://localhost:3000/api/admin/certificates/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "REG-2025-0001"
  }'

# Verify certificate (public)
curl http://localhost:3000/api/public/certificate/<verification-code>
```

### Step 5: Postman/Insomnia Collection

Import these endpoints into Postman or Insomnia for easier testing:

1. Create a new collection: "Conference Management API"
2. Add environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (will be set automatically after login)
3. Import the requests from the examples above

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the server root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/conferenceDB

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# File Upload (if implemented)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (for future notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Security Notes

⚠️ **Production Checklist**:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Implement input sanitization
- [ ] Regular security audits

---

## 📊 System Assessment

### Are All Components Necessary?

**YES** - Every model and service serves a critical purpose:

| Component | Necessity | Reason |
|-----------|-----------|--------|
| Conference | ✅ Essential | Core entity, all others reference it |
| Theme | ✅ Essential | Categorizes papers and sessions |
| Speaker | ✅ Essential | Manages keynote/invited speakers |
| Session | ✅ Essential | Conference scheduling |
| Submission | ✅ Essential | Paper submission workflow |
| Participant | ✅ Essential | Reusable attendee profiles |
| Registration | ✅ Essential | Links participants to conferences |
| Certificate | ✅ Essential | Professional certification system |
| CommitteeMember | ✅ Essential | Public team display |
| CommitteeUser | ✅ Essential | Admin authentication |
| Counter | ✅ Essential | Clean public ID generation |

### Design Strengths

✅ **Normalized database** - No redundant data  
✅ **Scalable architecture** - Supports multiple conferences  
✅ **Clean separation** - Routes → Controllers → Services → Models  
✅ **Automatic IDs** - User-friendly public identifiers  
✅ **Validation** - Comprehensive schema and business logic validation  
✅ **Security** - JWT auth, password hashing, role-based access  
✅ **Extensibility** - Easy to add new features  

### Potential Improvements

🔧 **Optional Enhancements**:
- Email notifications (submission status, registration confirmation)
- PDF certificate generation (currently stores URL only)
- File upload for papers (currently uses URLs)
- Advanced search and filtering
- Analytics dashboard
- Payment integration for registration fees
- Abstract review assignment system
- Conference website builder

---

## 📞 Support

For questions or issues:
- Check the model schemas in `/src/models/`
- Review controllers in `/src/controllers/`
- Examine services in `/src/services/`
- Consult route definitions in `/src/routes/`

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Framework**: Node.js + Express + MongoDB  
**Authentication**: JWT  
**API Style**: RESTful JSON API
