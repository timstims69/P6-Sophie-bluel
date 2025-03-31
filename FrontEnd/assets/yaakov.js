let works = [];

async function getWorks() {
  // attention code asynchrone ! CAD que certaine partie ont lieue en meme temps que d'autres au lieu d'érape par étape
  // , (Voir exemple cuisine)
  // J'ai fonction de faire une requete au serveur swagmachéou
  const url = "http://localhost:5678/api/works"; // qui se trouve a tel adresse, qui prend maintenant la valeure d' "url"
  try {
    const response = await fetch(url); // 1 Je fait une requete fetch, CAD qui va chercher des données dispos dans l'adresse,-
    //-await veut dire que j'attend la réponse avant de continuer, try = si le serv ne répond pas alors execute code etape 7

    if (!response.ok) {
      // 2 en cas de problème j'envoie une message d'erreure
      throw new Error(`Response status: ${response.status}`);
    }

    works = await response.json(); // Stocker les données dans la variable globale
    // Vérification des données // 3 Les données reçues du serveur est  converti en JSON,
    // la propriétée response représente la reponse du serv ensuite, .json coverti en json
    // aussi await ici veut idre que j'attend la réponse du serveur avant de la process
    window.localStorage.setItem("works", works);
    // 4 J'affiche les données dans la console, pour que je puisse les voir perso

    for (let i = 0; i < works.length; i++) {
      //5 Si y'a plusieur éléments dans les données, je boucle et donc les select 1 à 1

      setFigure(works[i]); //6 Pour chaque element j'applique la fonction Setfigure,
      setminiImage(works[i]);
      // aussi le travail json lui est passé en parametre (décrite à L23)
    }
  } catch (error) {
    console.error(error.message); //7 En cas de blem' je t'affiche un message d'erreure, catch car "attrape" si tu choppe un blem
  }
}

getWorks(); // J'appelle la fonction getWorks L1 ce qui fait que : X

// donc en gros :
// A_ Je demande les données au serveur
// B_ J'en fait des "cartes"
// C_ Je les inseres dans la gallerie

//----------------------------------------------------------------------------------
//                                   _Categories_

//Lui il sert a mettre les boutons filtres sur la page
function sanitizeId(name) {
  return name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(); // Remplace les caractères non alphanumériques par des tirets
}

function setFilter(data) {
  const div = document.createElement("div");
  div.innerHTML = `${data.name}`;
  div.id = sanitizeId(data.name); // Utilise l'ID nettoyé
  document.querySelector(".div-container").append(div);
}

// La stratégie est de faire un GET WORKS qui ne garde seulement que l'id dans
// les données qui sont tirées de l'api a partir de getCategories

//balagan a partir d'ici
function filtration(categorie) {
  const categorieNamePropre = sanitizeId(categorie.name); // ! ici methode sanitize!
  const boutonObjet = document.querySelector(`#${categorieNamePropre}`);
  if (!boutonObjet) {
    // si je n'arrive pas a trouver le bouton  alors :
    console.error(`Bouton introuvable pour ${categorie.name}`);
    return;
  }

  boutonObjet.addEventListener("click", () => {
    document.querySelector(".gallery").innerHTML = ""; // Vide la galerie

    if (categorie.name === "tous") {
      works.forEach((work) => setFigure(work));
    } else {
      const filteredWorks = works.filter(
        (work) => work.categoryId === categorie.id
      );
      filteredWorks.forEach((work) => setFigure(work));
    }
  });
}

async function getCategories() {
  const urlCat = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(urlCat);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    // Ajoute une catégorie "Tous" manuellement
    setFilter({ name: "tous", id: null });
    filtration({ name: "tous", id: null });

    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
      filtration(json[i]);
      setOption(json[i]);
      //Permet la creation de bouton et autre
    }
  } catch (error) {
    console.error(error.message);
  }
}

getCategories();

//----------------------------------------------------------------------------------
//                              _Mode Admin_

