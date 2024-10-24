let equipesA = [];
let equipesB = [];
let matchs = [];

// Ajouter une équipe
document.getElementById("equipeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const nomEquipe = document.getElementById("nomEquipe").value;
    const poule = document.getElementById("pouleSelect").value;

    // Ajouter l'équipe à la bonne poule
    if (poule === "A") {
        equipesA.push({ nom: nomEquipe, points: 0 });
    } else {
        equipesB.push({ nom: nomEquipe, points: 0 });
    }

    // Réinitialiser le champ de saisie
    document.getElementById("nomEquipe").value = "";

    // Afficher la liste des équipes
    afficherEquipes();
});

// Afficher les équipes dans la liste
function afficherEquipes() {
    const listeEquipesA = document.getElementById("listeEquipesA");
    const listeEquipesB = document.getElementById("listeEquipesB");
    
    listeEquipesA.innerHTML = ""; // Vider la liste actuelle de la poule A
    listeEquipesB.innerHTML = ""; // Vider la liste actuelle de la poule B
    
    equipesA.forEach(equipe => {
        const li = document.createElement("li");
        li.textContent = `${equipe.nom} (Points: ${equipe.points})`;
        listeEquipesA.appendChild(li);
    });
    
    equipesB.forEach(equipe => {
        const li = document.createElement("li");
        li.textContent = `${equipe.nom} (Points: ${equipe.points})`;
        listeEquipesB.appendChild(li);
    });
}

// Générer les matchs
document.getElementById("genererMatchs").addEventListener("click", function() {
    matchs = [];
    // Générer des matchs pour la poule A
    for (let i = 0; i < equipesA.length; i++) {
        for (let j = i + 1; j < equipesA.length; j++) {
            matchs.push({ equipe1: equipesA[i], equipe2: equipesA[j], resultat: null });
        }
    }

    // Générer des matchs pour la poule B
    for (let i = 0; i < equipesB.length; i++) {
        for (let j = i + 1; j < equipesB.length; j++) {
            matchs.push({ equipe1: equipesB[i], equipe2: equipesB[j], resultat: null });
        }
    }

    // Afficher les matchs générés
    afficherMatchs();
});

// Afficher les matchs
function afficherMatchs() {
    const listeMatchs = document.getElementById("matchs");
    const matchSelect = document.getElementById("match");
    listeMatchs.innerHTML = ""; // Vider la liste actuelle
    matchSelect.innerHTML = '<option value="">Sélectionnez un match</option>'; // Réinitialiser le sélecteur

    matchs.forEach((match, index) => {
        const li = document.createElement("li");
        li.textContent = `${match.equipe1.nom} vs ${match.equipe2.nom}`;
        listeMatchs.appendChild(li);
        
        // Ajouter le match à la liste déroulante
        const option = document.createElement("option");
        option.value = index; // Utiliser l'index comme valeur
        option.textContent = `${match.equipe1.nom} vs ${match.equipe2.nom}`;
        matchSelect.appendChild(option);
    });
}

// Soumettre le résultat du match
document.getElementById("resultatsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const matchIndex = document.getElementById("match").value;

    // Vérifie si un match est sélectionné
    if (matchIndex === "") {
        alert("Veuillez sélectionner un match.");
        return;
    }

    const match = matchs[matchIndex];
    
    // Assurer que le gagnant est sélectionné avant de continuer
    const gagnantNom = document.getElementById("gagnant").value;
    
    // Mise à jour des points
    if (gagnantNom === match.equipe1.nom) {
        match.resultat = match.equipe1;
        match.equipe1.points += 3; // Gagner 3 points
        match.equipe2.points += 0; // Perdre 0 point
    } else if (gagnantNom === match.equipe2.nom) {
        match.resultat = match.equipe2;
        match.equipe2.points += 3; // Gagner 3 points
        match.equipe1.points += 0; // Perdre 0 point
    } else {
        alert("Veuillez sélectionner un gagnant.");
        return;
    }

    // Afficher le résultat
    afficherEquipes();

    // Vider la sélection de match et le gagnant
    document.getElementById("match").value = "";
    document.getElementById("gagnant").value = ""; // Réinitialiser le gagnant

    // Vérifier si tous les matchs ont été joués
    if (matchs.every(m => m.resultat !== null)) {
        genererQualifies();
    }
});

// Générer les équipes qualifiées
function genererQualifies() {
    const equipesQualifiees = [];
    
    // Ajouter les équipes qualifiées de la poule A
    const qualifA = equipesA.filter(equipe => equipe.points >= 3); // Modifiez le seuil si nécessaire
    equipesQualifiees.push(...qualifA);

    // Ajouter les équipes qualifiées de la poule B
    const qualifB = equipesB.filter(equipe => equipe.points >= 3); // Modifiez le seuil si nécessaire
    equipesQualifiees.push(...qualifB);

    // Afficher les équipes qualifiées
    const listeQualifiees = document.getElementById("equipesQualifiees");
    listeQualifiees.innerHTML = ""; // Vider la liste
    equipesQualifiees.forEach(equipe => {
        const li = document.createElement("li");
        li.textContent = `${equipe.nom} (Points: ${equipe.points})`;
        listeQualifiees.appendChild(li);
    });
}
