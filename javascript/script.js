/* =====================================================
   PERSONAL FINANCE DASHBOARD
   SCRIPT.JS - PART 1

   Features:
   1. Select DOM Elements
   2. Local Storage
   3. Create Transaction
   4. Read Transactions
   5. Delete Transaction
   6. Dashboard Calculations
   7. Notification System
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

/* Transaction Form */

const transactionForm =
document.getElementById(
"transactionForm"
);

/* Input Fields */

const nameInput =
document.getElementById(
"name"
);

const amountInput =
document.getElementById(
"amount"
);

const categoryInput =
document.getElementById(
"category"
);

const typeInput =
document.getElementById(
"type"
);

const dateInput =
document.getElementById(
"date"
);

/* Dashboard Cards */

const balanceElement =
document.getElementById(
"balance"
);

const incomeElement =
document.getElementById(
"income"
);

const expenseElement =
document.getElementById(
"expense"
);

const savingsElement =
document.getElementById(
"savings"
);

/* Table Body */

const tableBody =
document.getElementById(
"transactionTableBody"
);

/* Notification Area */

const notification =
document.getElementById(
"notification"
);


/* =====================================================
   APPLICATION DATA
===================================================== */

/*
   All transactions are stored here.

   Example:

   {
      id:123456,
      name:"Salary",
      amount:50000,
      category:"Salary",
      type:"income",
      date:"2026-06-22"
   }
*/

let transactions =
JSON.parse(
localStorage.getItem(
"transactions"
)
) || [];


/* =====================================================
   SAVE DATA
===================================================== */

function saveTransactions(){

    localStorage.setItem(

        "transactions",

        JSON.stringify(
            transactions
        )

    );
}


/* =====================================================
   SHOW NOTIFICATION
===================================================== */

function showNotification(
message,
type="success"
){

    notification.textContent =
    message;

    notification.className =
    "";

    notification.classList.add(
        `notification-${type}`
    );

    notification.classList.add(
        "show-notification"
    );

    setTimeout(()=>{

        notification.classList.remove(
            "show-notification"
        );

    },3000);
}


/* =====================================================
   GENERATE UNIQUE ID
===================================================== */

function generateId(){

    return Date.now();
}


/* =====================================================
   ADD TRANSACTION
===================================================== */

function addTransaction(
event
){

    event.preventDefault();

    const name =
    nameInput.value.trim();

    const amount =
    Number(
        amountInput.value
    );

    const category =
    categoryInput.value;

    const type =
    typeInput.value;

    const date =
    dateInput.value;

    /* Validation */

    if(
        name === "" ||
        amount <= 0 ||
        date === ""
    ){

        showNotification(
            "Please fill all fields correctly.",
            "error"
        );

        return;
    }

    /* Create Object */

    const transaction = {

        id:
        generateId(),

        name,

        amount,

        category,

        type,

        date
    };

    /* Add to Array */

    transactions.push(
        transaction
    );

    /* Save */

    saveTransactions();

    /* Update UI */

    renderTransactions();

   

    /* Reset Form */

    transactionForm.reset();

    /* Success Message */

    showNotification(
        "Transaction Added Successfully"
    );
}


/* =====================================================
   DELETE TRANSACTION
===================================================== */

function deleteTransaction(
id
){

    transactions =
    transactions.filter(

        transaction =>

        transaction.id !== id

    );

    saveTransactions();

    renderTransactions();

    updateDashboard();

    showNotification(
        "Transaction Deleted",
        "warning"
    );
}


/* =====================================================
   RENDER TRANSACTIONS
===================================================== */

function renderTransactions(){

    tableBody.innerHTML =
    "";

    transactions.forEach(

        transaction => {

            const row =
            document.createElement(
                "tr"
            );

            row.innerHTML =

            `
            <td>
                ${transaction.name}
            </td>

            <td>
                ₹${transaction.amount}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>

                <span class="badge
                ${transaction.type === "income"
                ?
                "badge-income"
                :
                "badge-expense"}">

                ${transaction.type}

                </span>

            </td>

            <td>
                ${transaction.date}
            </td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

                </button>

            </td>
            `;

            tableBody.appendChild(
                row
            );

        }

    );
}


