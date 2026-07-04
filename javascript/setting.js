
/* ==========================
   SAVE PROFILE SETTINGS
========================== */

document
.getElementById(
    "saveProfileSettings"
)
?.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "fintrack_name",
            document.getElementById(
                "userName"
            ).value
        );

        localStorage.setItem(
            "fintrack_email",
            document.getElementById(
                "userEmail"
            ).value
        );

        alert(
            "Profile Saved Successfully"
        );

    }
);


/* ==========================
   LOAD PROFILE
========================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        document.getElementById(
            "userName"
        ).value =
        localStorage.getItem(
            "fintrack_name"
        ) || "";

        document.getElementById(
            "userEmail"
        ).value =
        localStorage.getItem(
            "fintrack_email"
        ) || "";

    }
);


/* ==========================
   CLEAR TRANSACTIONS
========================== */

document
.getElementById(
    "clearTransactions"
)
?.addEventListener(
    "click",
    () => {

        const confirmDelete =
        confirm(
            "Delete all transactions?"
        );

        if(confirmDelete){

            localStorage.removeItem(
                "fintrack_transactions"
            );

            alert(
                "Transactions Cleared"
            );

        }

    }
);


/* ==========================
   RESET ENTIRE APP
========================== */

document
.getElementById(
    "resetAllData"
)
?.addEventListener(
    "click",
    () => {

        const confirmReset =
        confirm(
            "Reset complete application?"
        );

        if(confirmReset){

            localStorage.clear();

            alert(
                "Application Reset Successfully"
            );

            location.reload();

        }

    }
);
