// On attend que la page soit chargée avant de démarrer
document.addEventListener('DOMContentLoaded', function() {
    const listeEquipesContainer = document.getElementById('equipes');
    const matchSelect = document.getElementById('matchSelect');
    const gagnantSelect = document.getElementById('gagnant');
    const genererMatchsButton = document.getElementById('genererMatchs');
    const matchsContainer = document.getElementById('listeMatchs');
    const resultatsForm = document.getElementById('soumettreResultat');

    // Définir les équipes ici
    let equipes = JSON.parse(localStorage.getItem('vainqueursA')) || [];
    equipes = equipes.concat(JSON.parse(localStorage.getItem('vainqueursB')) || []);
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
        matchSelect.innerHTML = '<option value="">Sélectionnez un match</option>';
        gagnantSelect.innerHTML = '<option value="">Sélectionnez un gagnant</option>';

        matchs.forEach((match, index) => {
            const optionMatch = document.createElement('option');
            optionMatch.value = index;
            optionMatch.textContent = `Match ${index + 1} : ${match[0]} vs ${match[1]}`;
            matchSelect.appendChild(optionMatch);
        });

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
        matchsContainer.innerHTML = '';
        matchs = [];

        if (equipes.length < 2) {
            matchsContainer.innerHTML = '<p>Pas assez d\'équipes pour générer des matchs</p>';
            return;
        }

        let equipesMelangees = [...equipes];
        equipesMelangees.sort(() => Math.random() - 0.5);

        for (let i = 0; i < equipesMelangees.length; i += 2) {
            const equipe1 = equipesMelangees[i];
            const equipe2 = equipesMelangees[i + 1] || 'Exempt';
            matchs.push([equipe1, equipe2]);
        }

        mettreAJourSelections();
    }

    // Fonction pour retirer une équipe de la liste
    function retirerEquipe(equipe) {
        equipes = equipes.filter(e => e !== equipe);
        mettreAJourEquipes();
    }

    // Fonction pour retirer un match de la liste
    function retirerMatch(matchIndex) {
        matchs.splice(matchIndex, 1);
        mettreAJourSelections();
    }

    // Fonction pour vérifier si un nouveau tour doit être généré ou annoncer le gagnant
    function verifierFinDeTour() {
        if (equipes.length === 1) {
            const grand_gagnant = equipes[0];
            localStorage.setItem('grand_gagnant', grand_gagnant);
            alert(`Le tournoi est terminé ! Le grand gagnant est ${grand_gagnant} !`);
            equipes = [];
            matchs = [];
            mettreAJourEquipes();
            mettreAJourSelections();
            matchsContainer.innerHTML = "<p>Le tournoi est terminé. Le grand gagnant a été annoncé.</p>";
            localStorage.removeItem('equipes'); // Supprimer les équipes
            window.location.href = '../gagnant/gagnant.html';
        } else if (matchs.length === 0 && equipes.length > 1) {
            alert('Tous les matchs de ce tour ont été joués. Nouveau tour généré !');
            genererMatchs();
        }
    }

    matchSelect.addEventListener('change', function() {
        const matchIndex = matchSelect.value;
        if (matchIndex !== "") {
            const match = matchs[matchIndex];
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

    genererMatchsButton.addEventListener('click', genererMatchs);

    resultatsForm.addEventListener('click', function(event) {
        const matchIndex = matchSelect.value;
        const gagnant = gagnantSelect.value;

        if (matchIndex !== "" && gagnant !== "") {
            const match = matchs[matchIndex];
            const perdant = match.find(equipe => equipe !== gagnant);
            retirerEquipe(perdant);
            retirerMatch(matchIndex);
            verifierFinDeTour();
        }
    });

    mettreAJourEquipes(); // Initialisation de l'affichage des équipes
});
