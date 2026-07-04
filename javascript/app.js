/* =====================================================
   FINTRACK V2
   APP.JS PART 1
   CORE CRUD + LOCAL STORAGE + DASHBOARD
===================================================== */


/* ==========================
   LOCAL STORAGE KEYS
========================== */

const STORAGE_KEY = "fintrack_transactions";


/* ==========================
   DOM ELEMENTS
========================== */

const transactionForm =
document.getElementById("transactionForm");

const transactionTableBody =
document.getElementById("transactionTableBody");

const totalBalance =
document.getElementById("totalBalance");

const totalIncome =
document.getElementById("totalIncome");

const totalExpense =
document.getElementById("totalExpense");

const totalSavings =
document.getElementById("totalSavings");

const transactionCount =
document.getElementById("transactionCount");

const monthlyIncome =
document.getElementById("monthlyIncome");

const monthlyExpense =
document.getElementById("monthlyExpense");


/* ==========================
   DATA ARRAY
========================== */

let transactions = [];


/* ==========================
   LOAD DATA FROM STORAGE
========================== */

function loadTransactions() {

    const savedData =
    localStorage.getItem(STORAGE_KEY);

    if (savedData) {

        transactions =
        JSON.parse(savedData);

    } else {

        transactions = [];

    }

}


/* ==========================
   SAVE DATA TO STORAGE
========================== */

function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}


/* ==========================
   GENERATE UNIQUE ID
========================== */

function generateId() {

    return Date.now();

}


/* ==========================
   ADD TRANSACTION
========================== */

function addTransaction(transaction) {

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    updateDashboard();

}


/* ==========================
   DELETE TRANSACTION
========================== */

function deleteTransaction(id) {

    const confirmDelete =
    confirm("Delete this transaction?");

    if (!confirmDelete) return;

    transactions =
    transactions.filter(
        item => item.id !== id
    );

    saveTransactions();

    renderTransactions();

    updateDashboard();

}


/* ==========================
   GET FORM DATA
========================== */

function getTransactionData() {

    const description =
    document.getElementById("description").value;

    const amount =
    Number(
        document.getElementById("amount").value
    );

    const category =
    document.getElementById("category").value;

    const date =
    document.getElementById("transactionDate").value;

    const type =
    document.querySelector(
        "input[name='type']:checked"
    ).value;

    return {

        id: generateId(),

        description,

        amount,

        category,

        date,

        type

    };

}


/* ==========================
   FORM SUBMIT EVENT
========================== */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const transaction =
            getTransactionData();

            addTransaction(transaction);

            transactionForm.reset();

        }
    );

}


/* ==========================
   FORMAT CURRENCY
========================== */

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR"
        }
    ).format(value);

}


/* ==========================
   RENDER TABLE
========================== */

