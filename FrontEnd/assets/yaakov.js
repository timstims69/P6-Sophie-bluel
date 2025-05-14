let works = []; // Je prépare un tableau vide pour y mettre le Json apr la suite

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
    // la propriétée response représente la reponse du serv ensuite, .json converti les fichiers reçu en json
    // je sais que je me répète mais maintenant a chaque fois que on va appeler works, on appelle maintenant les données json donné par l'api.
    // await ici veut dire que j'attend la réponse du serveur avant de la process
    window.localStorage.setItem("works", JSON.stringify(works)); //Je stocke le works dans le local storge, mais pour se faire il faut que works soit en format string
    //par contre je ne sais plus pourquoi je doit le stocker dans le local storage
    // 4 J'affiche les données dans la console, pour que je puisse les voir perso (Au final j'ai supprimé ma ligne)

    for (let i = 0; i < works.length; i++) {
      //5 Si y'a plusieur éléments dans les données, je boucle et donc les select 1 à 1
      setminiImage(works[i]);
      setFigure(works[i]);

      // auparavant il n'y avait pas de boucle for ici, mais j'en ai besoin afin assigner un à un les fonction setminiImage et setFigure au element de works, sans cette boucle le code essaye -
      // -de de le faire d'un coup et les image et mini images ne se créent pas.

      //6 Pour chaque element de works j'applique la fonction Setfigure, ce qui fait que pour chaque donnée d'image contenue dans le json (donc la variable works), une image est crée
    }
  } catch (error) {
    console.error(error.message); //7 En cas de blem' je t'affiche un message d'erreure, catch car "attrape" si tu choppe un blem
  }
}

getWorks(); // J'appelle la fonction getWorks, car apprès l'avoir écrite et définie il ne faut pas oublier de l'appeler sinon elle ne se lance pas

// donc en gros :
// A_ Je demande les données au serveur
// B_ J'en fait des "cartes"
// C_ Je les inseres dans la gallerie

//----------------------------------------------------------------------------------
//                                   _Categories_

//Cette Partie sert a mettre les boutons filters (aussi appelés Catégories) sur la page

function sanitizeId(name) {
  return name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(); // Remplace les caractères non alphanumériques par des tirets
}
// N'oublie pas, les paramètres des fonctions (par exemple ici (data)  )ne sont pas des variables du même nom déja défini autre part dans le code,
// mais plutot un surnom que je donne a n'importe quel élément auquel je passerais en paramètre a la fonction qui ne sert que dans la portée de la dite fonction
// Si tu te pose la question,"Mais attend c'est quoi data ?", et bien il faut aller verifier dans le code où est ce qu'on appelle la fonction setFilter, et voir ce qu'on lui donne a traiter

//SetFilter Crée un Bouton avec le nom de la catégorie
function setFilter(data) {
  const div = document.createElement("div");
  div.innerHTML = `${data.name}`; // Crée une div dans le html, elle porte le nom de .name dans le json en gros
  div.id = sanitizeId(data.name); // Utilise l'ID nettoyé

  document.querySelector(".div-container").append(div); //met cette div qu'on vient de créer dans div-container
}

//girsa 1
// Pour filtrer concretement les image de la page comment faut il faire ?
// il faut refaire un GET WORKS, mais qui ne garde que les images avec l'id correspondant
//girsa 2
//On utilise les catégories reçues depuis l'API (getCategories) pour créer des boutons de filtre.
// Ensuite, quand on clique sur un bouton, on filtre les travaux (works) pour afficher seulement ceux de cette catégorie

//Filtration filtre concrètement les images sur ma page

function filtration(categorie) {
  const categorieNamePropre = sanitizeId(categorie.name); // Je prend le .name dans le Json et je lui passe la fonction sanithize pour éviter les problèmes
  const boutonObjet = document.querySelector(`#${categorieNamePropre}`); // Je cherche le bouton de catégorie/filtre du meme nom que json.name, je lui donne le nom de boutonObjet

  if (!boutonObjet) {
    // si je n'arrive pas a trouver le bouton alors j'emmet un message d'erreur avec le nom du bouton introuvable
    console.error(`Bouton introuvable pour ${categorie.name}`);
    return;
  }

  boutonObjet.addEventListener("click", () => {
    document.querySelector(".gallery").innerHTML = ""; // Vide la galerie, il faut en premier enlever toutes les images affichées pour pouvoir filtrer par la suite

    if (categorie.name === "tous") {
      // Quand j'appuye sur le bouton tous, passe setFigure a tout les works, ce qui affiche toute les images
      works.forEach((work) => setFigure(work));
    } else {
      const filteredWorks = works.filter(
        (work) => work.categoryId === categorie.id //e
      ); // Dans le works
      filteredWorks.forEach((work) => setFigure(work)); //Pourquoi ici on utilise for each ?
    }
  });
}

