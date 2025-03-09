function login() {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);

  userData = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("utilisateur Non Reconnu");
      }
      return response.json(); //return necessaire quand utilise une {}
    })
    .then((data) => {
      console.log(data.token);
      window.localStorage.setItem("JWT_TOKEN", data.token);
    })
    .catch((error) => console.log("Erreur :", error));
}

// window.localStorage.getItem(key); pour acces le token
// https://www.w3schools.com/howto/howto_css_modals.asp