// Ici je veut faire en sorte que le site détecte si l'admin est connecté ou pas
let adminModeBanner = document.getElementById("adminModeBanner");
let logoutButton = document.getElementById("logoutButton");
let loginButton = document.getElementById("loginButton");
let token = window.localStorage.getItem("JWT_TOKEN");

if (token) {
  loginButton.innerHTML = "logout";
  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("mode admin desactivé");
    localStorage.clear();
    window.location.replace("./index.html");
  });
  console.log("Mode Admin activé");
} else {
  adminModeBanner.style.display = "none";
  loginButton.innerHTML = "login";

  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.replace("./login.html");
  });
  console.log("Mode Invité");
}

// modale

// Get the modal
let modal = document.getElementById("modalSend");

// Get the button that opens the modal
let btn = document.getElementById("potatosalad");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  let modaleGalerie = document.getElementById("modaleGalerie");
  let modalGaleriecontent = document.getElementById("modalGaleriecontent");
  modaleGalerie.style.display = "block";
  modalGaleriecontent.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modaleGalerie.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let modalCreatework = document.getElementById("modalCreatework");
let ajouterPhoto = document.getElementById("ajouterPhoto");

ajouterPhoto.onclick = function () {
  modalCreatework.style.display = "block";
  modaleGalerie.style.display = "none";
};

// ajout de photo

function imageModal() {
  console.log("ImageModal Lancé");
  let dataWorks = window.localStorage.getItem("works");
  setminiImage(dataWorks);
}

function setminiImage(work) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const i = document.createElement("i");
  img.src = work.imageUrl;
  img.alt = work.title;
  img.classList.add("imageModal");
  div.classList.add("imageModalContainer");
  i.classList.add("fa-trash", "fa-solid");
  div.appendChild(img);
  div.appendChild(i);
  document.getElementById("galerie-photo").appendChild(div);
}

function setFigure(data) {
  const figure = document.createElement("figure");

  figure.innerHTML = `<img src =${data.imageUrl} alt${data.title}> 
				<figcaption>${data.title}</figcaption>`;

  document.querySelector(".gallery").append(figure);
}
let buttonValider = document.getElementById("buttonValider");
buttonValider.addEventListener("click", async (event) => createWork()); //Detecte l'envoie des works

function createWork() {
  let FichierPourLePost = document.getElementById("image").files[0];
  let workTitle = document.getElementById("inputCategorie").value;
  let categorie = document.getElementById("selectcategories").id; //recupere l'id de la liste déroulante pour l'assigner au moment du post
  let formData = {
    image: FichierPourLePost,
    title: workTitle,
    category: categorie,
  };

  let token = window.localStorage.getItem("JWT_TOKEN");
  console.log(token);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      // Quand je reçois réponse, stocke dans variable : response
      //la reponse reçue = variable response
      console.log(response);
      if (!response.ok) {
        throw new Error("utilisateur Non Reconnu");
      }
      return response.json(); //La derniere chose retournée on la stock dans la variable qui suit le then suivant
      //aussi le .json permet de récuperer les données json qui accompagne la réponse
    })
    .then((data) => {
      console.log(data.categorie);
    })
    .catch((error) => {
      console.log("erreur dans la requete post");
    });
}

const option = document.createElement("option");

function setOption(data) {
  const option = document.createElement("option");
  option.innerHTML = `${data.name}`;
  option.value = `${data.name}`;
  option.id = `${data.id}`; // pour mettre une option avec l'id
  // .Name ici vaut dire categories
  document.getElementById("selectcategories").append(option);
}
// petites étapes et petites tranches de temps correspondantes
// noter les avancements
//

//exercices :
//Travailler sur l'esthethique de la modale
//Positioner le button modifer et faire en sorte qu'il affiche la modale
//Le bouton modifier ne s'affiche que si on est admin

//histamesh hadere'h hah'azaka l'aavod kmo shetsari'h, et explorer cette idée, tezah'er ma
//shekara leh'a baavoda im ahou a h'azak, ma sheh'aser mimeh'a :  zo hi a "kashiout"