//getCategories va chercher les catégories dans l'api, car si je veut filtrer mes images il faut bien les avoir dans mon code
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
    setFilter({ name: "tous", id: null }); // Mais comment marche cette ligne ?
    filtration({ name: "tous", id: null }); // et celle là ?

    for (let i = 0; i < json.length; i++) {
      //Pourquoi ici on utilise (json[i]) ? Déja sans ça on ne peut pas itérer, car (json[i]) veut dire : La case numéro[X] dans Json
      setFilter(json[i]);
      filtration(json[i]);
      setOption(json[i]);
      //Permet la creation des boutons, des filtres et des options de catégories dans l'ajout d'images
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
let modal = document.getElementById("modaleGalerie");

// Get the button that opens the modal
let btn = document.getElementById("potatosalad");

// Get the <span> element that closes the modal
let span = document.getElementById("span");
let span2 = document.getElementById("span2");
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

span2.onclick = function () {
  modalCreatework.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalCreatework) {
    modalCreatework.style.display = "none";
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
  i.addEventListener("click", async (event) => deleteWork(work.id));
  div.appendChild(img);

  div.appendChild(i);
  div.id = "mini-" + work.id;
  document.getElementById("galerie-photo").appendChild(div);
}
// Je me les images sur le site, ici (data) equivaut a work[X]
function setFigure(data) {
  console.log("setFigure est lancé");
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src =${data.imageUrl} alt${data.title}> 
				<figcaption>${data.title}</figcaption>`;
  figure.id = "figure-" + data.id;
  document.querySelector(".gallery").append(figure);
}
let buttonValider = document.getElementById("buttonValider");
buttonValider.addEventListener("click", async (event) => createWork()); //Detecte l'envoie des works

async function createWork() {
  let FichierPourLePost = document.getElementById("image").files[0];
  let workTitle = document.getElementById("inputCategorie").value;
  let categorie = document.getElementById("selectcategories").value; //recupere l'id de la liste déroulante pour l'assigner au moment du post
  let formData = {
    image: FichierPourLePost,
    title: workTitle,
    category: categorie,
  };
  const data = new FormData();
  data.append("title", workTitle);
  data.append("image", FichierPourLePost);
  data.append("category", categorie);
  let token = window.localStorage.getItem("JWT_TOKEN");
  console.log(formData);
  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then(async (response) => {
      // Quand je reçois réponse, stocke dans variable : response
      //la reponse reçue = variable response

      if (response.ok) {
        let work = await response.json();
        console.log(work.id);
        console.log("works ajouté");
        let data = { id: work.id, title: workTitle, imageUrl: work.imageUrl }; //ceci est un json qu'on a crées afin d'alimenter setFigure et setMin
        setFigure(data);
        setminiImage(data);
        document.getElementById("modalCreatework").style.display = "none";
      }
      return response.json(); //La derniere chose retournée on la stock dans la variable qui suit le then suivant
      //aussi le .json permet de récuperer les données json qui accompagne la réponse
    })
    .catch((error) => {
      console.log("erreur dans la requete post");
    });
}

const option = document.createElement("option");

function setOption(data) {
  const option = document.createElement("option");
  option.innerHTML = `${data.name}`;
  option.value = `${data.id}`;
  option.id = `${data.id}`; // pour mettre une option avec l'id
  // .Name ici vaut dire categories
  document.getElementById("selectcategories").append(option);
}

//Fonction delete

function deleteWork(id) {
  fetch("http://localhost:5678/api/works/" + `${id}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response);
    if (response.ok) {
      document.getElementById("mini-" + `${id}`).remove();
      document.getElementById("figure-" + `${id}`).remove();
    }
  });
  element.remove(id);
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

//mh zh FormData

//Comprendre le fo,nctionnement de la creation dynamique d'un nouveau Works a l'aide de Setfigure
//essayer de le reproduire,

//Relire le code !!!!
