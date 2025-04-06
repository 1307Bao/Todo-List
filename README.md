# Pomodoro To-Do List

A web-based to-do list application with task deadlines, custom focus times, and an integrated Pomodoro timer to boost productivity. Built with HTML, CSS, and JavaScript, this app helps you manage tasks efficiently while incorporating time management techniques.

## Features

- **Task Management**:
  - Add tasks with optional deadlines and custom focus times.
  - Mark tasks as completed by clicking them.
  - Delete tasks with a trash bin button.
  - Persistent storage using `localStorage`—tasks remain after page refresh.

- **Deadlines**:
  - Set deadlines for tasks with a date-time picker.
  - Receive alerts when a deadline is within 5 minutes.

- **Custom Focus Time**:
  - Assign a focus duration (in minutes) to tasks.
  - Remove custom time from a task with an "❌" button.
  - Use a task's custom time for the Pomodoro timer with the "▶️ Use for Pomodoro" button.

- **Pomodoro Timer**:
  - Customizable focus time (default: 25 minutes) and break time (default: 5 minutes).
  - Visual timer display with status updates ("Focus Time!" or "Break Time!").
  - Automatic switching between focus and break sessions with alerts.
  - Start/stop controls for the timer.

- **Background Music**:
  - Upload custom music files to play during Pomodoro sessions.
  - Adjustable volume control (saved across sessions).
  - Toggle play/pause with a button.
  - Music loops continuously during sessions (optional, enabled in code).

## Demo

Try it out by opening `index.html` in a web browser!

## Installation

1. **Clone or Download**:
   - Clone this repository:
     ```bash
     git clone https://github.com/yourusername/pomodoro-todo-list.git