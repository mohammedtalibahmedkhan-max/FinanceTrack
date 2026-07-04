/* =====================================================
   FINTRACK V2 AUTH SYSTEM
   File: js/auth.js
===================================================== */


/* =====================================================
   ALERT SYSTEM
===================================================== */

function showAlert(message, type = "success") {

    const alertBox =
    document.getElementById("alertBox");

    if (!alertBox) return;

    alertBox.style.display = "block";

    alertBox.className =
    `alert ${type}`;

    alertBox.textContent =
    message;

    setTimeout(() => {

        alertBox.style.display =
        "none";

    }, 3000);

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

const togglePassword =
document.getElementById(
    "togglePassword"
);

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const passwordField =
            document.querySelector(
                "input[type='password']"
            );

            if (!passwordField) return;

            if (
                passwordField.type ===
                "password"
            ) {

                passwordField.type =
                "text";

                togglePassword.classList.replace(
                    "fa-eye",
                    "fa-eye-slash"
                );

            } else {

                passwordField.type =
                "password";

                togglePassword.classList.replace(
                    "fa-eye-slash",
                    "fa-eye"
                );

            }

        }
    );

}


/* =====================================================
   CONFIRM PASSWORD TOGGLE
===================================================== */

const toggleConfirmPassword =
document.getElementById(
    "toggleConfirmPassword"
);

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        () => {

            const confirmField =
            document.getElementById(
                "confirmPassword"
            );

            if (!confirmField) return;

            if (
                confirmField.type ===
                "password"
            ) {

                confirmField.type =
                "text";

                toggleConfirmPassword.classList.replace(
                    "fa-eye",
                    "fa-eye-slash"
                );

            } else {

                confirmField.type =
                "password";

                toggleConfirmPassword.classList.replace(
                    "fa-eye-slash",
                    "fa-eye"
                );

            }

        }
    );

}


/* =====================================================
   USER STORAGE
===================================================== */

function getUsers() {

    return JSON.parse(

        localStorage.getItem(
            "fintrackUsers"
        )

    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(

        "fintrackUsers",

        JSON.stringify(users)

    );

}


/* =====================================================
   REGISTER
===================================================== */

const registerForm =
document.getElementById(
    "registerForm"
);

if (registerForm) {

    registerForm.addEventListener(

        "submit",

        function (e) {

            e.preventDefault();

            const name =
            document.getElementById(
                "registerName"
            ).value.trim();

            const email =
            document.getElementById(
                "registerEmail"
            ).value.trim();

            const password =
            document.getElementById(
                "registerPassword"
            ).value;

            const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;

            if (
                password !==
                confirmPassword
            ) {

                showAlert(
                    "Passwords do not match",
                    "error"
                );

                return;
            }

            const users =
            getUsers();

            const existingUser =
            users.find(

                user =>

                user.email ===
                email

            );

            if (existingUser) {

                showAlert(
                    "Email already registered",
                    "error"
                );

                return;
            }

            users.push({

                id: Date.now(),

                name,

                email,

                password

            });

            saveUsers(users);

            showAlert(
                "Registration Successful"
            );

            setTimeout(() => {

                window.location.href =
                "login.html";

            }, 1500);

        }

    );

}


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
document.getElementById(
    "loginForm"
);

if (loginForm) {

    loginForm.addEventListener(

        "submit",

        function (e) {

            e.preventDefault();

            const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();

            const password =
            document.getElementById(
                "loginPassword"
            ).value;

            const users =
            getUsers();

            const user =
            users.find(

                item =>

                item.email === email &&
                item.password === password

            );

            if (!user) {

                showAlert(
                    "Invalid credentials",
                    "error"
                );

                return;
            }

            localStorage.setItem(

                "loggedInUser",

                JSON.stringify(user)

            );

            const remember =
            document.getElementById(
                "rememberMe"
            );

            if (
                remember &&
                remember.checked
            ) {

                localStorage.setItem(
                    "rememberUser",
                    email
                );

            }

            showAlert(
                "Login Successful"
            );

            setTimeout(() => {

                window.location.href =
                "index.html";

            }, 1200);

        }

    );

}


/* =====================================================
   AUTO FILL REMEMBERED USER
===================================================== */

const rememberedEmail =
localStorage.getItem(
    "rememberUser"
);

const loginEmail =
document.getElementById(
    "loginEmail"
);

if (
    rememberedEmail &&
    loginEmail
) {

    loginEmail.value =
    rememberedEmail;

}


/* =====================================================
   AUTH CHECK
===================================================== */

function checkAuth() {

    const protectedPages = [

        "index.html",
        "profile.html",
        "reports.html",
        "settings.html"

    ];

    const currentPage =
    window.location.pathname
    .split("/")
    .pop();

    if (
        protectedPages.includes(
            currentPage
        )
    ) {

        const user =
        localStorage.getItem(
            "loggedInUser"
        );

        if (!user) {

            window.location.href =
            "login.html";

        }

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
    "login.html";

}


/* =====================================================
   PAGE INIT
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        checkAuth();

    }

);