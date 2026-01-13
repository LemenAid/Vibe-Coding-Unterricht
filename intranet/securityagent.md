# Security Agent: Intranet Security Audit

## 🕵️ Executive Summary

Hello! I am your dedicated Security Agent. I have conducted a comprehensive "heart and kidneys" (thorough) security audit of your Intranet project.

**Current Status:** 🚨 **CRITICAL**
The application currently operates on a "Trust-Me" security model, which is suitable *only* for a completely isolated local demo but is **catastrophic** for any production or networked environment.

The primary vulnerability is that **Authentication is essentially nonexistent.** The system trusts a `userId` cookie that anyone can fabricate.

---

## 🚨 Critical Vulnerabilities (Must Fix Immediately)

### 1. The "God Mode" Cookie (Authentication Bypass)
*   **Location:** `lib/auth.ts`, `lib/auth-actions.ts`, `lib/admin-actions.ts`
*   **The Problem:** The system identifies users solely by reading a `userId` cookie.
    *   `cookieStore.get('userId')`
*   **The Exploit:** An attacker can open their browser's Developer Tools, create a cookie named `userId`, and set the value to an Admin's ID (which is easily found in network requests). The system will instantly treat them as that Admin.
*   **Fix:** Implement a real authentication system (NextAuth.js, Clerk, Lucia) that uses **Signed Sessions** or **JWTs**. Never trust a plain ID in a cookie.

### 2. "Public" Private Data (Data Leakage)
*   **Location:** `lib/client-actions.ts` (`getQualifiedTeachers`)
*   **The Problem:** This Server Action exposes a list of teachers to *anyone* who calls it.
*   **The Leak:** It returns the full `User` object, including:
    *   📧 Email Addresses
    *   🔑 Internal IDs
    *   📅 Creation Dates
*   **Fix:** Use `Prisma.select` to return *only* the data the frontend needs (e.g., `name`, `id`, `avatar`). Add an authorization check (`getCurrentUser()`) to ensure the caller is allowed to see this list.

### 3. Time Travel & Manipulation (Business Logic)
*   **Location:** `lib/time-utils.ts`
*   **The Problem:** Time tracking logic relies on `new Date()` (System Time) for calculations.
*   **The Exploit:**
    *   **Inconsistent Reports:** Generating a report for "last month" might incorrectly use "today's time" for unclosed entries, creating impossible durations.
    *   **Negative Time:** There is no check to ensure `clockOut` > `clockIn`. A malicious user could submit a "negative" duration to subtract hours from their total work time (or corrupt the database stats).
*   **Fix:** Pass a fixed `referenceDate` to calculation functions and validate that `end > start`.

### 4. Logic Bomb: Admin Self-Destruct
*   **Location:** `lib/admin-actions.ts` (`deleteUser`, `updateUser`)
*   **The Problem:** An admin can delete their own account or remove their own admin privileges.
*   **The Consequence:** If the last admin makes a mistake, the system becomes "headless" (no admins left), requiring direct database intervention to fix.
*   **Fix:** Add a check: `if (targetUser.id === currentUser.id) throw new Error("Cannot delete yourself");`.

### 5. Infinite Data Attacks (Denial of Service)
*   **Location:** `lib/client-actions.ts`, `lib/admin-actions.ts`
*   **The Problem:** Input arrays (like `tagIds`) and string fields (like `description`) have no length limits.
*   **The Exploit:** An attacker can send a request with 10,000 tags or a 50MB description string. This can crash the server or freeze the database.
*   **Fix:** Use a validation library like **Zod** to enforce limits (e.g., `z.array(z.string()).max(20)`).

---

## 🛡️ Recommended Action Plan

1.  **Phase 1: Secure the Foundation (Auth)**
    *   Rip out the `userId` cookie logic.
    *   Install **NextAuth.js** (or similar).
    *   Replace `getCurrentUser()` with a function that verifies the signed session token.

2.  **Phase 2: Lockdown Data**
    *   Audit all `findMany` calls in `lib/*.ts`.
    *   Add `select: { ... }` to ensure no passwords, emails, or internal metadata are sent to the client unless necessary.

3.  **Phase 3: Validate Everything**
    *   Install **Zod**.
    *   Create schemas for all Server Actions (e.g., `UserCreateSchema`, `CourseCreateSchema`).
    *   Validate inputs *before* they reach Prisma.

---

*I am ready to assist you in implementing these fixes. Which vulnerability would you like to tackle first?*
