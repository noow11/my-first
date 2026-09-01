const currentDisplay = document.querySelector('#currentDisplay');
const previousDisplay = document.querySelector('#previousDisplay');
const keypad = document.querySelector('.keypad');

let currentValue = '0';
let storedValue = null;
let selectedOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentDisplay.textContent = currentValue;
  previousDisplay.textContent = storedValue !== null && selectedOperator
    ? `${storedValue} ${selectedOperator}`
    : '';
}

function inputNumber(number) {
  if (currentValue === 'Error' || shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === '0' ? number : currentValue + number;
  }
  updateDisplay();
}

function inputDecimal() {
  if (currentValue === 'Error' || shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function calculate(first, second, operator) {
  const left = Number(first);
  const right = Number(second);
  if (operator === '+') return left + right;
  if (operator === '−') return left - right;
  if (operator === '×') return left * right;
  if (operator === '÷') return right === 0 ? null : left / right;
  if (operator === '%') return left % right;
  return right;
}

function chooseOperator(operator) {
  if (currentValue === 'Error') return;
  if (storedValue !== null && selectedOperator && !shouldResetDisplay) evaluate();
  storedValue = currentValue;
  selectedOperator = operator;
  shouldResetDisplay = true;
  updateDisplay();
}

function evaluate() {
  if (storedValue === null || selectedOperator === null || currentValue === 'Error') return;
  const result = calculate(storedValue, currentValue, selectedOperator);
  currentValue = result === null || !Number.isFinite(result) ? 'Error' : String(Number(result.toFixed(10)));
  storedValue = null;
  selectedOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  selectedOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteNumber() {
  if (shouldResetDisplay || currentValue === 'Error') return clearCalculator();
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.action === 'decimal') inputDecimal();
  if (button.dataset.action === 'operator') chooseOperator(button.dataset.value);
  if (button.dataset.action === 'equals') evaluate();
  if (button.dataset.action === 'clear') clearCalculator();
  if (button.dataset.action === 'delete') deleteNumber();
});

document.addEventListener('keydown', (event) => {
  if (/\d/.test(event.key)) inputNumber(event.key);
  if (event.key === '.') inputDecimal();
  if (event.key === 'Enter' || event.key === '=') evaluate();
  if (event.key === 'Escape') clearCalculator();
  if (event.key === 'Backspace') deleteNumber();
  const operators = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' };
  if (operators[event.key]) chooseOperator(operators[event.key]);
});

updateDisplay();
