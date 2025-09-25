document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  if (!userSelect) return; // stop if element not present

  const newUserInput = document.getElementById("newUser");
  const addUserBtn = document.getElementById("addUserBtn");
  const selectUserBtn = document.getElementById("selectUserBtn");

  // Load users from localStorage
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  function populateUsers() {
    userSelect.innerHTML = "";
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user;
      option.textContent = user;
      userSelect.appendChild(option);
    });
  }

  populateUsers();

  // Add new user
  if (addUserBtn && newUserInput) {
    addUserBtn.addEventListener("click", () => {
      const name = newUserInput.value.trim();
      if (name && !users.includes(name)) {
        users.push(name);
        localStorage.setItem("users", JSON.stringify(users));
        populateUsers();
        newUserInput.value = "";
      }
    });
  }

  // Select user
  if (selectUserBtn) {
    selectUserBtn.addEventListener("click", () => {
      const selectedUser = userSelect.value;
      if (selectedUser) {
        alert(`Selected user: ${selectedUser}`);
        // Later: save selection or pass to calendar
      }
    });
  }
});
