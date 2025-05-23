# Asset Management System

## Project Purpose

This project is a web application designed to help businesses manage their assets, schedule maintenance, and streamline related operations. It provides a centralized platform for tracking inventory, assigning user roles, and managing company/store information.

## Core Functionalities

The application offers a comprehensive suite of features to support asset management and operational efficiency.

### Key Features:

*   **Company/Store Management:** Easily manage multiple companies and their respective stores or branches.
*   **User Roles:** Define and assign user roles with specific permissions to control access to different functionalities.
*   **Inventory Tracking:** Keep a detailed record of all assets, including their specifications, purchase dates, and current status.
*   **Maintenance Scheduling:** Schedule and track maintenance activities for assets, ensuring they are well-maintained and minimizing downtime.
*   **QR Code Integration:** Generate and utilize QR codes for quick asset identification and access to relevant information.
*   **Feedback System:** Allow users to provide feedback on assets or maintenance tasks, facilitating communication and continuous improvement.
*   **Notification System:** Keep users informed about important events, such as upcoming maintenance or changes in asset status.
*   **Reporting and Analytics:** Generate reports on asset utilization, maintenance history, and other key metrics to support decision-making.

## Technology Stack

This project leverages a modern technology stack to deliver a robust and user-friendly experience.

### Backend:

*   **Framework:** Laravel (PHP) - A powerful and elegant PHP framework for web application development.
*   **Key Libraries:**
    *   **Spatie/laravel-permission:** For managing user roles and permissions.
    *   **Endroid QR Code:** For generating QR codes.

### Frontend:

*   **Framework:** React (JavaScript) - A popular JavaScript library for building user interfaces.
*   **Bridge:** Inertia.js - Connects the Laravel backend with the React frontend, allowing for seamless single-page application development.
*   **Styling:** Tailwind CSS - A utility-first CSS framework for rapid UI development.
*   **Key Libraries & Tools:**
    *   **Ziggy:** For using Laravel named routes in JavaScript.
    *   **Zustand:** For state management in React.
    *   **Headless UI:** Unstyled, fully accessible UI components.
    *   **Radix UI:** Low-level UI primitives for building design systems.
    *   **Lucide Icons:** A comprehensive and customizable SVG icon set.

## User Roles

The application utilizes a role-based access control system to manage user permissions. The following roles are defined:

*   **Super Admin (`super-admin`):**
    *   Has unrestricted access to all features and functionalities of the application.
    *   Responsible for overall system administration, including managing companies, users, and system settings.
    *   Can perform all CRUD (Create, Read, Update, Delete) operations on all resources.

*   **Admin (`admin`):**
    *   Has broad access to manage the core operational aspects of the application.
    *   Responsibilities include:
        *   Managing companies (view, create, update).
        *   Managing stores (view, create, update, delete).
        *   Managing inventory items (view, create, update, delete).
        *   Managing maintenance schedules (view, create, update, delete).
        *   Managing feedback (view, create, update, delete).
    *   Typically oversees a specific company or a set of stores.

*   **Technician (`technician`):**
    *   Focused on performing maintenance tasks and managing inventory at an operational level.
    *   Responsibilities include:
        *   Viewing store information.
        *   Viewing inventory items.
        *   Viewing and updating maintenance schedules (e.g., marking tasks as complete).
        *   Viewing and creating feedback (e.g., reporting issues, providing task updates).

*   **Client (`client`):**
    *   Typically represents an end-user or stakeholder who needs to view information and provide feedback.
    *   Responsibilities include:
        *   Viewing store information.
        *   Viewing maintenance schedules relevant to them.
        *   Viewing, creating, updating, and deleting their own feedback.
        *   This role allows clients to stay informed and communicate effectively regarding assets and services.

The permissions for each role are centrally managed to ensure data security and operational integrity.

## Project Structure

The project follows a standard Laravel structure with specific organization for the frontend components, facilitated by Inertia.js.

### Backend (Laravel - PHP):

*   **`app/Http/Controllers`**: Contains the controller classes that handle incoming HTTP requests and orchestrate responses. This is the "C" in MVC.
*   **`app/Models`**: Defines the Eloquent models, which represent the application's data and interact with the database. This is the "M" in MVC.
*   **`app/Http/Requests`**: Stores custom request validation classes to handle form input validation.
*   **`app/Policies`**: Contains authorization policy classes that determine if a user can perform a given action on a resource.
*   **`app/Providers`**: Houses service providers that bootstrap and configure various application services.
*   **`routes`**:
    *   **`web.php`**: Defines the web routes that are accessible via a browser, including those handled by Inertia.js.
    *   **`api.php`**: Defines API routes.
*   **`database`**:
    *   **`migrations`**: Contains database schema migration files for managing database structure.
    *   **`seeders`**: Includes seeder classes for populating the database with initial or test data (e.g., roles, default users).
    *   **`factories`**: Defines model factories for generating fake data for testing and seeding.
*   **`config`**: Stores all application configuration files (e.g., `app.php`, `database.php`, `permission.php`).

### Frontend (React - JavaScript with Inertia.js):

Since Inertia.js is used, traditional Laravel Blade views in `resources/views` for full page loads are minimal. Instead, the frontend is primarily built with React components:

*   **`resources/js/Pages`**: Contains the main page components that correspond to specific routes. These are the "Views" in an Inertia-powered Laravel application, rendered by React. Each file or directory here typically represents a page or a group of related pages.
*   **`resources/js/components`**: Stores reusable React components (e.g., buttons, modals, layout elements) that are used across various pages.
*   **`resources/js/layouts`**: Contains layout components that define the common structure for different types of pages (e.g., authenticated app layout, guest layout).
*   **`resources/js/lib`**: Utility functions and helper modules for the frontend.
*   **`resources/js/hooks`**: Custom React hooks for reusable stateful logic.
*   **`resources/css`**: Contains CSS files, including `app.css` which is often used for global styles or Tailwind CSS imports.
*   **`public`**: The web server's document root. Contains compiled assets (CSS, JS), images, and other publicly accessible files.

This structure promotes a clear separation of concerns and leverages the strengths of both Laravel for the backend and React for a dynamic frontend experience.
