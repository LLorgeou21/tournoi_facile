// On attend que la page soit chargée avant de démarrer
document.addEventListener('DOMContentLoaded', function() {
    const equipeForm = document.getElementById('equipeForm');
    const nomEquipeInput = document.getElementById('nomEquipe');
    const listeEquipesContainer = document.getElementById('listeEquipes');
    const matchSelect = document.getElementById('match');
    const gagnantSelect = document.getElementById('gagnant');
    const genererMatchsButton = document.getElementById('genererMatchs');
    const matchsContainer = document.getElementById('matchs');
    const resultatsForm = document.getElementById('resultatsForm');

    let equipes = []; // Liste pour stocker les équipes ajoutées
    let matchs = []; // Liste pour stocker les matchs générés

    // Fonction pour mettre à jour la liste des équipes
    function mettreAJourEquipes() {
        if (equipes.length === 0) {
            listeEquipesContainer.innerHTML = "<p>Aucune équipe n'a encore été ajoutée</p>";
        } else {
            let html = '<ul>';
            equipes.forEach(equipe => {
                html += `<li>${equipe}</li>`;
            });
            html += '</ul>';
            listeEquipesContainer.innerHTML = html;
        }
    }

    // Fonction pour mettre à jour la liste des matchs et des sélections
    function mettreAJourSelections() {
        // Réinitialise les options des sélections
        matchSelect.innerHTML = '<option value="">Sélectionnez un match</option>';
        gagnantSelect.innerHTML = '<option value="">Sélectionnez un gagnant</option>';

        matchs.forEach((match, index) => {
            // Ajout des matchs dans la sélection
            const optionMatch = document.createElement('option');
            optionMatch.value = index; // On utilise l'index pour retrouver facilement le match
            optionMatch.textContent = `Match ${index + 1} : ${match[0]} vs ${match[1]}`;
            matchSelect.appendChild(optionMatch);
        });

        // Mettre à jour l'affichage des matchs
        matchsContainer.innerHTML = '';
        let html = '<ul>';
        matchs.forEach((match, index) => {
            html += `<li>Match ${index + 1} : ${match[0]} vs ${match[1]}</li>`;
        });
        html += '</ul>';
        matchsContainer.innerHTML = html;
    }

    // Fonction pour mélanger les équipes et créer des paires
    function genererMatchs() {
        // Réinitialise l'affichage des matchs et la liste des matchs
        matchsContainer.innerHTML = '';
        matchs = [];

        if (equipes.length < 2) {
            matchsContainer.innerHTML = '<p>Pas assez d\'équipes pour générer des matchs</p>';
            return;
        }

        let equipesMelangees = [...equipes]; // Copie des équipes
        equipesMelangees.sort(() => Math.random() - 0.5); // Mélange les équipes

        for (let i = 0; i < equipesMelangees.length; i += 2) {
            const equipe1 = equipesMelangees[i];
            const equipe2 = equipesMelangees[i + 1] || 'Exempt'; // Si nombre impair, l'équipe est exemptée
            matchs.push([equipe1, equipe2]); // On enregistre le match
        }

        // Met à jour les sélections des matchs et des gagnants
        mettreAJourSelections();
    }

    // Fonction pour retirer une équipe de la liste
    function retirerEquipe(equipe) {
        equipes = equipes.filter(e => e !== equipe); // Supprime l'équipe de la liste
        mettreAJourEquipes(); // Met à jour l'affichage des équipes
    }

    // Fonction pour retirer un match de la liste
    function retirerMatch(matchIndex) {
        matchs.splice(matchIndex, 1); // Supprime le match de la liste
        mettreAJourSelections(); // Met à jour les sélections des matchs
    }

    // Fonction pour vérifier si un nouveau tour doit être généré ou annoncer le gagnant
    function verifierFinDeTour() {
        if (equipes.length === 1) {
            alert(`Le tournoi est terminé ! Le gagnant est ${equipes[0]} !`);

            // Vider toutes les listes et réinitialiser l'affichage
            equipes = [];
            matchs = [];
            mettreAJourEquipes();
            mettreAJourSelections();
            matchsContainer.innerHTML = "<p>Le tournoi est terminé. Le gagnant a été annoncé.</p>";
        } else if (matchs.length === 0 && equipes.length > 1) {
            alert('Tous les matchs de ce tour ont été joués. Nouveau tour généré !');
            genererMatchs();
        }
    }

    // Lorsque l'utilisateur sélectionne un match, on affiche les équipes correspondantes dans le sélecteur du gagnant
    matchSelect.addEventListener('change', function() {
        const matchIndex = matchSelect.value;
        if (matchIndex !== "") {
            const match = matchs[matchIndex];

            // Remplit la liste des gagnants avec les équipes du match sélectionné
            gagnantSelect.innerHTML = '';
            match.forEach(equipe => {
                const option = document.createElement('option');
                option.value = equipe;
                option.textContent = equipe;
                gagnantSelect.appendChild(option);
            });
        } else {
            gagnantSelect.innerHTML = '<option value="">Sélectionnez un gagnant</option>';
        }
    });

    // Gestionnaire d'événements pour l'ajout d'équipe
    equipeForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire

        const nomEquipe = nomEquipeInput.value.trim();
        if (nomEquipe !== '') {
            equipes.push(nomEquipe); // Ajoute l'équipe à la liste
            nomEquipeInput.value = ''; // Réinitialise le champ de saisie

            mettreAJourEquipes(); // Met à jour l'affichage des équipes
        }
    });

    // Gestionnaire d'événements pour générer les matchs
    genererMatchsButton.addEventListener('click', genererMatchs);

    // Gestionnaire d'événements pour soumettre le résultat d'un match
    resultatsForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire

        const matchIndex = matchSelect.value;
        const gagnant = gagnantSelect.value;

        if (matchIndex !== "" && gagnant !== "") {
            const match = matchs[matchIndex];
            const perdant = match.find(equipe => equipe !== gagnant);

            // Retire l'équipe perdante de la liste
            retirerEquipe(perdant);

            // Retire le match terminé de la liste
            retirerMatch(matchIndex);

            // Vérifie si un nouveau tour doit être généré ou s'il y a un gagnant
            verifierFinDeTour();
        }
    });
});
