/* ==========================================================================
   LE BAOBAB — script.js
   Script unique, partagé par toutes les pages.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- GALERIE : modale dynamique (galerie.html) ---- */
  const galerieImages = document.querySelectorAll("#galerieGrid img");
  const modalGalerieEl = document.getElementById("modalGalerie");

  if (galerieImages.length > 0 && modalGalerieEl) {
    const modalGalerie = new bootstrap.Modal(modalGalerieEl);
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");

    galerieImages.forEach(function (img) {
      img.addEventListener("click", function () {
        modalImage.src = img.getAttribute("src");
        modalImage.alt = img.getAttribute("alt");
        modalCaption.textContent = img.getAttribute("data-caption");
        modalGalerie.show();
      });
    });
  }

  /* ---- FORMULAIRE DE CONTACT : validation (contact.html) ---- */
  const formContact = document.getElementById("formContact");

  if (formContact) {
    const champNom = document.getElementById("nom");
    const champEmail = document.getElementById("email");
    const champMessage = document.getElementById("message");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const listeMessages = document.getElementById("listeMessages");

    const errNom = document.getElementById("errNom");
    const errEmail = document.getElementById("errEmail");
    const errMessage = document.getElementById("errMessage");

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validerNom() {
      const valide = champNom.value.trim().length >= 3;
      champNom.classList.toggle("is-invalid", !valide);
      errNom.classList.toggle("show", !valide);
      return valide;
    }
    function validerEmail() {
      const valide = regexEmail.test(champEmail.value.trim());
      champEmail.classList.toggle("is-invalid", !valide);
      errEmail.classList.toggle("show", !valide);
      return valide;
    }
    function validerMessage() {
      const valide = champMessage.value.trim().length >= 10;
      champMessage.classList.toggle("is-invalid", !valide);
      errMessage.classList.toggle("show", !valide);
      return valide;
    }

    champNom.addEventListener("input", validerNom);
    champEmail.addEventListener("input", validerEmail);
    champMessage.addEventListener("input", validerMessage);

    function chargerHistorique() {
      const messages = JSON.parse(localStorage.getItem("baobabMessages") || "[]");
      listeMessages.innerHTML = "";
      messages.forEach(function (m) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${m.date} — ${m.nom} (${m.sujet}) : ${m.message}`;
        listeMessages.appendChild(li);
      });
    }

    function enregistrerMessage(nom, sujet, message) {
      const messages = JSON.parse(localStorage.getItem("baobabMessages") || "[]");
      messages.push({ date: new Date().toLocaleString("fr-FR"), nom, sujet, message });
      localStorage.setItem("baobabMessages", JSON.stringify(messages));
      chargerHistorique();
    }

    chargerHistorique();

    formContact.addEventListener("submit", function (e) {
      e.preventDefault();
      const nomOk = validerNom();
      const emailOk = validerEmail();
      const messageOk = validerMessage();

      if (nomOk && emailOk && messageOk) {
        const sujet = document.getElementById("sujet").value;
        enregistrerMessage(champNom.value.trim(), sujet, champMessage.value.trim());
        confirmationMessage.textContent = "Votre message a bien été envoyé. Nous vous répondrons rapidement.";
        confirmationMessage.style.display = "block";
        formContact.reset();
        [champNom, champEmail, champMessage].forEach(c => c.classList.remove("is-invalid"));
        [errNom, errEmail, errMessage].forEach(e => e.classList.remove("show"));
      } else {
        confirmationMessage.style.display = "none";
      }
    });
  }

});
