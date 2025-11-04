// Staff list
const staff = [
  { name: "Adesina", color: "crimson" },
  { name: "Ayomide", color: "royalblue" },
  { name: "Temitayo", color: "seagreen" },
  { name: "Olayinka", color: "goldenrod" },
  { name: "Comfort", color: "pink" },
  { name: "Damilola", color: "grey" },
  { name: "Glory", color: "green" },
  { name: "Chidinma", color: "blue" },
  { name: "Adebayo", color: "black" },
  { name: "Collins", color: "brown" },
  { name: "Olusegun", color: "gold" },
  { name: "Ariel", color: "skyblue" },
];

let assignments = [];
let excludedName = "";
let alreadyClicked = false;

const STORAGE_KEYS = {
  ASSIGNMENTS: "secretSanta_assignments",
  PICKED_NAMES: "secretSanta_picked_names"
};

// Generate random unique assignments
function assignRecipients() {
  let givers = [...staff];
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
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

// Exclude picker
function excludeMyName() {
  const name = document.getElementById("excludeName").value.trim();
  if (!name || !staff.some(s => s.name === name)) {
    document.getElementById("excludeMsg").innerText = "Name not found in staff list.";
    return;
  }

  excludedName = name;
  alreadyClicked = false;
  document.getElementById("excludeMsg").innerText = `${name} excluded.`;
  renderCircles();
}

// Render all circles
function renderCircles() {
  const container = document.getElementById("circles");
  container.innerHTML = "";

  const pickedNames = JSON.parse(localStorage.getItem(STORAGE_KEYS.PICKED_NAMES)) || [];
  const savedAssignments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) || [];

  assignments = savedAssignments.length ? savedAssignments : (assignRecipients(), assignments);

  assignments.forEach(person => {
    if (pickedNames.includes(person.recipient)) return; // recipient already picked
    if (person.name === excludedName) return; // picker excluded

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.style.background = person.color;
    circle.innerText = "?";

    circle.onclick = () => {
      if (alreadyClicked) return;

      circle.innerText = person.recipient;
      alreadyClicked = true;

      pickedNames.push(person.recipient);
      localStorage.setItem(STORAGE_KEYS.PICKED_NAMES, JSON.stringify(pickedNames));

      document.getElementById("pickedMsg").innerHTML = `${excludedName} picked <strong>${person.recipient}</strong> 🎁`;

      setTimeout(() => {
        excludedName = "";
        alreadyClicked = false;
        document.getElementById("excludeName").value = "";
        document.getElementById("excludeMsg").innerText = "Next person, enter your name!";
        renderCircles();
      }, 1500);
    };

    container.appendChild(circle);
  });
}

// Reset game
document.getElementById("resetBtn").onclick = () => {
  localStorage.clear();
  excludedName = "";
  alreadyClicked = false;
  document.getElementById("excludeMsg").innerText = "";
  document.getElementById("pickedMsg").innerText = "";
  assignRecipients();
  renderCircles();
};

// Initialize
assignRecipients();
renderCircles();
