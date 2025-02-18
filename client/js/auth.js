const API_URL = "http://localhost:8080/api/auth";

// **Register User**
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) window.location.href = "login.html";
});

// **Login User**
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
});

// **Logout User**
document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Logged out!");
    window.location.href = "login.html";
});

// **Check Authentication (Protect Dashboard)**
if (window.location.pathname === "/dashboard.html") {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must log in first!");
        window.location.href = "login.html";
    }
}



// document.getElementById("registerForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent form submission

//     var name = document.getElementById("name").value;
//     var email = document.getElementById("email").value;
//     var password = document.getElementById("password").value;
//     var confirmPassword = document.getElementById("confirm-password").value;

//     if (password !== confirmPassword) {
//         alert("Passwords do not match. Please try again.");
//         return;
//     }

//     alert("Registration Successful! Welcome, " + name);
// });

  