# Turbo Monorepo with shadcn/ui

This project is a **monorepo** setup using **Turborepo** for efficiently managing multiple interconnected projects. The
monorepo features two primary applications, set up with shared UI components designed using **shadcn/ui**. It is
tailored to streamline both project scalability and developer experience.

---

## Projects

### 1. **EMP**: Admin Panel (Port: `3001`)

The **EMP** project is an administrative panel designed for client use. Its primary function is to allow clients to
efficiently manage and create instances through an intuitive and feature-rich user interface.

### 2. **ERP**: Enterprise Resource Planning (Port: `3000`)

The **ERP** project functions as the central administrative hub within the system. It offers enterprise-level tools and
workflows to facilitate resource management and operational efficiency for businesses.

---

## Tech Stack Highlights

### **shadcn/ui** + **Base UI**

- Both projects leverage **shadcn/ui** for building clean and consistent UI components across the monorepo.
- Shared UI components are managed in a dedicated `@workspace/ui` package, enabling reusability across applications.
- The design flexibility of **shadcn/ui**, complemented by **Base UI**, allows for adaptability while maintaining a
  cohesive visual appearance.

---

## Shared Packages & Features

### **Reusable Components**

The system includes a shared component library located in the `packages/ui` directory. These components can be easily
integrated into both projects using the following example:

---

## Quick Start

### Local Development

Each project is configured to run independently. To start the development environment:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server for a specific app (from root):
   ```bash
   pnpm dev --filter erp # For ERP (Enterprise Resource Planning)
   ```
    ```bash
   pnpm dev --filter emp # For EMP (Admin Panel)
    ```

   2.1 Or run `dev` script directly from `apps/[project_name]/package.json`

## Folder Structure

- **apps/**
    - **emp/** - The admin panel for client instance management.
    - **erp/** - The enterprise resource planning (ERP) system.
- **packages/**
    - **ui/** - The shared UI component library using **shadcn/ui**.
    - **eslint-config/** - Shared ESLint configuration for the monorepo.
    - **typescript-config/** - Shared TypeScript configurations for the monorepo.

---

## Adding Components

To add UI components to your project with **shadcn/ui**, follow these steps:

1. Use the `shadcn` CLI tool to add components to the target application within the monorepo.

2. Run the following command from the root of your project, specifying the app directory where you want the components
   added. For example:

   ```bash
   pnpm dlx shadcn@latest add <component-name> -c apps/<app-name>
   ```

   Example for the **EMP app**:
   ```bash
   pnpm dlx shadcn@latest add button -c apps/emp
   ```

   Example for the **ERP app**:
   ```bash
   pnpm dlx shadcn@latest add button -c apps/erp
   ```

3. This will add the component code to the directory:
   ```
   packages/ui/src/components/<component-name>
   ```

4. To use the component in your app, import it directly from the shared `ui` package:

   ```tsx
   import { Button } from "@workspace/ui/components/button";
   ```

### Notes:

- You can install multiple components using the same command by listing their names separated by spaces:
  ```bash
  pnpm dlx shadcn@latest add button input card -c apps/emp
  ```
- Ensure that your `tailwind.config.ts` is correctly set up to recognize styles from the shared `ui` components. This is
  preconfigured in this template.

By using this approach, you ensure that the UI components are shared and reusable across all apps in the monorepo.


