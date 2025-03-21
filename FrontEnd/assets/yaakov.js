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
    console.log(works); // Vérification des données // 3 Les données reçues du serveur est  converti en JSON,
    // la propriétée response représente la reponse du serv ensuite, .json coverti en json
    // aussi await ici veut idre que j'attend la réponse du serveur avant de la process

    console.log(); // 4 J'affiche les données dans la console, pour que je puisse les voir perso

    for (let i = 0; i < works.length; i++) {
      //5 Si y'a plusieur éléments dans les données, je boucle et donc les select 1 à 1

      setFigure(works[i]); //6 Pour chaque element j'applique la fonction Setfigure,
      // aussi le travail json lui est passé en parametre (décrite à L23)
    }
  } catch (error) {
    console.error(error.message); //7 En cas de blem' je t'affiche un message d'erreure, catch car "attrape" si tu choppe un blem
  }
}

getWorks(); // J'appelle la fonction getWorks L1 ce qui fait que : X

function setFigure(data) {
  //8 Je suis une fonction qui reçois les données et les convertis en html

  const figure = document.createElement("figure"); //9 je crée un element HTML du nom de Figure

  figure.innerHTML = `<img src =${data.imageUrl} alt${data.title}> 
				<figcaption>${data.title}</figcaption>`; //10 j'insere le titre et l'image dans les bonnes balises

  document.querySelector(".gallery").append(figure); //11 J'ajoute tout cela dans la balises html nommée Gallery
}

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
    }
  } catch (error) {
    console.error(error.message);
  }
}

getCategories();

// coder c'est comme etre un chef d'orchestre, pas besoin de savoir exactement comment jouer chaque instrument,
//il suffit de les comprendre pour les harmoniser

//----------------------------------------------------------------------------------
//                              _Mode Admin_

// Ici je veut faire en sorte que le site détecte si l'admin est connecté ou pas

function adminMode() {
  let token = window.localStorage.getItem("JWT_TOKEN");
  if (token) {
    // document.querySelector(".js-modal-2").style.display = "block"; // ceci est un exemple, block ne "bloque pas l'affichage il l'active le mode "bloc"
    console.log("salut l'admin, bienvenue a la maison");
  } else {
    // document.querySelector(".js-modal-2").style.display = "none"; // sinon tu bloque
    console.log("T'est qui toi ?");
  }
}

adminMode();

// modale

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("potatosalad");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
console.log(modal);
console.log(btn, "le bouton marche");
console.log(span);
console.log("Test: ", modal);

// ajout de photo

let ajouterPhoto = document.getElementById("ajouterPhoto");

// sert a enlever le token du local storage
// sinon il reste lealmé almaya
function logout() {
  localStorage.removeItem("JWT_TOKEN");
}

// Affichage photo dans la modal lors de l'ouverture:

// Creation d'une fonction qui va récupérer les works qui va te retourner une listes des elements
function miniImages() {
  let content = getElementById("content");
  fetch("http://localhost:5678/api-docs/#/default/get_works", {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("utilisateur Non Reconnu");
      }
      return response.json(); //return necessaire quand utilise une {}
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log("Erreur dans la récupération des mini images");
    });
  console.log(data, "ya zebi");
}

miniImages();
works.forEach((element) => createElement("miniPhoto"));
// this.appendChild("content");

// Pour chaque "work" création d'un child component qui sera ajouter à la div "content" afin d'afficher l'image
// utiliser une boucle forEach pour effectuer l'action sur chaque images
// Teapot — Today at 7:46 PM
// liste_image.forEach((image) =>console.log(image));
// à la place de console.log tu devras ajouter une image à la dive "content" (appendChild)

// je localise oû inserer les images en html, XFaitX
// j'en fais une variable  XFaitX   c'est la variable content
// je fait descendre les works, XFait ? X
// je leur met une class html, (sans ça pas de carré image il me semble,puis aussi cela donnera la taille voulue)
// j'appendChild les images works dans la variable (2 eme étape)

// petites étapes et petites tranches de temps correspondantes
// noter les avancements