/* =====================================================
   UPDATE DASHBOARD
===================================================== */

function updateDashboard(){

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(

        transaction => {

            if(
                transaction.type
                ===
                "income"
            ){

                totalIncome +=
                transaction.amount;

            }else{

                totalExpense +=
                transaction.amount;
            }

        }

    );

    const balance =
    totalIncome -
    totalExpense;

    const savings =
    balance;

    balanceElement.textContent =
    `₹${balance.toLocaleString()}`;

    incomeElement.textContent =
    `₹${totalIncome.toLocaleString()}`;

    expenseElement.textContent =
    `₹${totalExpense.toLocaleString()}`;

    savingsElement.textContent =
    `₹${savings.toLocaleString()}`;
}


/* =====================================================
   INITIAL LOAD
===================================================== */

function initializeApp(){

    renderTransactions();

    updateDashboard();
}


/* =====================================================
   EVENT LISTENERS
===================================================== */

transactionForm.addEventListener(

    "submit",

    addTransaction

);



/* =====================================================
   SCRIPT.JS - PART 2

   Features:
   1. Search Transactions
   2. Filter Transactions
   3. Edit Transactions
   4. Dark Mode Persistence
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const searchInput =
document.getElementById(
"searchInput"
);

const filterType =
document.getElementById(
"filterType"
);

const themeBtn =
document.getElementById(
"themeBtn"
);


/* =====================================================
   EDIT MODE
===================================================== */

/*
   When editing a transaction,
   this variable stores its ID.
*/

let editingTransactionId = null;


/* =====================================================
   FILTERED RENDER
===================================================== */

function renderTransactions(
transactionArray = transactions
){

    tableBody.innerHTML = "";

    transactionArray.forEach(
        transaction => {

            const row =
            document.createElement(
                "tr"
            );

            row.innerHTML =

            `
            <td>
                ${transaction.name}
            </td>

            <td>
                ₹${transaction.amount.toLocaleString()}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>

                <span class="badge
                ${transaction.type === "income"
                ?
                "badge-income"
                :
                "badge-expense"}">

                ${transaction.type}

                </span>

            </td>

            <td>
                ${transaction.date}
            </td>

            <td>

                <button
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">

                Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

                </button>

            </td>
            `;

            tableBody.appendChild(
                row
            );

        }
    );
}


/* =====================================================
   EDIT TRANSACTION
===================================================== */

function editTransaction(
id
){

    const transaction =
    transactions.find(

        item => item.id === id

    );

    if(!transaction) return;

    nameInput.value =
    transaction.name;

    amountInput.value =
    transaction.amount;

    categoryInput.value =
    transaction.category;

    typeInput.value =
    transaction.type;

    dateInput.value =
    transaction.date;

    editingTransactionId =
    id;

    showNotification(
        "Editing Transaction",
        "warning"
    );
}


/* =====================================================
   OVERRIDE ADD FUNCTION
===================================================== */

/*
   Replace the existing
   addTransaction() function
   from Part 1 with this version.
*/

function addTransaction(
event
){

    event.preventDefault();

    const name =
    nameInput.value.trim();

    const amount =
    Number(
        amountInput.value
    );

    const category =
    categoryInput.value;

    const type =
    typeInput.value;

    const date =
    dateInput.value;

    if(
        name === "" ||
        amount <= 0 ||
        date === ""
    ){

        showNotification(
            "Please fill all fields.",
            "error"
        );

        return;
    }

    /* EDIT EXISTING */

    if(
        editingTransactionId
    ){

        const index =
        transactions.findIndex(

            item =>
            item.id ===
            editingTransactionId

        );

        if(index !== -1){

            transactions[index] = {

                id:
                editingTransactionId,

                name,
                amount,
                category,
                type,
                date
            };

            showNotification(
                "Transaction Updated"
            );
        }

        editingTransactionId =
        null;

    }

    /* CREATE NEW */

    else{

        const transaction = {

            id:
            generateId(),

            name,
            amount,
            category,
            type,
            date
        };

        transactions.push(
            transaction
        );

        showNotification(
            "Transaction Added"
        );
    }

    saveTransactions();

    renderTransactions();

    updateDashboard();

    transactionForm.reset();
}


