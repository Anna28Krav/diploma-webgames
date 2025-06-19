document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const allowedEmails = [
    "anna611552@gmail.com",
    "diplom20251111@gmail.com"
  ];

  const enteredEmail = document.getElementById("adminEmail").value.trim().toLowerCase();

  if (allowedEmails.includes(enteredEmail)) {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html"; // переход в адмінку
  } else {
    document.getElementById("loginError").style.display = "block";
  }
});
