
// Global variables
const addCurrencyBtn = document.querySelector('.add-currency-btn')
const addCurrencyList = document.querySelector('.add-currency-list')
const currenciesList = document.querySelector('.currencies')

const initiallyDisplayedCurrencies = []
let baseCurrency;
let baseCurrencyAmount;

//https://www.worldometers.info/geography/flags-of-the-world/
let currencies = [
  {
    name: 'Dolar Americano',
    abbreviation: 'USD',
    symbol: 'US\u0024',
    flagURL: `https://www.worldometers.info/img/flags/us-flag.gif`,
    rate:0 
  },
  {
    name: 'Dolar Canadense',
    abbreviation: 'CAD',
    symbol: 'CA\u0024',
    flagURL: `https://www.worldometers.info/img/flags/ca-flag.gif`,
    rate:0
  },
  {
    name: 'Dolar Australiano',
    abbreviation: 'AUD',
    symbol: 'AU\u0024',
    flagURL: `https://www.worldometers.info/img/flags/as-flag.gif`,
    rate:0
  },
  {
    name: 'Libra Esterlina',
    abbreviation: 'GBP',
    symbol: '\u00A3',
    flagURL: `https://cdn.britannica.com/25/4825-004-F1975B92/Flag-United-Kingdom.jpg`,
    rate:0
  },
  {
    name: 'EURO União Europeia',
    abbreviation: 'EUR',
    symbol: '\u20AC',
    flagURL: `https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg`,
    rate:0
  },
  {
    name: 'Peso Mexicano',
    abbreviation: 'MXN',
    symbol: 'MX\u0024',
    flagURL: `https://www.worldometers.info/img/flags/mx-flag.gif`,
    rate:0
  },  
  {
    name: 'Peso Filipino',
    abbreviation: 'PHP',
    symbol: '\u20B1',
    flagURL: `https://www.worldometers.info/img/flags/rp-flag.gif`,
    rate:0
  },
  {
    name: 'Real Brasileiro',
    abbreviation: 'BRL',
    symbol: 'R\u0024',
    flagURL: `https://www.worldometers.info/img/flags/br-flag.gif`,
    rate:0
  },
    
]

// Fetch ==============================================
const options = {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": process.env.RAPID_API_HOST
  }
}

// Possibillity used factory design
async function GetCurrencyAPI(base, changeTo) {
  const data = await fetch(`https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=${base}&to=${changeTo}&amount=1`, options)
  const resp = await data.json()
  document.querySelector('.date').textContent = resp.updated_date
  return resp
}

function setFetchDataToCurrenciesArray() {
  currencies.forEach(currency => {
    if (baseCurrency){
      GetCurrencyAPI(baseCurrency, currency.abbreviation)
        .then((resp) => {
          const currentCurrency = currency.abbreviation
          currency.rate = Number(resp.rates[currentCurrency].rate)
        })
    }
  })
}

// Eventlisteners ==============================================
addCurrencyBtn.addEventListener('click', addCurrencyBtnClick)
function addCurrencyBtnClick(event) {
  addCurrencyBtn.classList.toggle('open')
}

addCurrencyList.addEventListener("click", addCurrencyListClick)

function addCurrencyListClick(event) {
  const clickedListItem = event.target.closest("li")
  const dataCurrency = clickedListItem.getAttribute("data-currency")

  initiallyDisplayedCurrencies.push(dataCurrency)

  if (!clickedListItem.classList.contains("disabled")) {
    const newCurrency = currencies.find(c =>
      c.abbreviation === clickedListItem.getAttribute("data-currency"))
    if (newCurrency) newCurrenciesListItem(newCurrency)
  }

}/*
  Find a item in array currencies that 
  is equal to clicked item from tag "li"
*/

currenciesList.addEventListener("click", currenciesListClick)

function currenciesListClick(event) {
  if (event.target.classList.contains("close")) {
    const parentNode = event.target.parentNode;
    parentNode.remove()
    addCurrencyList.querySelector(`[data-currency=${parentNode.id}]`)
      .classList.remove('disabled')

    if (parentNode.classList.contains("base-currency")) {
      const newBaseCurrencyLI = currenciesList.querySelector(".currency")

      if (newBaseCurrencyLI) {
        setNewBaseCurrency(newBaseCurrencyLI)
        baseCurrencyAmount = Number(newBaseCurrencyLI.querySelector(".input input")
          .value)
      }
    }
  }
}/*
  Close item from list for data-currency
*/

