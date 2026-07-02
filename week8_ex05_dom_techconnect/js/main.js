/* Centralising Data */

let appState = {
  //Developers loaded from JSON
  allDevelopers: [],

  //Filtered Developers 
  filteredDevelopers: [],

  //View Mode
  currentView: "card",

  nextId: 16,
};

/* Loading Developers from JSON */
async function loadDevelopers() {
  try {
    //Requesting Data
    const response = await fetch("developers.json");

    //Check if request was successful
    if (!response.ok) {
      throw new Error(`Error! Status: ${response.status}`);
    }

    //Convert JSON text into Javascript 
    const developers = await response.json();

    //Store converted data in appState
    appState.allDevelopers = developers;
    appState.filteredDevelopers = [...developers];

    //Updating nextId
    appState.nextId = Math.max(...developers.map((d) => d.id)) + 1;

    //Render
    renderDeveloperCards();
    renderDeveloperTable();
    updateDeveloperCount();
  } catch (error) {
    console.error("Error loading developers:", error);
    alert(`Failed to load developers.
      Please refresh the page.`);
  }
}

//Card View - Dynamic Rendering 
function renderDeveloperCards() {
  const container = document.querySelector("#developerCards");

  //Prevent Duplicate cards when re-rendering 
  container.innerHTML = "";

  appState.filteredDevelopers.forEach((developer) => {
    //create cardHtml
    const cardHTML = `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card" data-developer-id="${developer.id}">
          
          <!-- Card Avatar, Name + Role -->
          <div class="card-header">
            <img src="${developer.avatar}" alt="${developer.name}" class="cardAvatar"/>
            <div class="card-headerText">
              <h3 class="cardName">${developer.name}</h3>
              <p class="cardRole">${developer.role}</p>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">

            <!-- Location -->
            <div class="cardDetail">
              <span class="cardDetail-label">📍 Location</span>
              <span class="cardDetail-value">${developer.location}</span>
            </div>

            <!-- Skills -->
            <div class="cardDetail">
              <span class="cardDetail-label">Skills</span>
              <div class="skillsList">${developer.skills.map((skill) => `<span class="skillTag">${skill}</span>`).join("")}
              </div>
            </div>

            <!-- Available for hire Badge -->
            <div class="cardDetail">${developer.availableForHire ? `
                <div class="availableBadge">
                  <span class="badge-dot"></span>
                  Available for Hire
                </div>`: ""
              }
              </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
              <button
                class="cardAction-btn toggleHire-btn"
                data-developer-id="${developer.id}"
                title="${developer.availableForHire ? "Mark as unavailable" : "Mark as available"}">
                  ${developer.availableForHire ? "Mark Unavailable" : "Mark Available"}
                </button>
          </div>
        </div>
      </div>`
      
  //DOM Application
  container.insertAdjacentHTML("beforeend", cardHTML);
  });

  attachCardEventListeners();
}

//Table View
function renderDeveloperTable() {
  const tbody = document.querySelector('#developerTableBody');
  tbody.innerHTML = "";

  appState.filteredDevelopers.forEach((developer) => {
    const rowHTML = `
      <tr data-developer-id="${developer.id}">
        <td>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="${developer.avatar}" alt="${developer.name}"
              style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accentBeige);"/>
            <span class="tableName">${developer.name}</span>  
          </div>
        </td>
        <td class="tableRole">${developer.role}</td>
        <td class="tableSkills">${developer.skills.slice(0, 3).join(", ")}${developer.skills.length > 3 ? "..." : ""}</td>
        <td class="tableLocation">${developer.location}</td>
        <td>${developer.availableForHire ? `<span class="availableBadge"><span class="badgeDot"></span>Available</span>` : `<span style="color: var(--textLight);">Unavailable</span>`}
        </td>
        <td>
          <button
            class="cardAction-btn toggleHire-btn"
            data-developer-id="${developer.id}"
            style="padding: 0.5rem 1rem; font-size: 0.85rem;"
            title="${developer.availableForHire ? "Mark as unavailable" : "Mark as available"}">
              ${developer.availableForHire ? "Unavailable" : "Available"}
            </button>
        </td>
      </tr>`;

      tbody.insertAdjacentHTML("beforeend", rowHTML);
  });

  attachCardEventListeners();
}

//Event Listeners
function attachCardEventListeners() {
  //All Toggle Buttons
  const toggleButtons = document.querySelectorAll(".toggleHire-btn");

  toggleButtons.forEach((button) => {
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll(".toggleHire-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const developerId = parseInt(this.getAttribute("data-developer-id"));

      //Toggle the availableForHire status
      toggleDeveloperAvailability(developerId)
    });
  });
}

/* --- Live Search/Filtering --- */
//setupSearchListener() function
function setupSearchListener() {
  const searchInput = document.querySelector('#searchInput');

  searchInput.addEventListener("input", function () {
    //Getting search query
    const query = this.value.toLowerCase().trim();

    //Filtering Logic
    if (query === "") {
      //if search is empty show all developers 
      appState.filteredDevelopers = [...appState.allDevelopers];
    } else {
      //filter based on query
      appState.filteredDevelopers = appState.allDevelopers.filter((dev) => {
        //Checking if query matches name, role, or a skill
        const nameMatch = dev.name.toLowerCase().includes(query);
        const roleMatch = dev.role.toLowerCase().includes(query);
        const skillMatch = dev.skills.some((skill) =>
        skill.toLowerCase().includes(query));

        return nameMatch || roleMatch || skillMatch;
      });
    }

    //Updating the displayed data 
    renderDeveloperCards();
    renderDeveloperTable();
    updateDeveloperCount();
    updateEmptyState();
  });
}

