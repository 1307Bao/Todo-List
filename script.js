// Add task with deadline and custom time
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const taskTimeInput = document.getElementById("taskTime");
    const taskText = taskInput.value.trim();
    const deadlineValue = deadlineInput.value;
    const customTime = taskTimeInput.value ? taskTimeInput.value * 60 : 0; // Convert to seconds
  
    if (taskText === "") return;
  
    const li = document.createElement("li");
  
    // Task text
    const taskTextDiv = document.createElement("div");
    taskTextDiv.className = "task-text";
    taskTextDiv.textContent = taskText;
    li.appendChild(taskTextDiv);
  
    // Deadline
    if (deadlineValue) {
      const deadline = new Date(deadlineValue);
      const formattedDeadline = deadline.toLocaleString();
      const deadlineDiv = document.createElement("div");
      deadlineDiv.className = "deadline";
      deadlineDiv.textContent = `⏰ Deadline: ${formattedDeadline}`;
      li.appendChild(deadlineDiv);
  
      // Alert if deadline is near
      const currentTime = new Date();
      const deadlineTime = new Date(deadlineValue);
      const timeDiff = deadlineTime - currentTime;
  
      if (timeDiff > 0 && timeDiff < 5 * 60 * 1000) {
        setTimeout(() => {
          alert(`Deadline for "${taskText}" is near!`);
        }, timeDiff);
      }
    }
  
    // Custom time (Pomodoro related)
    if (customTime > 0) {
      const timeControlDiv = document.createElement("div");
      timeControlDiv.className = "time-control";
      
      const customTimeDiv = document.createElement("div");
      customTimeDiv.className = "custom-time";
      customTimeDiv.textContent = `⏱️ Focus Time: ${customTime / 60} minutes`;
      
      const removeTimeBtn = document.createElement("button");
      removeTimeBtn.className = "remove-time-btn";
      removeTimeBtn.textContent = "❌";
      removeTimeBtn.title = "Remove custom time";
      removeTimeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        timeControlDiv.remove();
        saveTasks();
      });
      
      timeControlDiv.appendChild(customTimeDiv);
      timeControlDiv.appendChild(removeTimeBtn);
      li.appendChild(timeControlDiv);
      
      // Add "Use for Pomodoro" button
      const useForPomodoroBtn = document.createElement("button");
      useForPomodoroBtn.className = "use-pomodoro-btn";
      useForPomodoroBtn.textContent = "▶️ Use for Pomodoro";
      useForPomodoroBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Set pomodoro time to this task's time
        document.getElementById("focus-time").value = customTime / 60;
        updatePomodoroTime();
      });
      li.appendChild(useForPomodoroBtn);
    }
  
    // Toggle completed
    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      saveTasks();
    });
  
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
      saveTasks();
    });
  
    li.appendChild(deleteBtn);
    document.getElementById("taskList").appendChild(li);
  
    // Save tasks to localStorage
    saveTasks();
  
    // Clear inputs
    taskInput.value = "";
    deadlineInput.value = "";
    taskTimeInput.value = "";
  }
  
  // Save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    const taskList = document.getElementById("taskList").children;
  
    for (let task of taskList) {
      const taskText = task.querySelector(".task-text").textContent;
      const deadline = task.querySelector(".deadline") ? task.querySelector(".deadline").textContent : "";
      const customTime = task.querySelector(".custom-time") ? task.querySelector(".custom-time").textContent : "";
      const isCompleted = task.classList.contains("completed");
      tasks.push({ taskText, deadline, customTime, isCompleted });
    }
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
      const li = document.createElement("li");
      if (task.isCompleted) {
        li.classList.add("completed");
      }
  
      // Task text
      const taskTextDiv = document.createElement("div");
      taskTextDiv.className = "task-text";
      taskTextDiv.textContent = task.taskText;
      li.appendChild(taskTextDiv);
  
      // Display deadline
      if (task.deadline) {
        const deadlineDiv = document.createElement("div");
        deadlineDiv.className = "deadline";
        deadlineDiv.textContent = task.deadline;
        li.appendChild(deadlineDiv);
      }
  
      // Display custom time
      if (task.customTime) {
        const timeControlDiv = document.createElement("div");
        timeControlDiv.className = "time-control";
        
        const customTimeDiv = document.createElement("div");
        customTimeDiv.className = "custom-time";
        customTimeDiv.textContent = task.customTime;
        
        const removeTimeBtn = document.createElement("button");
        removeTimeBtn.className = "remove-time-btn";
        removeTimeBtn.textContent = "❌";
        removeTimeBtn.title = "Remove custom time";
        removeTimeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          timeControlDiv.remove();
          saveTasks();
        });
        
        timeControlDiv.appendChild(customTimeDiv);
        timeControlDiv.appendChild(removeTimeBtn);
        li.appendChild(timeControlDiv);
        
        // Add "Use for Pomodoro" button
        const useForPomodoroBtn = document.createElement("button");
        useForPomodoroBtn.className = "use-pomodoro-btn";
        useForPomodoroBtn.textContent = "▶️ Use for Pomodoro";
        useForPomodoroBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          // Extract time value from text
          const timeText = task.customTime;
          const minutes = parseInt(timeText.match(/\d+/)[0]);
          
          // Set pomodoro time to this task's time
          document.getElementById("focus-time").value = minutes;
          updatePomodoroTime();
        });
        li.appendChild(useForPomodoroBtn);
      }
  
      // Toggle completed
      li.addEventListener("click", () => {
        li.classList.toggle("completed");
        saveTasks();
      });
  
      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks();
      });
  
      li.appendChild(deleteBtn);
      document.getElementById("taskList").appendChild(li);
    });
  }
  
  // Pomodoro Timer
  let pomodoroTimer;
  let pomodoroTimeLeft = 25 * 60; // 25 minutes by default
  let isBreakTime = false;
  
  function updatePomodoroTime() {
    const focusTimeInput = document.getElementById("focus-time");
    const breakTimeInput = document.getElementById("break-time");
    
    const focusMinutes = parseInt(focusTimeInput.value) || 25;
    const breakMinutes = parseInt(breakTimeInput.value) || 5;
    
    // Save preferences
    localStorage.setItem("pomodoroSettings", JSON.stringify({
      focusTime: focusMinutes,
      breakTime: breakMinutes
    }));
    
    // If not currently in a session, update the display
    if (!pomodoroTimer) {
      if (!isBreakTime) {
        pomodoroTimeLeft = focusMinutes * 60;
      } else {
        pomodoroTimeLeft = breakMinutes * 60;
      }
      updatePomodoroDisplay();
    }
  }
  
  function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    document.getElementById("pomodoro-time").textContent = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update status text
    document.getElementById("pomodoro-status").textContent = 
      isBreakTime ? "Break Time! 😌" : "Focus Time! 🧠";
    
    // Update background color based on mode
    document.getElementById("pomodoro").style.backgroundColor = 
      isBreakTime ? "#d0f0c0" : "#ffe3e1";
  }
  
  function startPomodoro() {
    // Stop any existing timer
    if (pomodoroTimer) {
      clearInterval(pomodoroTimer);
    }
    
    document.getElementById("start-pomodoro").disabled = true;
    document.getElementById("stop-pomodoro").disabled = false;
    
    // Play background music
    playBackgroundMusic();
    
    // Start the timer
    pomodoroTimer = setInterval(() => {
      if (pomodoroTimeLeft <= 0) {
        // Switch between focus and break
        isBreakTime = !isBreakTime;
        
        const settings = JSON.parse(localStorage.getItem("pomodoroSettings")) || { 
          focusTime: 25, 
          breakTime: 5 
        };
        
        if (isBreakTime) {
          pomodoroTimeLeft = settings.breakTime * 60;
          alert("Focus session finished! Time for a break!");
        } else {
          pomodoroTimeLeft = settings.focusTime * 60;
          alert("Break finished! Back to focus!");
        }
        
        updatePomodoroDisplay();
      } else {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
      }
    }, 1000);
  }
  
  function stopPomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroTimer = null;
    document.getElementById("start-pomodoro").disabled = false;
    document.getElementById("stop-pomodoro").disabled = true;
    
    // Stop background music
    pauseBackgroundMusic();
    
    // Reset to focus time
    isBreakTime = false;
    updatePomodoroTime();
  }
  
  // Handle music file upload
  function handleMusicUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Save the file name to localStorage
      localStorage.setItem("customMusicName", file.name);
      
      // Create object URL for the uploaded file
      const musicPlayer = document.getElementById("background-music");
      const musicURL = URL.createObjectURL(file);
      
      // Update music source
      musicPlayer.src = musicURL;
      
      // Update UI to show current music
      document.getElementById("current-music").textContent = file.name;
      document.getElementById("music-container").style.display = "block";
      
      // Update localStorage to remember this music selection
      localStorage.setItem("customMusicURL", musicURL);
    }
  }
  
  // Start Background Music
  function playBackgroundMusic() {
    const music = document.getElementById("background-music");
    
    // Set volume from range input
    const volumeControl = document.getElementById("volume-control");
    music.volume = volumeControl.value / 100;
    
    music.play().catch(error => {
      console.log("Music playback failed:", error);
      // Some browsers require user interaction before playing audio
      document.getElementById("music-error").style.display = "block";
    });
  }
  
  // Pause Background Music
  function pauseBackgroundMusic() {
    const music = document.getElementById("background-music");
    music.pause();
  }
  
  // Load saved music preference
  function loadMusicPreferences() {
    const savedMusicName = localStorage.getItem("customMusicName");
    
    if (savedMusicName) {
      document.getElementById("current-music").textContent = savedMusicName;
      document.getElementById("music-container").style.display = "block";
    } else {
      document.getElementById("music-container").style.display = "none";
    }
    
    // Set volume from saved preference or default
    const savedVolume = localStorage.getItem("musicVolume") || 30;
    const volumeControl = document.getElementById("volume-control");
    volumeControl.value = savedVolume;
    
    // Update volume display
    document.getElementById("volume-display").textContent = `${savedVolume}%`;
  }
  
  // Update volume level
  function updateVolume() {
    const volumeControl = document.getElementById("volume-control");
    const music = document.getElementById("background-music");
    const volumeValue = volumeControl.value;
    
    // Save to localStorage
    localStorage.setItem("musicVolume", volumeValue);
    
    // Update the audio volume
    music.volume = volumeValue / 100;
    
    // Update the display
    document.getElementById("volume-display").textContent = `${volumeValue}%`;
  }
  
  // Load saved Pomodoro settings
  function loadPomodoroSettings() {
    const settings = JSON.parse(localStorage.getItem("pomodoroSettings")) || { 
      focusTime: 25, 
      breakTime: 5 
    };
    
    document.getElementById("focus-time").value = settings.focusTime;
    document.getElementById("break-time").value = settings.breakTime;
    
    pomodoroTimeLeft = settings.focusTime * 60;
    updatePomodoroDisplay();
  }
  
  // Initialize app
  function initApp() {
    loadTasks();
    loadPomodoroSettings();
    loadMusicPreferences();
    
    // Set up event listeners
    document.getElementById("start-pomodoro").addEventListener("click", startPomodoro);
    document.getElementById("stop-pomodoro").addEventListener("click", stopPomodoro);
    document.getElementById("focus-time").addEventListener("change", updatePomodoroTime);
    document.getElementById("break-time").addEventListener("change", updatePomodoroTime);
    document.getElementById("stop-pomodoro").disabled = true;
    
    // Music upload listener
    document.getElementById("music-upload").addEventListener("change", handleMusicUpload);
    
    // Volume control listener
    document.getElementById("volume-control").addEventListener("input", updateVolume);
    
    // Music toggle button
    document.getElementById("music-toggle").addEventListener("click", () => {
      const music = document.getElementById("background-music");
      if (music.paused) {
        playBackgroundMusic();
        document.getElementById("music-toggle").textContent = "🔇 Pause Music";
      } else {
        pauseBackgroundMusic();
        document.getElementById("music-toggle").textContent = "🔊 Play Music";
      }
    });
  }
  
  // Initialize everything when page loads
  window.addEventListener("DOMContentLoaded", initApp);