function setNewBaseCurrency(newBaseCurrencyLI) {
  newBaseCurrencyLI.classList.add("base-currency")
  baseCurrency = newBaseCurrencyLI.id

  const baseCurrencyRate = currencies.find(c =>
    c.abbreviation === baseCurrency).rate;

  currenciesList.querySelectorAll(".currency").forEach(currencyLI => {

    const currencyRate = currencies.find(currency =>
      currency.abbreviation === currencyLI.id).rate

    const exchangeRate = currencyLI.id === baseCurrency ? 1 :
      (currencyRate / baseCurrencyRate).toFixed(2)

    currencyLI.querySelector("base-currency-rate").textContent =
      `1 ${baseCurrency} = ${exchangeRate} ${currencyLI.id}`
  });

  
}

currenciesList.addEventListener('input', currenciesListInputChange)

function currenciesListInputChange(event) {

  const isNewBaseCurrency = event.target.closest("li").id !== baseCurrency;
  if (isNewBaseCurrency) {
    currenciesList.querySelector(`#${baseCurrency}`)
      .classList.remove("base-currency")
    setNewBaseCurrency(newBaseCurrencyLI)
  }
  const newBaseCurrencyAmount = isNaN(event.target.value) ? 0 :
    Number(event.target.value)

  if (baseCurrencyAmount !== newBaseCurrencyAmount || isNewBaseCurrency) {

    baseCurrencyAmount = newBaseCurrencyAmount
    const baseCurrencyRate = currencies.find(c =>
      c.abbreviation === baseCurrency).rate;

    currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
      if (currencyLI.id !== baseCurrency) {

        const currencyRate = currencies.find(currency =>
          currency.abbreviation === currencyLI.id).rate

        const exchangeRate = currencyLI.id === baseCurrency ? 1 :
          (currencyRate / baseCurrencyRate).toFixed(2)
          
        currencyLI.querySelector(".input input").value =
          exchangeRate * baseCurrencyAmount !== 0 ?
            (exchangeRate * baseCurrencyAmount).toFixed(2) : ""

      }
    });
  }
}

currenciesList.addEventListener("focusout", currenciesListFocusOut)

function currenciesListFocusOut(event) {
  const inputValue = event.target.value
  if (isNaN(inputValue) || Number(inputValue) === 0) event.target.value = ""
  else event.target.value = Number(inputValue).toFixed(2)
}

currenciesList.addEventListener("keydown", currenciesListKeyDown);

function currenciesListKeyDown(event) {
  if (event.key === "Enter") event.target.blur()
}

// Auxiliary functions ==============================================
function populateAddCurrencyList() {
  for (let i = 0; i < currencies.length; i++) {
    const tag = `
    <li data-currency=${currencies[i].abbreviation} >
      <img src=${currencies[i].flagURL} alt="" class="flag">
      <span>${currencies[i].abbreviation} - ${currencies[i].name}</span>
    </li>
    `
    addCurrencyList.insertAdjacentHTML('beforeend', tag)
  }
}
populateAddCurrencyList()

// Initial page
function populateCurrencieList() {
  for (let i = 0; i < initiallyDisplayedCurrencies.length; i++) {
    const currency = currencies.find(c =>
      c.abbreviation === initiallyDisplayedCurrencies[i])
    if (currency)
      newCurrenciesListItem(currency)
  }
}
populateCurrencieList()

function newCurrenciesListItem(currency) {
  setFetchDataToCurrenciesArray()

  if (currenciesList.childElementCount === 0) {
    baseCurrency = currency.abbreviation;
    baseCurrencyAmount = 0;
  }
  addCurrencyList.querySelector(`[data-currency=${currency.abbreviation}]`)
    .classList.add('disabled')

  const baseCurrencyRate = currencies.find(c =>
    c.abbreviation === baseCurrency).rate;
  const exchangeRate = currency.abbreviation === baseCurrency ? 1 :
    (currency.rate / baseCurrencyRate).toFixed(2)
  const inputVaue = baseCurrencyAmount ?
    (baseCurrencyAmount * exchangeRate).toFixed(2) : "";

  
  currenciesList.insertAdjacentHTML(
    "beforeend",
    `<li class="currency ${currency.abbreviation === baseCurrency ? "base-currency" : ""}" id=${currency.abbreviation}>
    <img src=${currency.flagURL} alt="" class="flag">
    <div class="info">
      <p class="input">
        <span class="currency-symbol">
          ${currency.symbol}
        </span>
        <input type="text" placeholder="0.00" value=${inputVaue}>
      </p>
      <p class="currency-name">
        ${currency.abbreviation} - ${currency.name}
      </p>
      <p class="base-currency-rate">
        1 ${baseCurrency} = ${exchangeRate} ${currency.abbreviation}
      </p>
    </div>
    <span class="close">&times;</span>
  </li>`
  )

}


