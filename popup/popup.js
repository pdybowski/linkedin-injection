const ALLOWED_VALUES = [
    'picture',
    'name',
    'gender',
    'location',
    'email',
    'phone',
    'cell',
    'nat',
    'dob'
]

document.addEventListener("DOMContentLoaded", function() {
    init();
})

function init() {
    renderCheckboxes();
    bindEvents();
}

function bindEvents() {
    const submitBtn = document.querySelector('#SubmitButton');
    submitBtn.addEventListener('click', submit);
}

function renderCheckboxes() {
    const targetElement = document.querySelector("#CheckboxArea");
    if(!targetElement) return;
    ALLOWED_VALUES.forEach(value => {
        const checkbox = `<label class="popup__checkbox">${value} <input type="checkbox" name="${value}" /></label>`;
        targetElement.innerHTML += checkbox;
    })
}

function getSelectedCheckboxes() { 
    const checkboxes = [...document.querySelectorAll("input[type=checkbox]:checked")];
    return checkboxes;
}

function getSelectedParams() {
    const checkboxes = getSelectedCheckboxes();
    const params = checkboxes.map(c => `${c.name}`).join(",");
    return params;
}

async function submit() {
    const params = getSelectedParams();
    if(!params) return;

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tabs[0].id, params)
}