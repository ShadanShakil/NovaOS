# NovaOS - Browser-Based Operating System Simulator

NovaOS is a highly interactive, browser-based operating system simulator designed to teach and visualize core operating system concepts. Built with **Next.js 16**, **React 19**, **Zustand 5**, and **Tailwind CSS 4**.

---

## 🚀 Live Simulation Features

1. **CLI Terminal**:
   - A simulated UNIX-style shell linked to the Virtual File System (VFS).
   - Supports: `ls`, `cd [dir]`, `pwd`, `mkdir [dir]`, `touch [file]`, `rm [file/dir]`, `uname`, `date`, `clear`, and `help`.
   - Autoscrolling history for a smoother command-line interface experience.

2. **File Explorer**:
   - A graphical interface to navigate the Virtual File System.
   - Real-time updates: files/folders created via the terminal immediately reflect in the File Explorer (and vice-versa).
   - Support for relative/absolute paths and parent folder navigation (`..`).

3. **CPU Scheduler Lab**:
   - Simulated scheduler visualizer supporting **FCFS**, **SJF**, **Priority**, and **Round Robin** algorithms.
   - Features a dynamic Gantt chart visualization showing execution segments.
   - Interactive statistics table detailing **Wait Time**, **Turnaround Time**, and **Average Wait/Turnaround Times**.
   - Fully synced process state with the Task Manager.

4. **Memory Visualizer**:
   - Live RAM allocation map simulating partitioning schemes: **First Fit**, **Best Fit**, and **Worst Fit**.
   - Includes **Block Splitting** on allocation and **Fragmentation Coalescing** (adjacent block merging) on deallocation.

5. **Task Manager**:
   - Displays all active system and user-defined processes.
   - Real-time CPU and Memory usage tracking.
   - Allows killing processes directly, which instantly syncs and terminates them across other components like the CPU Scheduler.

6. **Desktop Window Manager**:
   - Multi-window workspace with drag-and-drop window positioning.
   - Standard window controls: traffic-light styled buttons for Minimize, Maximize, and Close.
   - Window stacking (monotonically increasing z-index) focusing the last-interacted window.
   - Taskbar running-apps list showing active window states and toggles.

7. **Persistence**:
   - Utilizes Zustand's local storage persistence to remember directory changes, process configurations, and window layout across page reloads.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router)
* **Frontend Logic**: React 19 (Client Components)
* **State Management**: Zustand 5 (Persistent Storage)
* **Styling**: Tailwind CSS 4
* **Icons**: Lucide React
* **Unit Testing**: Vitest

---

## 💻 Getting Started

### Prerequisites

* Node.js (v18.x or later)
* npm (v9.x or later)

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/Raffay-Sharjeel/OPERATING-SYSTEM-LAB.git
   cd OPERATING-SYSTEM-LAB/nova-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to start the simulation.

### Running Unit Tests

To run the automated test suite for CPU scheduling and memory partitioning algorithms:
```bash
npm run test
```