/* =====================================================
   SEARCH FUNCTION
===================================================== */

function searchTransactions(){

    const keyword =

    searchInput.value
    .toLowerCase()
    .trim();

    const filtered =

    transactions.filter(

        transaction =>

        transaction.name
        .toLowerCase()
        .includes(keyword)

    );

    renderTransactions(
        filtered
    );
}


/* =====================================================
   FILTER FUNCTION
===================================================== */

function filterTransactions(){

    const selectedType =
    filterType.value;

    if(
        selectedType === "all"
    ){

        renderTransactions();

        return;
    }

    const filtered =

    transactions.filter(

        transaction =>

        transaction.type ===
        selectedType

    );

    renderTransactions(
        filtered
    );
}


/* =====================================================
   DARK MODE
===================================================== */

function enableDarkMode(){

    document.body.classList.add(
        "dark"
    );

    localStorage.setItem(
        "theme",
        "dark"
    );
}


function disableDarkMode(){

    document.body.classList.remove(
        "dark"
    );

    localStorage.setItem(
        "theme",
        "light"
    );
}


function toggleTheme(){

    if(

        document.body.classList.contains(
            "dark"
        )

    ){

        disableDarkMode();

    }else{

        enableDarkMode();
    }
}


/* =====================================================
   LOAD SAVED THEME
===================================================== */

function loadTheme(){

    const savedTheme =

    localStorage.getItem(
        "theme"
    );

    if(
        savedTheme === "dark"
    ){

        enableDarkMode();
    }
}


/* =====================================================
   SEARCH EVENT
===================================================== */

searchInput.addEventListener(

    "input",

    searchTransactions

);


/* =====================================================
   FILTER EVENT
===================================================== */

filterType.addEventListener(

    "change",

    filterTransactions

);


/* =====================================================
   DARK MODE EVENT
===================================================== */

themeBtn.addEventListener(

    "click",

    toggleTheme

);


/* =====================================================
   LOAD THEME ON START
===================================================== */

loadTheme();
/* =====================================================
   SCRIPT.JS - PART 3

   Features:
   1. Budget Planner
   2. Budget Progress Bar
   3. Savings Goal Tracker
   4. Goal Progress Calculation
   5. Goal Completion Alerts
   6. Advanced Notifications
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

/* Budget */

const budgetInput =
document.getElementById(
"budgetInput"
);

const saveBudgetBtn =
document.getElementById(
"saveBudget"
);

const budgetAmount =
document.getElementById(
"budgetAmount"
);

const remainingBudget =
document.getElementById(
"remainingBudget"
);

const budgetProgress =
document.getElementById(
"budgetProgress"
);


/* Savings Goal */

const goalNameInput =
document.getElementById(
"goalName"
);

const goalTargetInput =
document.getElementById(
"goalTarget"
);

const saveGoalBtn =
document.getElementById(
"saveGoal"
);

const goalDisplay =
document.getElementById(
"goalDisplay"
);

const goalProgressText =
document.getElementById(
"goalProgressText"
);

const goalProgressBar =
document.getElementById(
"goalProgressBar"
);


/* =====================================================
   STORAGE DATA
===================================================== */

let monthlyBudget =
Number(
localStorage.getItem(
"monthlyBudget"
)
) || 0;

let savingsGoal =
JSON.parse(
localStorage.getItem(
"savingsGoal"
)
) || null;


