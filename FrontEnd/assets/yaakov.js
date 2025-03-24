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

// coder c'est comme etre un chef d'orchestre, pas besoin de savoir exactement comment jouer chaque instrument,
//il suffit de les comprendre pour les harmoniser

//----------------------------------------------------------------------------------
//                              _Mode Admin_

// Ici je veut faire en sorte que le site détecte si l'admin est connecté ou pas

function adminMode() {
  let token = window.localStorage.getItem("JWT_TOKEN");
  if (token) {
    // document.querySelector(".js-modal-2").style.display = "block"; // ceci est un exemple, block ne "bloque pas l'affichage il l'active le mode "bloc"
    console.log("Mode Admin activé");
  } else {
    // document.querySelector(".js-modal-2").style.display = "none"; // sinon tu bloque
    console.log("Mode Invité");
  }
}

adminMode();

// modale

// Get the modal
let modal = document.getElementById("myModal");

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

let modalSend = document.getElementById("modalSend");
let ajouterPhoto = document.getElementById("ajouterPhoto");

ajouterPhoto.onclick = function () {
  modalSend.style.display = "block";
  modal.style.display = "none";
};

console.log(modal);
console.log(btn, "le bouton marche");
console.log(span);
console.log("Test: ", modal);

// ajout de photo

function imageModal() {
  console.log("ImageModal Lancé");
  let dataWorks = window.localStorage.getItem("works");
  setminiImage(dataWorks);
}

function setminiImage(work) {
  console.log("setminiImage Lancé ");
  const div = document.createElement("div");
  div.innerHTML = `<img src =${work.imageUrl} alt${work.title}> 
				<figcaption>${work.title}</figcaption>`;

  document.getElementById("content").appendChild(div);
}

function setFigure(data) {
  //8 Je suis une fonction qui reçois les données et les convertis en html

  const figure = document.createElement("figure"); //9 je crée un element HTML du nom de Figure

  figure.innerHTML = `<img src =${data.imageUrl} alt${data.title}> 
				<figcaption>${data.title}</figcaption>`; //10 j'insere le titre et l'image dans les bonnes balises

  document.querySelector(".gallery").append(figure);
  //11 J'ajoute tout cela dans la balises html nommée Gallery
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
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",authorization: `Bearer ${token}`",
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
      // Affichage du message d'erreur dans l'élément #errorMessage
      document.getElementById("errorMessage").textContent = error.message;
      document.getElementById("errorMessage").style.color = "red"; // Optionnel : mettre le texte en rouge
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
// inserer le token dadns les headers de createWorks, la variable token a la ligne 218

//Travailler sur l'esthethique de la modale
//Travailler sru l'envoi de la requete de creation de works
