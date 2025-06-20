const url = 'https://restcountries.com/v2/all?fields=name,nativeName,flag,region,population';

const ulPaises = document.querySelector('#tabCountries');
const ulFav = document.querySelector('#tabFavorites');
const popuTot = document.querySelector('#totalPopulationList');
const totalP = document.querySelector('#countCountries');
const totalPF = document.querySelector('#countFav');
const popuTotF = document.querySelector('#totalPopulationFavorites');
const Search = document.querySelector('#pesquisar');

let country = [];
let favoritos = [];
let filtred = '';

fetch(url)
  .then((response) => response.json())
  .then((result) => {
    country = result;
    renderizar();
  });

function renderizar(filter, type) {
  let populationGlob = 0;
  let contP = 0;
  filtred = filter || '';

  let paises = `
    <tr>
      <th colspan='2'>Bandeira</th>
      <th>Nome</th>
      <th>População</th>
    </tr>`;

  const filteredCountries = country.filter((countryItem) => {
    if (!countryItem || favoritos.includes(countryItem)) return false;

    if (type === 'Letter') {
      return (
        countryItem.name.toLowerCase().startsWith(filter.toLowerCase()) ||
        (countryItem.nativeName &&
          countryItem.nativeName.toLowerCase().startsWith(filter.toLowerCase()))
      );
    }

    if (type === 'Region') {
      return countryItem.region === filter;
    }

    return true;
  });

  filteredCountries.forEach((countryItem) => {
    const index = country.indexOf(countryItem);
    populationGlob += parseInt(countryItem.population);
    contP++;

    paises += `
      <tr class='${countryItem.region}'>
        <td><button class='add button' onclick="favoritar(${index})"> + </button></td>
        <td><img src='${countryItem.flag}' style="height: 20px;"></td>
        <td>${countryItem.nativeName} (${countryItem.name})</td>
        <td>${countryItem.population}</td>
      </tr>`;
  });

  ulPaises.innerHTML = paises;
  popuTot.textContent = populationGlob.toLocaleString('pt-BR');
  totalP.textContent = contP;
}

function renderizarF() {
  let total = 0;
  let cont = 0;

  let favHTML = `
    <tr>
      <th colspan='2'>Bandeira</th>
      <th>Nome</th>
      <th>População</th>
    </tr>`;

  favoritos.forEach((favItem, index) => {
    total += parseInt(favItem.population);
    cont++;

    favHTML += `
      <tr class='${favItem.region}'>
        <td><button class='remove' onclick="removeFav(${index})"> - </button></td>
        <td><img src='${favItem.flag}' style="height: 20px;"></td>
        <td>${favItem.nativeName} (${favItem.name})</td>
        <td>${favItem.population}</td>
      </tr>`;
  });

  ulFav.innerHTML = favHTML;
  popuTotF.textContent = total.toLocaleString('pt-BR');
  totalPF.textContent = cont;
}

function favoritar(index) {
  const pais = country[index];
  if (!favoritos.includes(pais)) {
    favoritos.push(pais);
  }

  country = country.filter((_, i) => i !== index);

  renderizar(filtred, filtred ? 'Region' : undefined);
  renderizarF();
}

function removeFav(index) {
  const pais = favoritos[index];
  country.push(pais);
  favoritos = favoritos.filter((_, i) => i !== index);

  renderizar(filtred, filtred ? 'Region' : undefined);
  renderizarF();
}

Search.addEventListener('input', () => {
  const termo = Search.value.trim();
  if (termo.length > 0) {
    renderizar(termo, 'Letter');
  } else {
    renderizar(filtred, filtred ? 'Region' : undefined);
  }
});