/* =====================================================
   SAVE BUDGET
===================================================== */

function saveBudget(){

    const budget =
    Number(
        budgetInput.value
    );

    if(
        budget <= 0
    ){

        showNotification(
            "Enter a valid budget amount",
            "error"
        );

        return;
    }

    monthlyBudget =
    budget;

    localStorage.setItem(
        "monthlyBudget",
        budget
    );

    updateBudgetUI();

    showNotification(
        "Budget Saved Successfully"
    );

    budgetInput.value = "";
}


/* =====================================================
   UPDATE BUDGET UI
===================================================== */

function updateBudgetUI(){

    budgetAmount.textContent =
    `₹${monthlyBudget.toLocaleString()}`;

    const totalExpense =

    transactions
    .filter(

        item =>
        item.type ===
        "expense"

    )

    .reduce(

        (total,item)=>

        total + item.amount,

        0

    );

    const remaining =

    monthlyBudget -
    totalExpense;

    remainingBudget.textContent =
    `₹${remaining.toLocaleString()}`;

    let progress = 0;

    if(
        monthlyBudget > 0
    ){

        progress =

        (
        totalExpense /
        monthlyBudget
        ) * 100;

        if(
            progress > 100
        ){

            progress = 100;
        }
    }

    budgetProgress.style.width =
    `${progress}%`;

    /* Budget Status */

    remainingBudget.classList.remove(
        "budget-safe",
        "budget-warning",
        "budget-danger"
    );

    if(
        remaining > monthlyBudget * 0.5
    ){

        remainingBudget.classList.add(
            "budget-safe"
        );

    }

    else if(
        remaining > 0
    ){

        remainingBudget.classList.add(
            "budget-warning"
        );

    }

    else{

        remainingBudget.classList.add(
            "budget-danger"
        );

        showNotification(
            "Budget Exceeded!",
            "warning"
        );
    }
}


/* =====================================================
   SAVE GOAL
===================================================== */

function saveGoal(){

    const name =
    goalNameInput.value.trim();

    const target =
    Number(
        goalTargetInput.value
    );

    if(
        name === "" ||
        target <= 0
    ){

        showNotification(
            "Invalid Goal Details",
            "error"
        );

        return;
    }

    savingsGoal = {

        name,
        target
    };

    localStorage.setItem(

        "savingsGoal",

        JSON.stringify(
            savingsGoal
        )

    );

    updateGoalUI();

    goalNameInput.value = "";

    goalTargetInput.value = "";

    showNotification(
        "Savings Goal Created"
    );
}


/* =====================================================
   UPDATE GOAL UI
===================================================== */

function updateGoalUI(){

    if(
        !savingsGoal
    ){

        return;
    }

    goalDisplay.textContent =

    `${savingsGoal.name}
    (₹${savingsGoal.target.toLocaleString()})`;

    /* Current Savings */

    const totalIncome =

    transactions
    .filter(

        item =>
        item.type ===
        "income"

    )

    .reduce(

        (total,item)=>

        total + item.amount,

        0

    );

    const totalExpense =

    transactions
    .filter(

        item =>
        item.type ===
        "expense"

    )

    .reduce(

        (total,item)=>

        total + item.amount,

        0

    );

    const savings =

    totalIncome -
    totalExpense;

    let percentage =

    (
        savings /
        savingsGoal.target
    ) * 100;

    if(
        percentage < 0
    ){

        percentage = 0;
    }

    if(
        percentage > 100
    ){

        percentage = 100;
    }

    goalProgressText.textContent =

    `${percentage.toFixed(1)}%`;

    goalProgressBar.style.width =

    `${percentage}%`;

    /* Goal Completed */

    if(
        percentage >= 100
    ){

        showNotification(
            "🎉 Goal Achieved!",
            "success"
        );
    }
}


/* =====================================================
   ENHANCED DASHBOARD UPDATE
===================================================== */

