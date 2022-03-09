const BASE_URL = "https://randomuser.me/api/";
const LEADJET_INJECT_ID = "InjectedElementByLeadJet"
const TARGET_SELECTOR = "#main";

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    getData(message).then((res) => {
        sendResponse();
        injectProfileData(res);
    });
    return true;
})

async function getData(params) {
    let url = BASE_URL;

    if(params) url += `?inc=${params}&noinfo`
    else url += "?noinfo"

    try {
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();

        return data.results[0] || {};
    } catch(error) {
        console.log(error);
    }
}

function renderDetail(data) {
    if(typeof data === 'object') {
        let result = "";
        Object.keys(data).forEach(key => {
            result += renderDetail(data[key]);
        })
        return result;
    } else {
        return data + ', ';
    }
}

function generateContainer(profileData) {
    let html = `<div class="pvs-header__container">
                    <div class="pvs-header__top-container--no-stack">
                        <div class="pvs-header__title-container">
                            <h2 class="pvs-header__title text-heading-large"><span>Profile Data</span></h2>
                        </div>
                    </div>
                </div>`

    html += `<div class="pvs-list__outer-container">
                <ul class="pvs-list ph5 display-flex flex-row flex-wrap">`

    Object.keys(profileData).forEach(key => {
        html += `<li class="artdeco-list__item pvs-list__item--line-separated pvs-list__item--one-column">
                <div class="pvs-entity pvs-entity--padded pvs-list__item--no-padding-when-nested">
                    <div class="display-flex flex-column full-width align-self-center">
                        <div class="display-flex flex-row justify-space-between">
                            <div class="display-flex flex-column full-width">
                                <div class="display-flex align-items-center">
                                    <span class="t-bold mr1">
                                        ${key}
                                    </span>
                                </div>
                                <span class="t-14 t-normal">
                                    ${renderDetail(profileData[key])}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`
    })

    html += `</ul></div>`;

    return html;
}

function injectProfileData(profileData) {
    const targetElement = document.querySelector(TARGET_SELECTOR);
    if(!targetElement) return;

    const leadJetElement = document.querySelector(`#${LEADJET_INJECT_ID}`);
    if(leadJetElement) leadJetElement.remove();

    const elementToInject = document.createElement("section");
    elementToInject.setAttribute("id", LEADJET_INJECT_ID);
    const classes = ['artdeco-card', 'ember-view', 'break-words', 'pb3', 'mt4'];
    elementToInject.classList.add(...classes);

    const html = generateContainer(profileData);

    elementToInject.innerHTML = html;
    targetElement.insertBefore(elementToInject, targetElement.children[1]);
}

