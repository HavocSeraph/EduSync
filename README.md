# EduSync — Real-Time Classroom Concurrency Engine

> **A high-concurrency, low-latency interactive lecture platform engineered to eliminate database contention and race conditions during simultaneous classroom polling.**

[![Architecture: NestJS](https://img.shields.io/badge/Backend-NestJS%2011-ea2845?logo=nestjs)](https://nestjs.com/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?logo=react)](https://react.dev/)
[![Cache & Locks: Redis](https://img.shields.io/badge/State%20Engine-Redis%207-dc382d?logo=redis)](https://redis.io/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2018-336791?logo=postgresql)](https://www.postgresql.org/)
[![Containerization: Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ed?logo=docker)](https://www.docker.com/)

---

## Executive Overview

EduSync is an interactive educational platform designed for modern lecture environments. During live quizzes or poll questions, traditional relational database-driven architectures suffer severe bottlenecks, transaction lock escalations, and connection pool exhaustion when dozens of students submit responses simultaneously.

EduSync solves this with a **memory-first hybrid architecture**:
1. **Sub-millisecond Atomic Ingestion**: Responses are aggregated in RAM using Redis atomic counters (`INCR`), completely bypassing SQL disk bottlenecks.
2. **Per-Question Idempotency Locks**: Redis `SETNX` enforces strict single-submission guarantees per student per question without distributed lock overhead.
3. **Instant Room Synchronization**: WebSocket rooms orchestrated by NestJS and Socket.IO broadcast questions and live score updates to all participants with sub-50ms latency.

---

## Architecture & Container Services

The entire platform is orchestrated into isolated microservices via Docker Compose:

```
                  +----------------------------------------------+
                  |               Client Browsers                |
                  |   Professor Console   |   Student Reactor    |
                  +----------------------------------------------+
                                         |
                                         | HTTP / WebSockets
                                         v
+-----------------------------------------------------------------------------------+
| Docker Compose Environment (edusync_default Network)                              |
|                                                                                   |
|  +--------------------+        +---------------------+        +----------------+  |
|  |  edusync-frontend  |        |   edusync-backend   |------->| edusync-redis  |  |
|  |  React 19 + Vite   |        | NestJS WebSocket GW |        | Atomic Locks   |  |
|  |  Port: 5173        |        | Port: 3000          |        | & Counters     |  |
|  +--------------------+        +---------------------+        | Port: 6380     |  |
|                                           |                   +----------------+  |
|                                           |                                       |
|                                           v                                       |
|                                +---------------------+                            |
|                                |  edusync-postgres   |                            |
|                                |  PostgreSQL 18 DB   |                            |
|                                |  Port: 5433         |                            |
|                                +---------------------+                            |
+-----------------------------------------------------------------------------------+
```

### Service Map & Port Allocations

| Container Name | Service | Internal Port | Host Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| `edusync-frontend-1` | React 19 + Vite | `5173` | `5173` | Interactive Professor & Student SPA |
| `edusync-backend-1` | NestJS Gateway | `3000` | `3000` | REST API & Socket.IO WebSocket Engine |
| `edusync-redis-1` | Redis 7 Alpine | `6379` | `6380` | In-memory session state, `INCR`, `SETNX` |
| `edusync-postgres-1`| PostgreSQL 18 | `5432` | `5433` | Relational persistent store |

---

## System Boot Instructions (Evaluation Panel)

Follow these steps to boot the entire EduSync ecosystem from scratch.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+ / Docker Compose v2) running on host.
- [Node.js](https://nodejs.org/) (v18+) on host machine (required for running the 60-user concurrency test).

### Step 1: Clone and Open Repository
```bash
cd EduSync
```

### Step 2: Orchestrate Containers
Launch all services in detached mode with Docker Compose:
```bash
docker compose up -d
```

### Step 3: Verify Container Health
Verify that all 4 containers are in the `Up` state:
```bash
docker compose ps
```

*Expected Output:*
```text
NAME                 IMAGE             COMMAND                  SERVICE    STATUS    PORTS
edusync-backend-1    node:22-alpine    "docker-entrypoint.s…"   backend    Up        0.0.0.0:3000->3000/tcp
edusync-frontend-1   node:22-alpine    "docker-entrypoint.s…"   frontend   Up        0.0.0.0:5173->5173/tcp
edusync-postgres-1   postgres:alpine   "docker-entrypoint.s…"   postgres   Up        0.0.0.0:5433->5432/tcp
edusync-redis-1      redis:alpine      "docker-entrypoint.s…"   redis      Up        0.0.0.0:6380->6379/tcp
```

To tail the logs of the WebSocket engine:
```bash
docker compose logs -f backend
```

---

## Live Demonstration Walkthrough

Open two browser tabs or split-screen windows to observe real-time dual-role synchronization:

### Tab 1: Professor Console
1. Navigate to: **[http://localhost:5173](http://localhost:5173)**
2. Select **👨‍🏫 Lead the learning (Professor Console)**.
3. Click **Generate Session PIN**.
4. An active 6-digit PIN will appear (e.g., `849201`). Note this PIN.

### Tab 2: Student Reactor
1. Navigate to: **[http://localhost:5173](http://localhost:5173)** in an incognito window or separate browser.
2. Select **🎓 Be part of the moment (Student Reactor)**.
3. Enter the 6-digit PIN generated by the Professor and click **Connect →**.

### Live Real-Time Testing
1. On the **Professor Console**, click **Push Question** (Module 1 software engineering syllabus questions).
2. The question will appear immediately on the **Student Reactor** screen without refreshing.
3. Select an answer option (A, B, C, or D).
4. Observe the **Live Answers Received** counter on the Professor Console increment instantaneously.
5. Attempting to click another answer will be blocked by idempotency enforcement.

---

## Concurrency Strike Protocol (60-User Stress Test)

The evaluation panel can trigger a localized 60-user concurrency strike to stress-test the WebSocket gateway and Redis atomic counter in real time.

```bash
node load-test.js <ACTIVE_PIN>
```

*Example:*
```bash
node load-test.js 849201
```

### Expected Behavior During the Strike:
- The script establishes **60 concurrent socket connections** simultaneously.
- A barrier synchronization waits until all 60 are joined to the room.
- All 60 payloads fire into the gateway in the **exact same millisecond**.
- The **Live Answers Received** metric on the Professor Console jumps to **60** instantly without UI freeze or packet loss.

For detailed analysis and evaluation checklist, see the [Concurrency Strike Protocol](docs/CONCURRENCY_STRIKE_PROTOCOL.md).

---

## Defense & Review Documentation

- 📄 **[FTR Test Plan & RMMM Alignment](docs/FTR_TEST_PLAN_RMMM_ALIGNMENT.md)**: Formal Technical Review defense mapping to risks `EduSync-NW-01` and `EduSync-DB-01`, with atomic Redis verification.
- 📄 **[Concurrency Strike Protocol](docs/CONCURRENCY_STRIKE_PROTOCOL.md)**: Detailed stress test execution guide for evaluators.

---

## Teardown

To stop and remove all running containers and networks:
```bash
docker compose down
```
