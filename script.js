const api_key = "83b17638f87c1c31492c24a8";

const input_selector = document.querySelectorAll(".select-wrapper select");
const button = document.getElementById("convert-button");
const fromCurr = document.querySelector("#from-currency");
const toCurr = document.querySelector("#to-currency");

for (let select of input_selector) {
  for (currCode in countryList) {
    let new_option = document.createElement("option");
    new_option.innerHTML = currCode;
    new_option.value = currCode;
    if (select.id === "from-currency" && currCode === "USD") {
      new_option.selected = "selected";
    } else if (select.id === "to-currency" && currCode === "BDT") {
      new_option.selected = "selected";
    }
    select.append(new_option);

    select.addEventListener("change", (evt) => {
      updateflag(evt.target);
    });
  }
}

const updateflag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

button.addEventListener("click", (evnt) => {
  evnt.preventDefault();
  update_exchange_rate();
});

const update_exchnage_rate= async()=>{
  let amount = document.querySelector("#amount");
  let amount_value = parseFloat(amount.value);

  // Validate input
  if (isNaN(amount_value) || amount_value <= 0) {
    alert("Please enter a valid amount greater than 0");
    return;
  }

  const api = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${fromCurr.value}`;

  try {
    // Fetch exchange rates
    let response = await fetch(api);
    let data = await response.json();

    if (data.result === "success") {
      const conversionRate = data.conversion_rates[toCurr.value];
      const convertedAmount = (amount_value * conversionRate).toFixed(2);

      // Display result
      document.getElementById("result").innerHTML = `
        <p>${amount_value} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}</p>
      `;
    } else {
      throw new Error(data["error-type"]);
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    alert("Failed to fetch exchange rates. Please try again.");
  }
}
window.addEventListener("load",()=>{
update_exchange_rate();
});
