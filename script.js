let equipes = [];
let matchs = [];
let classement = {};
let historiqueMatchs = new Set();  // Pour garder une trace des matchs déjà joués
let maxTours = 0;  // Nombre maximum de tours
let tours = [];  // Déclaration de la variable tours pour stocker les matchs générés
let currenttour=0;


// Ajouter une équipe
document.getElementById('equipeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nomEquipe = document.getElementById('nomEquipe').value.trim();  // Suppression des espaces vides
    if (nomEquipe && !equipes.includes(nomEquipe)) {  // Vérifier si l'équipe n'existe pas déjà
        equipes.push(nomEquipe);
        classement[nomEquipe] = { points: 0, joues: 0, gagnes: 0, perdus: 0, nuls: 0 }; // Initialiser le classement
        afficherEquipes();
        document.getElementById('nomEquipe').value = '';
    } else {
        alert("L'équipe existe déjà ou le nom est vide.");
    }
});

// Afficher les équipes
function afficherEquipes() {
    const listeEquipes = document.getElementById('listeEquipes');
    listeEquipes.innerHTML = '';
    equipes.forEach(equipe => {
        const li = document.createElement('li');
        li.textContent = equipe;
        listeEquipes.appendChild(li);
    });
}

// Configurer le nombre maximum de tours
document.getElementById('maxToursForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombreTours = parseInt(document.getElementById('nombreTours').value, 10);
    if (!isNaN(nombreTours) && nombreTours > 0) {
        maxTours = nombreTours;
    } else {
        alert("Veuillez entrer un nombre valide de tours.");
        maxTours = 0;  // Réinitialiser si l'entrée est invalide
    }
});

// Générer les matchs en tours
document.getElementById('genererMatchs').addEventListener('click', function() {
    if (maxTours === 0) {
        alert("Veuillez définir le nombre maximum de tours avant de générer les matchs.");
        return;
    }
    tours = genererToursMatchs();
    afficherMatchs();  // Afficher les matchs une fois générés
});

// Générer les matchs pour chaque tour
function genererToursMatchs() {
    const tours = [];
    let equipesRestantes = [...equipes];  // Copier les équipes pour manipulation
    let nombreToursGeneres = 0;  // Compteur de tours générés

    while (equipesRestantes.length > 1 && nombreToursGeneres < maxTours) {
        const tour = [];
        const equipesUtilisees = new Set();  // Suivi des équipes déjà utilisées dans ce tour

        for (let i = 0; i < equipesRestantes.length; i++) {
            for (let j = i + 1; j < equipesRestantes.length; j++) {
                const equipe1 = equipesRestantes[i];
                const equipe2 = equipesRestantes[j];
                const matchID = `${equipe1} vs ${equipe2}`;

                // Vérifiez si le match n'a pas encore été joué et les équipes ne sont pas encore dans ce tour
                if (!historiqueMatchs.has(matchID) && !equipesUtilisees.has(equipe1) && !equipesUtilisees.has(equipe2)) {
                    tour.push({ equipe1, equipe2 });
                    equipesUtilisees.add(equipe1);
                    equipesUtilisees.add(equipe2);
                    historiqueMatchs.add(matchID);  // Ajouter le match à l'historique
                    break;  // Sortir de la boucle après avoir trouvé une paire valide
                }
            }
        }

        // Supprimer les équipes utilisées de la liste des équipes restantes pour ce tour
        equipesRestantes = equipesRestantes.filter(equipe => !equipesUtilisees.has(equipe));

        if (tour.length > 0) {
            tours.push(tour);  // Ajouter le tour à la liste des tours
            nombreToursGeneres++;  // Incrémenter le compteur de tours générés
        } else {
            break;  // Si aucun match n'a pu être généré, on arrête
        }

        // Réinitialiser les équipes restantes pour le prochain tour
        equipesRestantes = [...equipes];
    }

    return tours;
}

