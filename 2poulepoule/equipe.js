// Fonction pour ajouter une équipe à la Poule A
document.getElementById('ajouter-equipe-A').addEventListener('click', function() {
    const equipeInputA = document.getElementById('equipe-input-A');
    const equipeA = equipeInputA.value.trim();
    if (equipeA) {
        let equipesA = JSON.parse(localStorage.getItem('equipesA')) || [];
        equipesA.push(equipeA);
        localStorage.setItem('equipesA', JSON.stringify(equipesA));
        equipeInputA.value = ''; // Effacer l'input
        chargerEquipes(); // Mettre à jour la liste
    }
});

// Fonction pour ajouter une équipe à la Poule B
document.getElementById('ajouter-equipe-B').addEventListener('click', function() {
    const equipeInputB = document.getElementById('equipe-input-B');
    const equipeB = equipeInputB.value.trim();
    if (equipeB) {
        let equipesB = JSON.parse(localStorage.getItem('equipesB')) || [];
        equipesB.push(equipeB);
        localStorage.setItem('equipesB', JSON.stringify(equipesB));
        equipeInputB.value = ''; // Effacer l'input
        chargerEquipes(); // Mettre à jour la liste
    }
});

// Fonction pour retirer la dernière équipe ajoutée à la Poule A
document.getElementById('retirer-equipe-A').addEventListener('click', function() {
    let equipesA = JSON.parse(localStorage.getItem('equipesA')) || [];
    equipesA.pop(); // Retirer la dernière équipe
    localStorage.setItem('equipesA', JSON.stringify(equipesA));
    chargerEquipes(); // Mettre à jour la liste
});

// Fonction pour retirer la dernière équipe ajoutée à la Poule B
document.getElementById('retirer-equipe-B').addEventListener('click', function() {
    let equipesB = JSON.parse(localStorage.getItem('equipesB')) || [];
    equipesB.pop(); // Retirer la dernière équipe
    localStorage.setItem('equipesB', JSON.stringify(equipesB));
    chargerEquipes(); // Mettre à jour la liste
});

// Fonction pour charger les équipes
function chargerEquipes() {
    // Chargement des équipes de la Poule A
    const equipesA = JSON.parse(localStorage.getItem('equipesA')) || [];
    const listeEquipesA = document.getElementById('liste-equipes-A');
    listeEquipesA.innerHTML = ''; // Effacer la liste actuelle
    equipesA.forEach(equipe => {
        const li = document.createElement('li');
        li.textContent = equipe; // Créer un élément de liste pour chaque équipe
        listeEquipesA.appendChild(li); // Ajouter à la liste
    });

    // Chargement des équipes de la Poule B
    const equipesB = JSON.parse(localStorage.getItem('equipesB')) || [];
    const listeEquipesB = document.getElementById('liste-equipes-B');
    listeEquipesB.innerHTML = ''; // Effacer la liste actuelle
    equipesB.forEach(equipe => {
        const li = document.createElement('li');
        li.textContent = equipe; // Créer un élément de liste pour chaque équipe
        listeEquipesB.appendChild(li); // Ajouter à la liste
    });
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', chargerEquipes);



// Fonction pour aller à la page du tournoi pour la Poule A
document.getElementById('go-to-tournament-A').addEventListener('click', function() {
    window.location.href = 'A/index.html'; // Rediriger vers elimA.html pour la Poule A
    localStorage.removeItem('classement'); // Supprimer les équipes de la Poule A
});

// Fonction pour aller à la page du tournoi pour la Poule B
document.getElementById('go-to-tournament-B').addEventListener('click', function() {
    window.location.href = 'B/index.html'; // Rediriger vers elimB.html pour la Poule B
    localStorage.removeItem('classement'); // Supprimer les équipes de la Poule A
});
