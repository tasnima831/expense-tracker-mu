// Created by Tisha (ID: 222-134-016)

class ExpenseTracker {
  constructor() {
    // Select elements using jQuery
    this.balance = $("#balance");
    this.money_plus = $("#money-plus");
    this.money_minus = $("#money-minus");
    this.list = $("#list");
    this.form = $("#form");
    this.text = $("#text");
    this.amount = $("#amount");
    this.category = $("#category");
    this.transactionTypeInputs = $("input[name='transactionType']"); // Select all radio buttons by name

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    // Attach event listener using jQuery's .on()
    this.form.on("submit", this.addTransaction.bind(this));
  }

  // Helper to get the selected transaction type from radio buttons
  getSelectedTransactionType() {
    // Use .filter(":checked") to find the checked radio button and .val() to get its value
    return this.transactionTypeInputs.filter(":checked").val() || "expense";
  }

  addTransaction(e) {
    e.preventDefault(); // Prevent default form submission

    // Get input values using .val() and trim whitespace
    if (
      this.text.val().trim() === "" ||
      this.amount.val().trim() === "" ||
      this.category.val().trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    let amt = Math.abs(+this.amount.val()); // Convert amount to a number and make it absolute
    const type = this.getSelectedTransactionType();

    // If transaction type is expense, make amount negative
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(), // Unique ID for the transaction
      text: this.text.val().trim(),
      amount: amt,
      type,
      category: this.category.val()
    };

    this.transactions.push(transaction); // Add new transaction to the array
    this.addTransactionDOM(transaction); // Add transaction to the DOM
    this.updateValues(); // Update balance, income, and expense displays
    this.updateLocalStorage(); // Save transactions to local storage

    // Clear input fields using .val('')
    this.text.val('');
    this.amount.val('');
    this.category.val('');
  }

  addTransactionDOM(transaction) {
    // Determine CSS class based on amount (plus for income, minus for expense)
    const sign = transaction.amount < 0 ? "minus" : "plus";

    // Create new list item using jQuery
    const item = $("<li></li>")
      .addClass(sign) // Add appropriate class
      .html(`
                <span>${transaction.text} [${transaction.category}]</span>
                <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
                <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>
            `);

    this.list.append(item); // Append the new item to the list
  }

  updateValues() {
    // Get all amounts from transactions
    const amounts = this.transactions.map(t => t.amount);

    // Calculate total balance
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

    // Calculate total income (positive amounts)
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);

    // Calculate total expense (negative amounts, converted to positive for display)
    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) *
      -1
    ).toFixed(2);

    // Update the text content of elements using jQuery's .text()
    this.balance.text(`$${total}`);
    this.money_plus.text(`+$${income}`);
    this.money_minus.text(`-$${expense}`);
  }

  removeTransaction(id) {
    // Filter out the transaction with the given ID
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage(); // Update local storage
    this.init(); // Re-initialize (re-render) the UI to reflect changes
  }

  updateLocalStorage() {
    // Save transactions array to local storage
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  init() {
    // Clear the list before re-rendering using jQuery's .empty()
    this.list.empty();
    // Add each transaction to the DOM
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues(); // Update financial summary
  }
}

// Create an instance of the ExpenseTracker when the script loads
const tracker = new ExpenseTracker();