function renderTransactions() {

    if (!transactionTableBody) return;

    if (transactions.length === 0) {

        transactionTableBody.innerHTML = `

        <tr>
            <td colspan="7">
                <div class="no-data">
                    <h3>No Transactions Found</h3>
                </div>
            </td>
        </tr>

        `;

        return;
    }

    transactionTableBody.innerHTML = "";

    transactions.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${transaction.id}</td>

        <td>${transaction.description}</td>

        <td>

            <span class="category-tag">

                ${transaction.category}

            </span>

        </td>

        <td>

            <span class="
                badge
                ${transaction.type === "income"
                    ? "badge-income"
                    : "badge-expense"}
            ">

                ${transaction.type}

            </span>

        </td>

        <td class="
            ${transaction.type === "income"
                ? "amount-income"
                : "amount-expense"}
        ">

            ${formatCurrency(transaction.amount)}

        </td>

        <td>${transaction.date}</td>

        <td>

            <div class="action-buttons">

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">

                    <i class="fas fa-trash"></i>

                </button>

            </div>

        </td>

        `;

        transactionTableBody.appendChild(row);

    });

}


/* ==========================
   DASHBOARD CALCULATIONS
========================== */

function updateDashboard() {

    let income = 0;

    let expense = 0;

    transactions.forEach(item => {

        if (item.type === "income") {

            income += item.amount;

        } else {

            expense += item.amount;

        }

    });

    const balance =
    income - expense;

    const savings =
    balance;


    /* Dashboard Cards */

    if (totalIncome)
        totalIncome.textContent =
        formatCurrency(income);

    if (totalExpense)
        totalExpense.textContent =
        formatCurrency(expense);

    if (totalBalance)
        totalBalance.textContent =
        formatCurrency(balance);

    if (totalSavings)
        totalSavings.textContent =
        formatCurrency(savings);

    if (transactionCount)
        transactionCount.textContent =
        transactions.length;


    /* Monthly Summary */

    if (monthlyIncome)
        monthlyIncome.textContent =
        formatCurrency(income);

    if (monthlyExpense)
        monthlyExpense.textContent =
        formatCurrency(expense);

}


/* ==========================
   INITIALIZE APP
========================== */

function init() {

    loadTransactions();

    renderTransactions();

    updateDashboard();

}


/* ==========================
   START APP
========================== */

document.addEventListener(
    "DOMContentLoaded",
    init
);
/* =====================================================
   FINTRACK V2
   APP.JS PART 2
   SEARCH + FILTER + EDIT + DARK MODE
===================================================== */


/* ==========================
   SEARCH & FILTER ELEMENTS
========================== */

const transactionSearch =
document.getElementById("transactionSearch");

const categoryFilter =
document.getElementById("categoryFilter");

const typeFilter =
document.getElementById("typeFilter");


/* ==========================
   EDIT MODE
========================== */

let editId = null;


/* ==========================
   EDIT TRANSACTION
========================== */

function editTransaction(id){

    const transaction =
    transactions.find(
        item => item.id === id
    );

    if(!transaction) return;

    document.getElementById("description").value =
    transaction.description;

    document.getElementById("amount").value =
    transaction.amount;

    document.getElementById("category").value =
    transaction.category;

    document.getElementById("transactionDate").value =
    transaction.date;

    document.querySelector(
        `input[name="type"][value="${transaction.type}"]`
    ).checked = true;

    editId = id;

    document.querySelector(
        "#transactionForm button[type='submit']"
    ).textContent = "Update Transaction";

}


/* ==========================
   UPDATE TRANSACTION
========================== */

function updateTransaction(){

    const index =
    transactions.findIndex(
        item => item.id === editId
    );

    if(index === -1) return;

    transactions[index] = {

        id: editId,

        description:
        document.getElementById("description").value,

        amount:
        Number(
            document.getElementById("amount").value
        ),

        category:
        document.getElementById("category").value,

        date:
        document.getElementById("transactionDate").value,

        type:
        document.querySelector(
            "input[name='type']:checked"
        ).value
    };

    saveTransactions();

    renderTransactions();

    updateDashboard();

    editId = null;

    transactionForm.reset();

    document.querySelector(
        "#transactionForm button[type='submit']"
    ).innerHTML = `
        <i class="fas fa-plus-circle"></i>
        Add Transaction
    `;

}


/* ==========================
   REPLACE SUBMIT EVENT
========================== */

if(transactionForm){

    transactionForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            if(editId){

                updateTransaction();

                return;
            }

            const transaction =
            getTransactionData();

            addTransaction(transaction);

            transactionForm.reset();

        }
    );
}


/* ==========================
   FILTER TRANSACTIONS
========================== */

function getFilteredTransactions(){

    let filtered = [...transactions];

    const searchText =
    transactionSearch?.value
    .toLowerCase() || "";

    const category =
    categoryFilter?.value || "all";

    const type =
    typeFilter?.value || "all";

    if(searchText){

        filtered =
        filtered.filter(item =>

            item.description
            .toLowerCase()
            .includes(searchText)

            ||

            item.category
            .toLowerCase()
            .includes(searchText)

        );
    }

    if(category !== "all"){

        filtered =
        filtered.filter(
            item =>
            item.category === category
        );
    }

    if(type !== "all"){

        filtered =
        filtered.filter(
            item =>
            item.type === type
        );
    }

    return filtered;

}


/* ==========================
   RENDER FILTERED TABLE
========================== */

function renderFilteredTransactions(){

    const data =
    getFilteredTransactions();

    if(!transactionTableBody) return;

    if(data.length === 0){

        transactionTableBody.innerHTML = `

        <tr>
            <td colspan="7">

                <div class="no-data">

                    <h3>
                    No Matching Records
                    </h3>

                </div>

            </td>
        </tr>

        `;

        return;
    }

    transactionTableBody.innerHTML = "";

    data.forEach(transaction => {

        const row =
        document.createElement("tr");

        row.innerHTML = `

        <td>${transaction.id}</td>

        <td>${transaction.description}</td>

        <td>
            <span class="category-tag">
                ${transaction.category}
            </span>
        </td>

        <td>
            <span class="
            badge
            ${
                transaction.type === "income"
                ? "badge-income"
                : "badge-expense"
            }">
            ${transaction.type}
            </span>
        </td>

        <td class="
        ${
            transaction.type === "income"
            ? "amount-income"
            : "amount-expense"
        }">

        ${formatCurrency(transaction.amount)}

        </td>

        <td>${transaction.date}</td>

        <td>

            <div class="action-buttons">

                <button
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">

                <i class="fas fa-pen"></i>

                </button>

                <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                <i class="fas fa-trash"></i>

                </button>

            </div>

        </td>
        `;

        transactionTableBody
        .appendChild(row);

    });

}


/* ==========================
   FILTER EVENTS
========================== */

transactionSearch?.addEventListener(
    "input",
    renderFilteredTransactions
);

categoryFilter?.addEventListener(
    "change",
    renderFilteredTransactions
);

typeFilter?.addEventListener(
    "change",
    renderFilteredTransactions
);


/* ==========================
   DARK MODE
========================== */

const DARK_MODE_KEY =
"fintrack_dark_mode";


/* Toggle Function */

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark"
    );

    const isDark =
    document.body.classList.contains(
        "dark"
    );

    localStorage.setItem(
        DARK_MODE_KEY,
        isDark
    );

}


/* Load Theme */

function loadDarkMode(){

    const savedTheme =
    localStorage.getItem(
        DARK_MODE_KEY
    );

    if(savedTheme === "true"){

        document.body.classList.add(
            "dark"
        );
    }

}


/* ==========================
   MOBILE SIDEBAR
========================== */

const mobileToggle =
document.getElementById(
    "mobileToggle"
);

const sidebar =
document.getElementById(
    "sidebar"
);

mobileToggle?.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );

    }
);


/* ==========================
   DARK MODE BUTTON
========================== */

/*
Add this button in settings.html

<button id="darkModeBtn">
Toggle Dark Mode
</button>

*/

const darkModeBtn =
document.getElementById(
    "darkModeBtn"
);

darkModeBtn?.addEventListener(
    "click",
    toggleDarkMode
);


/* ==========================
   LOAD DARK MODE
========================== */

loadDarkMode();
/* =====================================================
   FINTRACK V2
   APP.JS PART 3
   BUDGET + GOALS + NOTIFICATIONS
===================================================== */


/* ==========================
   STORAGE KEYS
========================== */

const BUDGET_KEY = "fintrack_budget";
const GOAL_KEY = "fintrack_goal";


/* ==========================
   DOM ELEMENTS
========================== */

const budgetForm =
document.getElementById("budgetForm");

const goalForm =
document.getElementById("goalForm");

const budgetAmountInput =
document.getElementById("budgetAmount");

const goalAmountInput =
document.getElementById("goalAmount");

const currentBudget =
document.getElementById("currentBudget");

const budgetExpense =
document.getElementById("budgetExpense");

const remainingBudget =
document.getElementById("remainingBudget");

const budgetProgress =
document.getElementById("budgetProgress");

const goalTarget =
document.getElementById("goalTarget");

const goalCurrent =
document.getElementById("goalCurrent");

const goalPercent =
document.getElementById("goalPercent");

const goalProgress =
document.getElementById("goalProgress");


/* ==========================
   APP STATE
========================== */

let monthlyBudget = 0;
let savingsGoal = 0;


/* ==========================
   LOAD BUDGET
========================== */

function loadBudget(){

    monthlyBudget =
    Number(
        localStorage.getItem(BUDGET_KEY)
    ) || 0;

}


/* ==========================
   SAVE BUDGET
========================== */

function saveBudget(){

    localStorage.setItem(
        BUDGET_KEY,
        monthlyBudget
    );

}


/* ==========================
   LOAD GOAL
========================== */

function loadGoal(){

    savingsGoal =
    Number(
        localStorage.getItem(GOAL_KEY)
    ) || 0;

}


/* ==========================
   SAVE GOAL
========================== */

function saveGoal(){

    localStorage.setItem(
        GOAL_KEY,
        savingsGoal
    );

}


/* ==========================
   BUDGET FORM
========================== */

budgetForm?.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        monthlyBudget =
        Number(
            budgetAmountInput.value
        );

        saveBudget();

        updateBudgetPlanner();

        showNotification(
            "Budget Updated Successfully",
            "success"
        );

    }
);


/* ==========================
   GOAL FORM
========================== */

goalForm?.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        savingsGoal =
        Number(
            goalAmountInput.value
        );

        saveGoal();

        updateGoalTracker();

        showNotification(
            "Savings Goal Updated",
            "success"
        );

    }
);


/* ==========================
   UPDATE BUDGET
========================== */

function updateBudgetPlanner(){

    let expenses = 0;

    transactions.forEach(item => {

        if(item.type === "expense"){

            expenses += item.amount;

        }

    });

    const remaining =
    monthlyBudget - expenses;

    const usedPercent =
    monthlyBudget > 0
    ?
    Math.min(
        (expenses / monthlyBudget) * 100,
        100
    )
    :
    0;


    if(currentBudget)
        currentBudget.textContent =
        formatCurrency(monthlyBudget);

    if(budgetExpense)
        budgetExpense.textContent =
        formatCurrency(expenses);

    if(remainingBudget)
        remainingBudget.textContent =
        formatCurrency(remaining);

    if(budgetProgress)
        budgetProgress.style.width =
        usedPercent + "%";


    const budgetUsage =
    document.getElementById(
        "budgetUsage"
    );

    if(budgetUsage){

        budgetUsage.textContent =
        usedPercent.toFixed(0) + "%";

    }


    /* Warning */

    if(usedPercent >= 90){

        showNotification(
            "Warning: Budget Almost Exhausted",
            "warning"
        );

    }

}


/* ==========================
   UPDATE SAVINGS GOAL
========================== */

function updateGoalTracker(){

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {

        if(item.type === "income"){

            income += item.amount;

        }else{

            expense += item.amount;

        }

    });

    const savings =
    income - expense;

    const percent =
    savingsGoal > 0
    ?
    Math.min(
        (savings / savingsGoal) * 100,
        100
    )
    :
    0;


    if(goalTarget)
        goalTarget.textContent =
        formatCurrency(savingsGoal);

    if(goalCurrent)
        goalCurrent.textContent =
        formatCurrency(savings);

    if(goalPercent)
        goalPercent.textContent =
        percent.toFixed(0) + "%";

    if(goalProgress)
        goalProgress.style.width =
        percent + "%";


    if(percent >= 100){

        showNotification(
            "🎉 Savings Goal Achieved!",
            "success"
        );

    }

}


/* ==========================
   FINANCIAL INSIGHTS
========================== */

function updateInsights(){

    const spendingInsight =
    document.getElementById(
        "spendingInsight"
    );

    const savingsInsight =
    document.getElementById(
        "savingsInsight"
    );

    const budgetInsight =
    document.getElementById(
        "budgetInsight"
    );

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {

        if(item.type === "income"){

            income += item.amount;

        }else{

            expense += item.amount;

        }

    });

    const savings =
    income - expense;

    if(spendingInsight){

        spendingInsight.textContent =
        expense > income
        ?
        "Your expenses are higher than income."
        :
        "Your spending is under control.";

    }

    if(savingsInsight){

        savingsInsight.textContent =
        savings > 0
        ?
        `You have saved ${formatCurrency(savings)}.`
        :
        "Start increasing your savings.";

    }

    if(budgetInsight){

        budgetInsight.textContent =
        monthlyBudget > 0
        ?
        `Budget set at ${formatCurrency(monthlyBudget)}.`
        :
        "Set a monthly budget.";

    }

}


/* ==========================
   TOAST NOTIFICATION
========================== */

function showNotification(
    message,
    type = "success"
){

    const notification =
    document.createElement("div");

    notification.className =
    `toast toast-${type}`;

    notification.textContent =
    message;

    notification.style.position =
    "fixed";

    notification.style.top =
    "20px";

    notification.style.right =
    "20px";

    notification.style.padding =
    "15px 20px";

    notification.style.borderRadius =
    "10px";

    notification.style.zIndex =
    "9999";

    notification.style.color =
    "#fff";

    notification.style.fontWeight =
    "600";

    notification.style.boxShadow =
    "0 10px 20px rgba(0,0,0,.15)";

    if(type === "success"){

        notification.style.background =
        "#22c55e";

    }

    if(type === "warning"){

        notification.style.background =
        "#f59e0b";

    }

    if(type === "error"){

        notification.style.background =
        "#ef4444";

    }

    document.body.appendChild(
        notification
    );

    setTimeout(() => {

        notification.remove();

    }, 3000);

}


/* ==========================
   EXTEND DASHBOARD UPDATE
========================== */

const originalUpdateDashboard =
updateDashboard;

updateDashboard = function(){

    originalUpdateDashboard();

    updateBudgetPlanner();

    updateGoalTracker();

    updateInsights();

};


/* ==========================
   INITIAL LOAD
========================== */

loadBudget();

loadGoal();

updateBudgetPlanner();

updateGoalTracker();

updateInsights();
/* =====================================================
   FINTRACK V2
   APP.JS PART 4
   CHARTS + EXPORTS + REPORTS
===================================================== */


/* ==========================
   CHART VARIABLES
========================== */

let incomeExpenseChart = null;
let categoryChart = null;
let monthlyTrendChart = null;


/* ==========================
   ANALYTICS DOM ELEMENTS
========================== */

const highestIncome =
document.getElementById("highestIncome");

const highestExpense =
document.getElementById("highestExpense");

const averageExpense =
document.getElementById("averageExpense");

const savingsRate =
document.getElementById("savingsRate");


/* ==========================
   UPDATE ANALYTICS CARDS
========================== */

function updateAnalyticsCards(){

    const incomes =
    transactions.filter(
        t => t.type === "income"
    );

    const expenses =
    transactions.filter(
        t => t.type === "expense"
    );

    const maxIncome =
    incomes.length
    ?
    Math.max(
        ...incomes.map(t => t.amount)
    )
    :
    0;

    const maxExpense =
    expenses.length
    ?
    Math.max(
        ...expenses.map(t => t.amount)
    )
    :
    0;

    const avgExpense =
    expenses.length
    ?
    expenses.reduce(
        (sum,t)=>sum+t.amount,
        0
    ) / expenses.length
    :
    0;

    const totalIncomeValue =
    incomes.reduce(
        (sum,t)=>sum+t.amount,
        0
    );

    const totalExpenseValue =
    expenses.reduce(
        (sum,t)=>sum+t.amount,
        0
    );

    const rate =
    totalIncomeValue > 0
    ?
    (
        (
            totalIncomeValue -
            totalExpenseValue
        )
        /
        totalIncomeValue
    ) * 100
    :
    0;

    if(highestIncome)
        highestIncome.textContent =
        formatCurrency(maxIncome);

    if(highestExpense)
        highestExpense.textContent =
        formatCurrency(maxExpense);

    if(averageExpense)
        averageExpense.textContent =
        formatCurrency(avgExpense);

    if(savingsRate)
        savingsRate.textContent =
        rate.toFixed(1) + "%";
}


/* ==========================
   PIE CHART
========================== */

function createIncomeExpenseChart(){

    const canvas =
    document.getElementById(
        "incomeExpenseChart"
    );

    if(!canvas) return;

    const incomes =
    transactions
    .filter(t => t.type === "income")
    .reduce((a,b)=>a+b.amount,0);

    const expenses =
    transactions
    .filter(t => t.type === "expense")
    .reduce((a,b)=>a+b.amount,0);

    if(incomeExpenseChart){

        incomeExpenseChart.destroy();

    }

    incomeExpenseChart =
    new Chart(canvas,{

        type:"pie",

        data:{

            labels:[
                "Income",
                "Expense"
            ],

            datasets:[{

                data:[
                    incomes,
                    expenses
                ]

            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }
    });

}


/* ==========================
   CATEGORY CHART
========================== */

function createCategoryChart(){

    const canvas =
    document.getElementById(
        "categoryChart"
    );

    if(!canvas) return;

    const categoryTotals = {};

    transactions.forEach(item => {

        if(item.type === "expense"){

            if(!categoryTotals[item.category]){

                categoryTotals[item.category] = 0;

            }

            categoryTotals[item.category] +=
            item.amount;
        }
    });

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart =
    new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:
            Object.keys(categoryTotals),

            datasets:[{

                data:
                Object.values(categoryTotals)

            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }
    });

}


/* ==========================
   MONTHLY TREND
========================== */

function createMonthlyTrendChart(){

    const canvas =
    document.getElementById(
        "monthlyTrendChart"
    );

    if(!canvas) return;

    const incomeMonthly = {};
    const expenseMonthly = {};

    transactions.forEach(item => {

        const month =
        item.date.substring(0,7);

        if(item.type === "income"){

            incomeMonthly[month] =
            (incomeMonthly[month] || 0)
            + item.amount;

        }else{

            expenseMonthly[month] =
            (expenseMonthly[month] || 0)
            + item.amount;
        }
    });

    const labels =
    [...new Set([
        ...Object.keys(incomeMonthly),
        ...Object.keys(expenseMonthly)
    ])];

    if(monthlyTrendChart){

        monthlyTrendChart.destroy();

    }

    monthlyTrendChart =
    new Chart(canvas,{

        type:"bar",

        data:{

            labels,

            datasets:[

                {

                    label:"Income",

                    data:
                    labels.map(
                        m =>
                        incomeMonthly[m] || 0
                    )

                },

                {

                    label:"Expense",

                    data:
                    labels.map(
                        m =>
                        expenseMonthly[m] || 0
                    )

                }

            ]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }
    });

}


/* ==========================
   UPDATE ALL CHARTS
========================== */

function updateCharts(){

    createIncomeExpenseChart();

    createCategoryChart();

    createMonthlyTrendChart();

    updateAnalyticsCards();
}


/* ==========================
   CSV EXPORT
========================== */

const exportCSV =
document.getElementById(
    "exportCSV"
);

exportCSV?.addEventListener(
    "click",
    exportTransactionsCSV
);

function exportTransactionsCSV(){

    let csv =
    "ID,Description,Category,Type,Amount,Date\n";

    transactions.forEach(item => {

        csv +=

        `${item.id},` +
        `${item.description},` +
        `${item.category},` +
        `${item.type},` +
        `${item.amount},` +
        `${item.date}\n`;

    });

    const blob =
    new Blob(
        [csv],
        {type:"text/csv"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "FinTrack_Report.csv";

    link.click();

    showNotification(
        "CSV Exported Successfully"
    );
}


/* ==========================
   PDF EXPORT
========================== */

const exportPDF =
document.getElementById(
    "exportPDF"
);

exportPDF?.addEventListener(
    "click",
    exportTransactionsPDF
);

function exportTransactionsPDF(){

    let content =
    "FINTRACK REPORT\n\n";

    transactions.forEach(item => {

        content +=

        `Description: ${item.description}\n` +

        `Category: ${item.category}\n` +

        `Type: ${item.type}\n` +

        `Amount: ₹${item.amount}\n` +

        `Date: ${item.date}\n\n`;
    });

    const blob =
    new Blob(
        [content],
        {type:"application/pdf"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "FinTrack_Report.pdf";

    link.click();

    showNotification(
        "PDF Export Generated"
    );
}


/* ==========================
   PRINT REPORT
========================== */

const printReport =
document.getElementById(
    "printReport"
);

printReport?.addEventListener(
    "click",
    () => {

        window.print();

    }
);


/* ==========================
   EXTEND DASHBOARD UPDATE
========================== */

const previousDashboardUpdate =
updateDashboard;

updateDashboard = function(){

    previousDashboardUpdate();

    updateCharts();

};


/* ==========================
   INITIAL LOAD
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCharts();

        updateAnalyticsCards();

    }
);