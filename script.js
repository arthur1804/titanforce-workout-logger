let exercisesByDate = {};
let currentDate = getToday();
const input = document.getElementById("exerciseInput");
const list = document.getElementById("exerciseList");
const dateSelect = document.getElementById("dateSelect");

checkLogin();
loadExercises();
renderDates();
renderList();

function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0]; 
}

function saveExercises() {
  localStorage.setItem(getUserKey(), JSON.stringify(exercisesByDate));
}

function loadExercises() {
  const saved = localStorage.getItem(getUserKey());
  if (saved) exercisesByDate = JSON.parse(saved);
  else exercisesByDate = {};
}

function renderDates() {
  dateSelect.innerHTML = "";
  const dates = Object.keys(exercisesByDate).sort((a, b) => new Date(b) - new Date(a));

  dates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = new Date(date).toLocaleDateString();
    if (date === currentDate) option.selected = true;
    dateSelect.appendChild(option);
  });
}

function renderList() {
    list.innerHTML = "";
  
    const categoryFilter = document.getElementById("categoryFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;
  
    const exercises = exercisesByDate[currentDate] || [];
  
    exercises.forEach((exercise, index) => {
      const matchesCategory = categoryFilter === "Todos" || exercise.category === categoryFilter;
      const matchesStatus = statusFilter === "Todos" ||
                            (statusFilter === "Concluídos" && exercise.done) ||
                            (statusFilter === "Pendentes" && !exercise.done);
  
      if (matchesCategory && matchesStatus) {
        const li = document.createElement("li");
        li.textContent = `${exercise.text} (${exercise.category})`;
        if (exercise.done) li.classList.add("done");
  
        const toggle = document.createElement("button");
        toggle.textContent = exercise.done ? "↺" : "✓";
        toggle.style.color = "#4ade80";
        toggle.onclick = () => {
          exercise.done = !exercise.done;
          saveExercises();
          renderList();
        };
  
        const del = document.createElement("button");
        del.textContent = "✕";
        del.onclick = () => {
            deleteExercise(index);
          };
          
  
        li.appendChild(toggle);
        li.appendChild(del);
        list.appendChild(li);
      }
    });
  }
  

  function addExercise() {
    const text = document.getElementById("exerciseInput").value.trim();
    const category = document.getElementById("categoryInput").value;
  
    if (!text) {
      showMessage("O nome do exercício não pode estar vazio!", true);
      return;
    }
  
    const newExercise = { text: text, category: category, done: false };
  
    if (!exercisesByDate[currentDate]) {
      exercisesByDate[currentDate] = [];
    }
  
    exercisesByDate[currentDate].push(newExercise);
    saveExercises();
    renderList();
    renderDates();
    document.getElementById("exerciseInput").value = "";
  
   
    showMessage("Exercício adicionado com sucesso!");
  }
  

  

function changeDate() {
  currentDate = dateSelect.value;
  renderList();
}

function checkLogin() {
  const user = localStorage.getItem('titanforce_currentUser');
  if (!user) window.location.href = 'login.html';
  else document.getElementById('userDisplay').textContent = user;
}

function getUserKey() {
  const user = localStorage.getItem('titanforce_currentUser');
  return `titanforce_exercises_${user}`;
}

function logout() {
  localStorage.removeItem('titanforce_currentUser');
  window.location.href = 'login.html';
}



function showMessage(text, isError = false) {
    let messageBox = document.getElementById("messageBox");
  
    if (!messageBox) {
      messageBox = document.createElement("div");
      messageBox.id = "messageBox";
      document.body.appendChild(messageBox);
    }
  
    messageBox.textContent = text;
    messageBox.style.background = isError ? "#dc2626" : "#1f2937"; 
    messageBox.style.display = "block";
  
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 2000);
  }
  
  function deleteExercise(index) {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return;
    
    exercisesByDate[currentDate].splice(index, 1);
    saveExercises();
    renderList();
  
    showMessage("Exercício removido!", true);
  }