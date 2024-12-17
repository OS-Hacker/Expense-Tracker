const Show_History = document.querySelector(".Show_History");
const Add_btn = document.querySelector(".Add_btn");

const Add_transaction = document.querySelector(".Add_transaction");
const history = document.querySelector(".history");

const inputAmount = document.querySelector("#inputAmount");
const inputText = document.querySelector("#inputText");

const transition_form = document.getElementById("transition_form");

const Transitions = JSON.parse(localStorage.getItem("transition")) || [];

Add_btn.style.backgroundColor = "black";
Add_btn.style.color = "white";

Add_btn.addEventListener("click", () => {
  Show_History.style.backgroundColor = "";
  Add_btn.style.backgroundColor = "black";
  Add_btn.style.color = "white";
  Show_History.style.color = "";

  // hide & show section
  Add_transaction.classList = "show";
  history.classList = "hide";
});

Show_History.addEventListener("click", () => {
  Add_btn.style.backgroundColor = "";
  Show_History.style.backgroundColor = "black";
  Show_History.style.color = "white";
  Add_btn.style.color = "";

  // hide & show section
  Add_transaction.classList = "hide";
  history.classList = "show";
});

const Error = document.querySelector(".Error");

const addTransition = (e) => {
  e.preventDefault();
  Error.innerHTML = ""; // Clear Error
  if (inputAmount.value.trim() === "" || inputText.value.trim() === "") {
    Error.innerHTML = "Please Enter All Fields";
  } else if (!isNaN(inputText.value)) {
    Error.innerHTML = "Please Enter Valid Title";
  } else {
    const isIncome = e.submitter.id === "btn-income";

    const transition = {
      id: Transitions.length + 1,
      date: new Date().toLocaleString(),
      amount: +inputAmount.value,
      text: inputText.value,
      type: isIncome ? "credit" : "debit",
    };

    Transitions.push(transition);
    updateHistory();
    updateValues();
    saveTransitions();
    inputAmount.value = "";
    inputText.value = "";
  }
};

const updateHistory = () => {
  const history_container = document.querySelector(".history_container");
  history_container.innerHTML = ""; // Clear history
  if (Transitions.length === 0) {
    history_container.innerHTML = `<p>No Transactions Yet.</p>`;
  }
  Transitions.forEach((transition) => {
    const { id, text, amount, type } = transition;
    const isIncome = type === "credit";
    const isSign = isIncome ? "+" : "-";
    const li = document.createElement("li");
    li.classList.add(isIncome ? "plus" : "mins");
    li.innerHTML = `
             <span>${text}</span>
             <span>${isSign} ${amount}</span>
             <button class="delete-btn" onclick="deleteTransition(${id})">❌</button>
           `;
    history_container.appendChild(li);
  });
};

const updateValues = () => {
  const credit = Transitions.filter((t) => t.type === "credit").reduce(
    (acc, t) => acc + t.amount,
    0
  );
  const debit = Transitions.filter((t) => t.type === "debit").reduce(
    (acc, t) => acc + t.amount,
    0
  );
  const totalAmount = credit - debit;
  document.querySelector("#total").textContent = `₹${totalAmount}`;
  document.querySelector(".income").textContent = `₹${credit}`;
  document.querySelector(".expense").textContent = `₹${debit}`;
};

const deleteTransition = (id) => {
  // const index = Transitions.findIndex((trx) => trx.id === id);
  // Transitions.splice(index, 1);

  const removeTrx = Transitions.filter((trx) => trx.id !== id);
  Transitions.length = 0; // Clear the existing array
  Transitions.push(...removeTrx); // Spread the filtered array back into Transitions

  updateHistory();
  updateValues(); // Update balance and values
  saveTransitions();
};

const saveTransitions = () => {
  localStorage.setItem("transition", JSON.stringify(Transitions));
};

transition_form.addEventListener("submit", addTransition);

// Initial call to populate history and values
document.addEventListener("DOMContentLoaded", () => {
  updateHistory();
  updateValues();
});
