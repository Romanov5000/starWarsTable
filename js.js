const userAttr = ['name', 'height', 'mass', 'eye_color'];
const planetAttr = ['name', 'diameter', 'gravity', 'climate'];
let table = document.createElement('table');

function addPlanetTd(tr, text) {
    let planetTd = document.createElement('td');
    planetTd.classList.add('planet_td');

    if (text) {
        planetTd.innerHTML = text;
        planetTd.addEventListener('click', showPlanet);
    }
    
    tr.append(planetTd);
}

function closeModalOutForm(event) {
    let modal = document.querySelector('.planet_modal');

    if (!event.path.includes(modal)) {
        document.body.removeEventListener('click', closeModalOutForm);
        modal.remove();
    }
}
function closeModal() {
    let modal = this.closest('.planet_modal');
    modal.remove();
    
}
function showPlanetModal(planet, top, left) {
    
    let modal = document.createElement('div');
    modal.className = 'planet_modal';
    modal.style.top = `${top}px`;
    modal.style.left = `${left - 402}px`;

    let table = document.createElement('table');
    table.className = 'planet_table';
    let planetImage = document.createElement('div');
    planetImage.className = 'planet_image';

    planetAttr.forEach((el) => {
        let trHead = document.createElement('tr');
        trHead.className = 'tr_head';
        let tdHead = document.createElement('td');
        
        tdHead.innerHTML =` ${el} : ${planet[el]}`;
        
        trHead.append(tdHead);
        table.append(trHead);
        
    planetImage.innerHTML = `<img src="./stat_image/planets/${planet.name}.png" alt="${planet[el].name}">`;
    document.body.addEventListener('click', closeModalOutForm);
    
    });

    let closeBtn = document.createElement('div');
    closeBtn.className = 'close_btn';
    closeBtn.innerHTML = `<span>X</span>`;

    closeBtn.addEventListener('click', closeModal);
    
    
    modal.append(table);
    modal.append(closeBtn);
    document.body.prepend(modal);

    modal.append(planetImage);
    document.body.prepend(modal);
}

async function showPlanet(event) {
    let top = event.layerY;
    let left = event.layerX;
    let planet = await getPlanet(this);
    showPlanetModal(planet, top, left);
}

async function getPeople() {
    let response = await fetch('https://swapi.dev/api/people/');
    let people = (await response.json()).results;
    return people;
}
console.log(getPeople());

async function getPlanet(td) {
    let url = td.closest('tr').dataset.planetUrl;
    let response = await fetch(url);
    let planet = await response.json();
    return planet;
}


function createTableHead(userAttr) {
    let tr = document.createElement('tr');

    tr.className = 'header_tr';

    userAttr.forEach(element => {
        let td = document.createElement('td');
        td.innerHTML = element;
        tr.append(td);
    });

    addPlanetTd(tr, null);

    table.append(tr);

    let usersBlock = document.querySelector('.users_block');
    usersBlock.append(table);
}

async function pastePeople(peoplePromise) {
    let people = await peoplePromise;
    people.forEach((el) => {
        let tr = document.createElement('tr');
        tr.dataset.planetUrl = el.homeworld;
        userAttr.forEach((item) => {
            let td = document.createElement('td');
            td.innerHTML = el[item];
            tr.append(td);
        });

        addPlanetTd(tr, 'home planet');

        table.append(tr);
    });
}

createTableHead(userAttr);
pastePeople(getPeople());