
// Staff list
const staff = [
  { name: "Adesina", color: "crimson" },
  { name: "Ayomide", color: "royalblue" },
  { name: "Temitayo", color: "seagreen" },
  { name: "Olayinka", color: "goldenrod" },
  { name: "Comfort", color: "pink" },
  { name: "Damilola", color: "Grey" },
  { name: "Glory", color: "Green" },
  { name: "Chidinma", color: "Blue" },
  { name: "Adebayo", color: "Black" },
  { name: "Collins", color: "Brown" },
  { name: "Olusegun", color: "Gold" },
  { name: "Ariel", color: "skyblue" },
  
];
let excludedName = " ";
let assignments = [];
let alreadyClicked = false;



// --- NEW: persistence keys ---
const STORAGE_KEYS = {
  ASSIGNMENTS: 'secretSanta_assignments',
  CLICKED_RECIPIENT: 'secretSanta_clicked_recipient'
};


// Generate random assignments (Secret Santa rules)
// Exclude a staff member by name
function excludeMyName() {
  const name = document.getElementById("excludeName").value.trim();
  if (name && staff.some(s => s.name === name)) {
    excludedName = name;
    document.getElementById("excludeMsg").innerText = `${name} will not be assigned a recipient.`;
    assignRecipients(); // re-run assignments without excluded person
    renderCircles();
  } else {
    document.getElementById("excludeMsg").innerText = "Name not found in staff list.";
  }
}

function assignRecipients() {
  let givers = staff.filter(s => s.name !== excludedName);
  let receivers = [...staff];
  let valid = false;

  while (!valid) {
    receivers.sort(() => Math.random() - 0.5);
    valid = givers.every((giver, i) => giver.name !== receivers[i].name);
  }

  assignments = givers.map((giver, i) => ({
    ...giver,
    recipient: receivers[i].name
  }));
// --- NEW: save assignments to localStorage ---
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

// Build the circles
function renderCircles() {
  const container = document.getElementById("circles");
  container.innerHTML = "";

  assignments.forEach((person) => {
    const circle = document.createElement("div");
    circle.className = "circle";
    circle.style.background = person.color;
    circle.innerText = "?";

    circle.onclick = () => {
      if (!alreadyClicked) {
        circle.innerText = person.recipient;
        alreadyClicked = true;
// --- NEW: save picked recipient ---
        localStorage.setItem(STORAGE_KEYS.CLICKED_RECIPIENT, person.recipient);

        // lock all other circles
        document.querySelectorAll(".circle").forEach(c => {
          if (c !== circle) {
            c.classList.add("locked");
          }
        });
      }
    };

    container.appendChild(circle);
  });
}

// Initialize
window.onload = () => {
  // --- NEW: try to load saved assignments ---
  const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
  if (savedAssignments) {
    assignments = JSON.parse(savedAssignments);
  } else {
    assignRecipients();
  }

  renderCircles();

  // --- NEW: check if user already picked ---
  const savedRecipient = localStorage.getItem(STORAGE_KEYS.CLICKED_RECIPIENT);
  if (savedRecipient) {
    const msg = document.getElementById("pickedMsg");
    msg.innerHTML = `<p>You already picked: <strong>${savedRecipient}</strong></p>`;
    alreadyClicked = true;
  }
};

// --- NEW: Reset Game button logic ---
document.getElementById("resetBtn").onclick = () => {
  localStorage.clear();
  location.reload(); // refresh to start fresh
};
