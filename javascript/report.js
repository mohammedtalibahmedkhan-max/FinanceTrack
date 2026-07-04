/* ==========================
   REPORT PAGE LOADER
========================== */

const reportTableBody =
document.getElementById(
    "reportTableBody"
);

if(reportTableBody){

    const data =
    JSON.parse(
        localStorage.getItem(
            "fintrack_transactions"
        )
    ) || [];

    if(data.length){

        reportTableBody.innerHTML = "";

        data.forEach(item => {

            reportTableBody.innerHTML += `

            <tr>

                <td>${item.id}</td>

                <td>${item.description}</td>

                <td>${item.category}</td>

                <td>${item.type}</td>

                <td>₹${item.amount}</td>

                <td>${item.date}</td>

            </tr>

            `;

        });

    }

}
