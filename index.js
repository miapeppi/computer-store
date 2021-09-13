// Balance, loan and pay amounts
const elBalance = document.getElementById("balance");
const elLoan = document.getElementById("loan");
const elPay = document.getElementById("pay");
const elLoanRow = document.getElementById("loanRow");
// List of computers and selected computer's features
const elComputers = document.getElementById("computers");
const elFeatures = document.getElementById("features");
const elComputerTitle = document.getElementById("computerTitle");
const elComputerDescription = document.getElementById("computerDescription");
const elComputerPrice = document.getElementById("computerPrice");
const elComputerImg = document.getElementById("computerImg");
// Buttons
const elLoanBtn = document.getElementById("loanBtn");
const elBankBtn = document.getElementById("bankBtn");
const elWorkBtn = document.getElementById("workBtn");
const elRepayBtn = document.getElementById("repayBtn");
const elBuyBtn = document.getElementById("buyBtn");

// Variables
let balance = 0;
let loan = 0;
let pay = 0;
let computers = []; // Empty array for the fetched computers
let selectedComputer; // Empty variable to the selected computer
let boughtComputerWithLoan = false; // Checking if you have bought a computer
const address = "https://noroff-komputer-store-api.herokuapp.com/"; // Address where API fetches data

/*
Fetching the computers from the API
*/
async function fetchComputers() {
    try {
        const response = await fetch(address + "computers");
        computers = await response.json();
        getComputers(computers);
    } catch(error) {
        console.error("Couldn't get the computers :( ", error);
    }
}

/*
View and hide Outstanding loan amount and repay loan button if loan value is 0
*/
function viewLoan() {
    if (loan > 0) {
        elLoanRow.style.display = "block";
        elRepayBtn.style.display = "block";
    } else {
        elLoanRow.style.display = "none";
        elRepayBtn.style.display = "none";
        boughtComputerWithLoan = false;
    }
}

/*
Adding computers to the dropdown selector
*/
const getComputers = (computers) => {
    computers.forEach(computer => {
        // Checking that the computer's status is active and stock is more than 0
        if(computer.active === true && computer.stock > 0) {
            const elComputer = document.createElement("option");
            elComputer.value = computer.id;
            elComputer.appendChild(document.createTextNode(computer.title));
            elComputers.appendChild(elComputer)
        }
    });
    // Displaying the first computer's information
    handleComputerSelectionChange();
}

/*
Change displayed computer when selection is changed
*/
const handleComputerSelectionChange = () => {
    selectedComputer = computers[elComputers.selectedIndex];
    // Updating UI values
    elComputerTitle.innerText = selectedComputer.title;
    elComputerDescription.innerText = selectedComputer.description;
    elComputerPrice.innerText = selectedComputer.price + " €";
    elComputerImg.src = address + selectedComputer.image;
    // Emptying the features of the old selection
    elFeatures.innerText = ""
    // Looping to get all of the features of the new selection
    for(const spec of selectedComputer.specs) {
        elFeatures.innerText += spec + "\n";
    }
}

/*
Getting loan when "Get a Loan" button is clicked
*/
const handleGetLoan = () => {
    // Checking if you already have a loan
    if(loan > 0) {
        alert("You already have a loan, you should pay that before getting a new one.")
    } else {
        const loanAmount = prompt("Please enter the amount of loan you would like to have 💰: ")
        // Checking if the asked loan amount is not bigger that you balance times two
        if(loanAmount > balance * 2) {
            alert("Sorry, but you can't have loan that big.")
        } else {
            loan += parseInt(loanAmount);
            balance += parseInt(loanAmount);
        }
    }
    // Updating UI value
    elLoan.innerText = loan + " €";
    elBalance.innerText = balance + " €";
    viewLoan();
}

/*
Move pay balance to the bank and if you have loan, handles the loan payment also
*/
const handleGetPaid = () => {
    // Checks if you have a loan
    if(loan > 0) {
        // Checks if your loan is bigger than the 10% loan payment
        if(loan > pay * 0.1){
            loan -= pay * 0.1;
            balance += pay * 0.9;
        } else {
            balance += (pay - loan);
            loan = 0;
        }
    } else {
        balance += pay;
    }
    pay = 0;
    // Updating the UI values
    elBalance.innerText = balance + " €";
    elPay.innerText = pay + " €";
    elLoan.innerText = loan + " €";
    viewLoan();
}

/*
Add 100 € to your pay balance when "Work" button is clicked
*/
const handleDoWork = () => {
    pay += 100
    // Updating the UI value
    elPay.innerText = pay + " €";
}

/*
Repays your loan with the pay balance when "Repay Loan" button is clicked
*/
const handleRepayLoan = () => {
    // Checks if the loan amount is bigger than your pay balance
    if(loan >= pay) {
        loan -=pay;
        pay = 0;
    } else if(loan > 0){
        pay -= loan;
        loan = 0;
    }
    // Updating UI values
    elPay.innerText = pay + " €";
    elLoan.innerText = loan + " €";
    viewLoan();
}

/*
Buy selected computer when "BUY NOW" button is clicked
*/
const handleBuyComputer = () => {
    // Checking if you have already bought a computer and haven't paid your loan yet
    if (boughtComputerWithLoan && loan > 0) {
        alert("I'm sorry, but you have to pay your old loan before buying new computer.")
    // Checking if you have enough balance to buy a computer
    } else if (selectedComputer.price <= balance){
        balance -= selectedComputer.price
        alert("Thank you from you purchase! You have a new " + selectedComputer.title + " computer.")
        elBalance.innerText = balance + " €";
        if(loan > 0) {
            boughtComputerWithLoan = true;
        }
    } else {
        alert("I'm sorry, but you don't have enough money to buy this computer.")
    }
}

// Event handlers
fetchComputers();
elComputers.addEventListener("change", handleComputerSelectionChange);
elLoanBtn.addEventListener("click", handleGetLoan);
elBankBtn.addEventListener("click", handleGetPaid);
elWorkBtn.addEventListener("click", handleDoWork);
elRepayBtn.addEventListener("click", handleRepayLoan);
elBuyBtn.addEventListener("click", handleBuyComputer);