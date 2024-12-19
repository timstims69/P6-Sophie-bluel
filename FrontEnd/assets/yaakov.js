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

    const json = await response.json(); // 3 Les données reçues du serveur est  converti en JSON,
    // la propriétée response représente la reponse du serv ensuite, .json coverti en json
    // aussi await ici veut idre que j'attend la réponse du serveur avant de la process

    console.log(json); // 4 J'affiche les données dans la console, pour que je puisse les voir perso

    for (let i = 0; i < json.length; i++) {
      //5 Si y'a plusieur éléments dans les données, je boucle et donc les select 1 à 1

      setFigure(json[i]); //6 Pour chaque element j'applique la fonction Setfigure,
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

async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // Bon url ?
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

getCategories();
function setFilter(data) {
  const divContainer = document.createElement("div");

  const div = document.createElement("div");
  div.innerHTML = `${data.name}`;

  document.querySelector(".div-container").append(div);
}