/*
   Replace the updateDashboard()
   function from Part 1
   with this version.
*/

function updateDashboard(){

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(

        transaction => {

            if(
                transaction.type ===
                "income"
            ){

                totalIncome +=
                transaction.amount;

            }else{

                totalExpense +=
                transaction.amount;
            }

        }

    );

    const balance =

    totalIncome -
    totalExpense;

    balanceElement.textContent =

    `₹${balance.toLocaleString()}`;

    incomeElement.textContent =

    `₹${totalIncome.toLocaleString()}`;

    expenseElement.textContent =

    `₹${totalExpense.toLocaleString()}`;

    savingsElement.textContent =

    `₹${balance.toLocaleString()}`;

    /* Update Budget */

    updateBudgetUI();

    /* Update Goal */

    updateGoalUI();
}


/* =====================================================
   LOAD BUDGET
===================================================== */

function loadBudget(){

    if(
        monthlyBudget > 0
    ){

        budgetAmount.textContent =

        `₹${monthlyBudget.toLocaleString()}`;
    }

    updateBudgetUI();
}


/* =====================================================
   LOAD GOAL
===================================================== */

function loadGoal(){

    if(
        savingsGoal
    ){

        updateGoalUI();
    }
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

saveBudgetBtn.addEventListener(

    "click",

    saveBudget

);

saveGoalBtn.addEventListener(

    "click",

    saveGoal

);


/* =====================================================
   APP STARTUP
===================================================== */

loadBudget();

loadGoal();

updateBudgetUI();

updateGoalUI();
/* =====================================================
   SCRIPT.JS - PART 4

   Features:
   1. Expense Category Pie Chart
   2. Income vs Expense Bar Chart
   3. Chart Updates
   4. CSV Export
   5. PDF Export
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const exportCSVBtn =
document.getElementById(
"exportCSV"
);

const exportPDFBtn =
document.getElementById(
"exportPDF"
);


/* =====================================================
   CHART REFERENCES
===================================================== */

let expenseChart = null;
let incomeExpenseChart = null;


/* =====================================================
   EXPENSE CATEGORY DATA
===================================================== */

function getExpenseCategoryData(){

    const categoryTotals = {};

    transactions.forEach(
        transaction => {

            if(
                transaction.type ===
                "expense"
            ){

                if(
                    !categoryTotals[
                        transaction.category
                    ]
                ){

                    categoryTotals[
                        transaction.category
                    ] = 0;
                }

                categoryTotals[
                    transaction.category
                ] +=
                transaction.amount;
            }
        }
    );

    return categoryTotals;
}


/* =====================================================
   CREATE PIE CHART
===================================================== */

function createExpenseChart(){

    const canvas =
    document.getElementById(
        "expenseChart"
    );

    if(!canvas) return;

    const data =
    getExpenseCategoryData();

    const labels =
    Object.keys(data);

    const values =
    Object.values(data);

    if(
        expenseChart
    ){

        expenseChart.destroy();
    }

    expenseChart =
    new Chart(

        canvas,

        {

            type:"pie",

            data:{

                labels:labels,

                datasets:[{

                    data:values,

                    backgroundColor:[

                        "#3b82f6",
                        "#ef4444",
                        "#22c55e",
                        "#f59e0b",
                        "#8b5cf6",
                        "#06b6d4",
                        "#ec4899"

                    ]

                }]
            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"
                    }
                }
            }
        }
    );
}


/* =====================================================
   INCOME VS EXPENSE DATA
===================================================== */

function getIncomeExpenseData(){

    let income = 0;
    let expense = 0;

    transactions.forEach(
        transaction => {

            if(
                transaction.type ===
                "income"
            ){

                income +=
                transaction.amount;

            }else{

                expense +=
                transaction.amount;
            }
        }
    );

    return {

        income,
        expense
    };
}


/* =====================================================
   CREATE BAR CHART
===================================================== */

