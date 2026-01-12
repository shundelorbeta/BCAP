# Bantayan Community Action Portal

## Overview

The Bantayan Community Action Portal is a web-based platform designed for residents of Bantayan Island proper to submit complaints and suggestions about community issues. It functions similarly to a social media platform where posts are public, and administrators from the local government can respond, update statuses, and provide visual evidence of resolutions.

## Key Features

- **User Registration**: Residents register with personal details including name, email, phone, and address (Municipality: Bantayan, Province: Cebu, Barangay: one of 25 options).
- **Public Posting**: Users can post concerns with captions and images, visible to all registered users.
- **Admin Responses**: Administrators can respond to posts with text, images (e.g., before/after photos), and status updates (pending, in progress, resolved).
- **Barangay Management**: Posts are tagged by barangay, allowing admins to filter and manage issues by location.
- **User Verification**: Admins verify user accounts to ensure legitimacy.
- **Role Management**: Main admins can assign co-admins to specific barangays.
- **Interaction Features**: Users can like posts to prioritize issues, and report inappropriate content.
- **Admin Dashboard**: Dedicated interface for admins to view posts, respond, verify users, and manage co-admins.

## System Architecture

The system is built using the MERN stack:

- **MongoDB**: Database for storing users, posts, responses, and address data.
- **Express.js**: Backend API server handling authentication, CRUD operations, and file uploads.
- **React**: Frontend for user interfaces, including registration, login, feed, and admin dashboard.
- **Node.js**: Runtime for the backend.

### Database Schema

- **User**: Stores user details, role (user/admin/co-admin), verification status, and assigned barangays for co-admins.
- **Post**: Contains post content, images, barangay, likes, reports, status, and embedded responses from admins.

### Workflow

1. User registers and logs in.
2. User creates a post with caption, images, and barangay.
3. Post appears in public feed.
4. Admins view posts, filter by barangay.
5. Admins respond with updates and status changes.
6. Users can like or report posts.

## Setup Instructions

1. **Prerequisites**: Node.js, MongoDB installed.
2. **Clone/Setup Project**:
   - Server: `cd server && npm install`
   - Client: `cd client && npm install`
3. **Environment**: Update `server/.env` with MongoDB URI and JWT secret.
4. **Run**:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`
5. **Access**: Open http://localhost:3000 for frontend, backend on http://localhost:5000.

## Barangays of Bantayan Island Proper

- Atop-atop
- Baigad
- Bantigue(Poblacion)
- Baod
- Binaobao(Poblacion)
- Botigues
- Doong
- Guiwanon
- Hilotongan
- Kabac
- Kabangbang
- Kampingganon
- Kangkaibe
- Lipayran
- Luyongbaybay
- Mojon
- Obo-ob
- Patao
- Putian
- Sillon
- Suba(Poblacion)
- Sulangan
- Sungko
- Tamiao
- Ticad(poblacion)

## Future Enhancements

- User notifications for admin responses.
- Search and filter functionality.
- Advanced reporting and analytics.
- Mobile app version.

## Plan Discussion

The initial plan focused on user registration with address dropdowns, complaint submission, and admin management. It evolved to a Facebook-like platform with public posts, image uploads, status tracking, and barangay-specific admin assignments. Anonymous posting was excluded to ensure accountability, with admin verification of users.