// Afficher les matchs par tours (uniquement le premier tour avec des matchs restants)
function afficherMatchs() {
    const listeMatchs = document.getElementById('matchs');
    const selectMatch = document.getElementById('match');
    listeMatchs.innerHTML = '';
    selectMatch.innerHTML = '<option value="">Sélectionnez un match</option>';

    // Trouver le premier tour qui a encore des matchs restants
    const premierTourAvecMatchs = tours.findIndex(tour => tour.length > 0);

    if (premierTourAvecMatchs !== -1) {
        const tour = tours[premierTourAvecMatchs];  // Prendre ce tour

        // Afficher les matchs de ce tour
        const tourTitle = document.createElement('h3');
        tourTitle.textContent = `Tour ${premierTourAvecMatchs + 1 + currenttour}`;
        listeMatchs.appendChild(tourTitle);

        tour.forEach((match, matchIndex) => {
            const li = document.createElement('li');
            li.textContent = `${match.equipe1} vs ${match.equipe2}`;
            listeMatchs.appendChild(li);

            const option = document.createElement('option');
            option.value = `${premierTourAvecMatchs}-${matchIndex}`;  // Indexer le tour et le match
            option.textContent = `${match.equipe1} vs ${match.equipe2}`;
            selectMatch.appendChild(option);
        });
    } else {
        // Si tous les tours sont terminés
        const noMatch = document.createElement('p');
        noMatch.textContent = 'Tous les matchs ont été joués';
        currenttour=0;
        listeMatchs.appendChild(noMatch);
    }
}

// Soumettre le résultat du match
document.getElementById('resultatsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const indexMatch = document.getElementById('match').value;
    if (!indexMatch) return;

    const [tourIndex, matchIndex] = indexMatch.split('-').map(Number);  // Récupérer le tour et le match

    const match = tours[tourIndex][matchIndex];
    const resultat = document.getElementById('gagnant').value;

    if (resultat === 'draw') {
        classement[match.equipe1].points += 1;
        classement[match.equipe2].points += 1;
        classement[match.equipe1].nuls += 1;
        classement[match.equipe2].nuls += 1;
    } else {
        classement[resultat].points += 3;
        if (resultat === match.equipe1) {
            classement[match.equipe2].perdus += 1;
            classement[match.equipe1].gagnes += 1;
        } else {
            classement[match.equipe1].perdus += 1;
            classement[match.equipe2].gagnes += 1;
        }
    }

    classement[match.equipe1].joues += 1;
    classement[match.equipe2].joues += 1;

    // Retirer le match joué du tour
    tours[tourIndex].splice(matchIndex, 1);

    // Si le tour est vide, le supprimer
    if (tours[tourIndex].length === 0) {
        tours.splice(tourIndex, 1);
        currenttour=currenttour+1;
        afficherClassement();
    }

    // Réafficher les matchs restants
    afficherMatchs();
    afficherClassement();  // Mettre à jour le classement

    // Réinitialiser la sélection du match et du gagnant
    document.getElementById('match').value = '';
    document.getElementById('gagnant').innerHTML = '<option value="">Sélectionnez un gagnant</option>';
});

// Afficher les options de sélection de gagnant lorsqu'un match est sélectionné
document.getElementById('match').addEventListener('change', function() {
    const indexMatch = document.getElementById('match').value;
    if (!indexMatch) return;  // Si aucun match n'est sélectionné, arrêter

    const [tourIndex, matchIndex] = indexMatch.split('-').map(Number);  // Récupérer tourIndex et matchIndex
    const match = tours[tourIndex][matchIndex];  // Obtenir le match à partir des tours

    const selectGagnant = document.getElementById('gagnant');
    selectGagnant.innerHTML = ''; // Réinitialiser la liste des gagnants

    if (match) {
        // Ajouter les deux équipes comme options de gagnant
        const option1 = document.createElement('option');
        option1.value = match.equipe1;
        option1.textContent = match.equipe1;

        const option2 = document.createElement('option');
        option2.value = match.equipe2;
        option2.textContent = match.equipe2;

        const optionDraw = document.createElement('option');
        optionDraw.value = 'draw';
        optionDraw.textContent = 'Match nul';

        selectGagnant.appendChild(option1);
        selectGagnant.appendChild(option2);
        selectGagnant.appendChild(optionDraw);
    }
});

// Afficher le classement
function afficherClassement() {
    if (currenttour == maxTours) {
        // Enregistrer le classement dans le local storage avant de rediriger
        localStorage.setItem('classement', JSON.stringify(classement));

        // Rediriger vers la page de classement
        window.location.href = 'classement/classement.html';
    }
}