function createIncomeExpenseChart(){

    const canvas =
    document.getElementById(
        "incomeExpenseChart"
    );

    if(!canvas) return;

    const data =
    getIncomeExpenseData();

    if(
        incomeExpenseChart
    ){

        incomeExpenseChart.destroy();
    }

    incomeExpenseChart =
    new Chart(

        canvas,

        {

            type:"bar",

            data:{

                labels:[
                    "Income",
                    "Expense"
                ],

                datasets:[{

                    label:
                    "Amount",

                    data:[

                        data.income,

                        data.expense

                    ],

                    backgroundColor:[

                        "#22c55e",

                        "#ef4444"

                    ]
                }]
            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true
                    }
                }
            }
        }
    );
}


/* =====================================================
   UPDATE ALL CHARTS
===================================================== */

function updateCharts(){

    createExpenseChart();

    createIncomeExpenseChart();
}


/* =====================================================
   CSV EXPORT
===================================================== */

function exportCSV(){

    if(
        transactions.length === 0
    ){

        showNotification(
            "No Data Available",
            "error"
        );

        return;
    }

    let csv =

    "Name,Amount,Category,Type,Date\n";

    transactions.forEach(
        transaction => {

            csv +=

            `${transaction.name},
            ${transaction.amount},
            ${transaction.category},
            ${transaction.type},
            ${transaction.date}\n`;
        }
    );

    const blob =
    new Blob(

        [csv],

        {
            type:
            "text/csv"
        }

    );

    const url =
    URL.createObjectURL(
        blob
    );

    const link =
    document.createElement(
        "a"
    );

    link.href =
    url;

    link.download =
    "finance-report.csv";

    link.click();

    URL.revokeObjectURL(
        url
    );

    showNotification(
        "CSV Exported"
    );
}


/* =====================================================
   PDF EXPORT
===================================================== */

function exportPDF(){

    if(
        transactions.length === 0
    ){

        showNotification(
            "No Data Available",
            "error"
        );

        return;
    }

    const {
        jsPDF
    } = window.jspdf;

    const doc =
    new jsPDF();

    doc.setFontSize(18);

    doc.text(

        "Personal Finance Report",

        20,

        20

    );

    doc.setFontSize(11);

    let y = 40;

    transactions.forEach(
        transaction => {

            doc.text(

                `${transaction.name}
                 | ₹${transaction.amount}
                 | ${transaction.category}
                 | ${transaction.type}
                 | ${transaction.date}`,

                10,

                y

            );

            y += 10;

            if(
                y > 270
            ){

                doc.addPage();

                y = 20;
            }
        }
    );

    doc.save(
        "finance-report.pdf"
    );

    showNotification(
        "PDF Exported"
    );
}


/* =====================================================
   ENHANCED UPDATE DASHBOARD
===================================================== */

/*
   Replace updateDashboard()
   from Part 3
   with this final version.
*/

function updateDashboard(){

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(
        transaction => {

            if(
                transaction.type ===
                "income"
            ){

                totalIncome +=
                transaction.amount;

            }else{

                totalExpense +=
                transaction.amount;
            }
        }
    );

    const balance =
    totalIncome -
    totalExpense;

    balanceElement.textContent =
    `₹${balance.toLocaleString()}`;

    incomeElement.textContent =
    `₹${totalIncome.toLocaleString()}`;

    expenseElement.textContent =
    `₹${totalExpense.toLocaleString()}`;

    savingsElement.textContent =
    `₹${balance.toLocaleString()}`;

    updateBudgetUI();

    updateGoalUI();

    updateCharts();
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

exportCSVBtn.addEventListener(

    "click",

    exportCSV

);

exportPDFBtn.addEventListener(

    "click",

    exportPDF

);


/* =====================================================
   INITIALIZE CHARTS
===================================================== */

updateCharts();
 updateDashboard();
 /* =====================================================
   START APP
===================================================== */

initializeApp();