/* --- Form Submission --- */
//setupFormListener() funnction
function setupFormListener() {
  const form = document.querySelector('#addDeveloperForm');
  const modal = document.querySelector('#addDeveloperModal');

  form.addEventListener("submit", function (e) {
    //Preventing form default behaviour
    e.preventDefault();
    
    //validating all fields
    if (!validateForm()) {
      return;
    }

    //Getting Form Values
    const newDeveloper = {
      //Generating Unique Id
      id: appState.nextId++,
      name: document.querySelector('#developerName').value.trim(),
      role: document.querySelector('#developerRole').value,
      skills: document.querySelector('#developerSkills').value.split(",").map((s) => s.trim()),
      location: document.querySelector('#developerLocation').value.trim(),
      availableForHire: document.querySelector('#availableForHire').checked,
      avatar: `https://placehold.co/100x100/${getRandomColour()}/ffffff`
    };

    //Add New Developer to appState
    appState.allDevelopers.push(newDeveloper);
    appState.filteredDevelopers.push(newDeveloper);

    //Updating the UI
    renderDeveloperCards();
    renderDeveloperTable();
    updateDeveloperCount();
    updateEmptyState();

    //Reset form + close modal
    form.reset();

    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  });
}

/* --- Form Validation --- 
* Validation Checks: 
* ~ name must not be empty and have at least 2 characters
* ~ role must be selected
* ~ must have entered at least one skill
* ~ loaction must not be empty 
*/

function validateForm() {
  const name = document.querySelector('#developerName');
  const role = document.querySelector('#developerRole');
  const skills = document.querySelector('#developerSkills');
  const location = document.querySelector('#developerLocation');

  let isValid = true;

  //Name Validation 
  if (name.value.trim().length < 2) {
    name.classList.add("isInvalid");
    isValid = false;
  } else {
    name.classList.remove("isInvalid");
  }

  //Role Validation 
  if (role.value === "") {
    role.classList.add("isInvalid");
    isValid = false;
  } else {
    role.classList.remove("isInvalid");
  }

  //Skills Validation
  if (skills.value.trim() === "") {
    skills.classList.add("isInvalid");
    isValid = false;
  } else {
    skills.classList.remove("isInvalid");
  }

  //Location Validation
  if (location.value.trim() === "") {
    location.classList.add("isInvalid");
    isValid = false;
  } else {
    location.classList.remove("isInvalid");
  }

  return isValid;
}

/* --- Toggle View Logic --- */
function setupViewToggle() {
  const toggleButton = document.querySelector('#viewToggle');
  const cardView = document.querySelector('#cardView');
  const tableView = document.querySelector('#tableView');

  toggleButton.addEventListener("click", function () {
    //Checcking which view is currently displayed 
    if (appState.currentView === "card") {
      //Current View = Card View Switch to Table
      tableView.classList.remove("d-none");
      cardView.classList.add("d-none");

      //Updating Button Appearance 
      toggleButton.classList.remove("d-none");
      toggleButton.innerHTML = `<span class="toggleIcon">🔀</span>
      <span class="toggleText">Card View</span>`;

      //Update appState
      appState.currentView = "table";
    } else {
      //Current View = table, switch to card view
      cardView.classList.remove("d-none");
      tableView.classList.add("d-none");

      //Update Button Display
      toggleButton.classList.add("active");
      toggleButton.innerHTML = `<span class="toggleIcon">🔀</span>
      <span class="toggleText">Table View</span>`;

      //Update appState
      appState.currentView = "card";
    }
  });
}

/* --- Available for Hire Toggle --- */
function toggleDeveloperAvailability(developerId) {
  //finding developer
  const developer = appState.allDevelopers.find((d) => d.id === developerId);

  if (developer) {
    developer.availableForHire = !developer.availableForHire;

    //re-rendering
    renderDeveloperCards();
    renderDeveloperTable();
  }
}

/* --- Developer Counter --*/
function updateDeveloperCount() {
  const countElement = document.querySelector('#developerCount');
  countElement.textContent = appState.filteredDevelopers.length;
}

/* --- No Match/Empty State --- */
function updateEmptyState() {
  const emptyState = document.querySelector('#emptyState');
  const cardView = document.querySelector('#cardView');
  const tableView = document.querySelector('#tableView');

  if (appState.filteredDevelopers.length === 0) {
    emptyState.classList.remove("d-none");
    cardView.classList.add("d-none");
    tableView.classList.add("d-none");
  } else {
    emptyState.classList.add("d-none");
    
    if (appState.currentView === "card") {
      cardView.classList.add("d-none");
      tableView.classList.remove("d-none");
    }
  };
}

//getRandomColour() Utility Function 
function getRandomColour() {
  const colours = [
    "4F81BD", //BLUE
    "9BBB59", //GREEN
    "C0504D", //RED
    "F79646", //ORANGE
    "8064A2", //PURPLE
    "17375E", //DARK BLUE
    "538135", //DARK GREEN
    "833C00", //BROWN
    "31849B", //TEAL
  ];

  return colours[Math.floor(Math.random() * colours.length)];
}

//Initialising The App

async function initialiseApp() {
  //Load data from JSON
  await loadDevelopers();

  //Search Functionality
  setupSearchListener();

  //Form Submission
  setupFormListener();

  //View Toggle
  setupViewToggle();
}

document.addEventListener("DOMContentLoaded", function () {
  initialiseApp();
});
