// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les données du localStorage ou les initialiser si elles n'existent pas
    let equipes = JSON.parse(localStorage.getItem('equipesB')) || [];
    let matchs = JSON.parse(localStorage.getItem('matchsB')) || [];
    let classement = JSON.parse(localStorage.getItem('classementB')) || {};
    let historiqueMatchs = new Set(JSON.parse(localStorage.getItem('historiqueMatchsB')) || []);
    let maxTours = JSON.parse(localStorage.getItem('tours_max')) -1;
    let tours = JSON.parse(localStorage.getItem('toursB')) || [];
    let currenttour = JSON.parse(localStorage.getItem('currenttourB')) || 0;
    

    // Fonction pour sauvegarder une variable dans le localStorage
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Fonction pour récupérer une variable depuis le localStorage
    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Fonction pour vider le localStorage
    function clearLocalStorage() {
        localStorage.clear();
    }

    // Fonction pour initialiser le classement des équipes
    function initialiserClassement() {
        equipes.forEach(equipe => {
            if (!classement[equipe]) {
                classement[equipe] = { points: 0, joues: 0, gagnes: 0, nuls: 0, perdus: 0 };
            }
        });
        saveToLocalStorage('classementB', classement);
    }

    // Fonction pour afficher les équipes
    function afficherEquipes() {
        const listeEquipes = document.getElementById('equipeForm');
        listeEquipes.innerHTML = '';
        equipes.forEach(equipe => {
            const li = document.createElement('li');
            li.textContent = equipe;
            listeEquipes.appendChild(li);
        });
    }

    // Charger les équipes existantes au démarrage
    afficherEquipes();
    initialiserClassement(); // Appel pour initialiser les données du classement

    // Générer les matchs en tours automatiquement lorsque la page est chargée
    if (tours.length === 0) {
        tours = genererMatchs();
        saveToLocalStorage('toursB', tours);
    }

    // Afficher les matchs directement si des matchs sont présents dans la variable 'tours'
    if (tours.length > 0) {
        afficherMatchs();
    }

    // Fonction pour générer les matchs pour chaque tour
    function genererMatchs() {
        const tours = [];
        let equipesRestantes = [...equipes]; // Copier les équipes pour manipulation
        let nombreToursGeneres = 0; // Compteur de tours générés

        // Générer les matchs pour chaque tour jusqu'à atteindre le nombre maximum de tours ou jusqu'à ce qu'il soit impossible de générer de nouveaux matchs
        while (equipesRestantes.length > 1 && nombreToursGeneres < maxTours) {
            const tour = [];
            const equipesUtilisees = new Set(); // Suivi des équipes déjà utilisées dans ce tour

            // Parcourir toutes les paires d'équipes possibles pour générer des matchs
            for (let i = 0; i < equipesRestantes.length; i++) {
                for (let j = i + 1; j < equipesRestantes.length; j++) {
                    const equipe1 = equipesRestantes[i];
                    const equipe2 = equipesRestantes[j];
                    const matchID = `${equipe1} vs ${equipe2}`;

                    // Vérifier si le match n'a pas encore été joué et si les équipes ne sont pas encore dans ce tour
                    if (!historiqueMatchs.has(matchID) && !equipesUtilisees.has(equipe1) && !equipesUtilisees.has(equipe2)) {
                        tour.push({ equipe1, equipe2 });
                        equipesUtilisees.add(equipe1);
                        equipesUtilisees.add(equipe2);
                        historiqueMatchs.add(matchID); // Ajouter le match à l'historique
                        saveToLocalStorage('historiqueMatchsB', Array.from(historiqueMatchs));
                        break; // Sortir de la boucle après avoir trouvé une paire valide
                    }
                }
            }

            // Supprimer les équipes utilisées de la liste des équipes restantes pour ce tour
            equipesRestantes = equipesRestantes.filter(equipe => !equipesUtilisees.has(equipe));

            // Ajouter le tour à la liste des tours si des matchs ont été générés pour ce tour
            if (tour.length > 0) {
                tours.push(tour);
                nombreToursGeneres++; // Incrémenter le compteur de tours générés
            } else {
                break; // Si aucun match n'a pu être généré, on arrête
            }
        }

        return tours;
    }


    function afficherMatchs() {
        const listeMatchs = document.getElementById('matchs');
        const selectMatch = document.getElementById('match');
        listeMatchs.innerHTML = '';
        selectMatch.innerHTML = '<option value="">Sélectionnez un match</option>';

        // Vérifier si des matchs sont disponibles pour le tour actuel
        if (tours[0] && tours[0].length > 0) {
            const tourTitle = document.createElement('h3');
            tourTitle.textContent = `Tour ${currenttour + 1}`;
            listeMatchs.appendChild(tourTitle);

            // Parcourir les matchs du tour actuel et les afficher
            tours[0].forEach((match, matchIndex) => {
                const li = document.createElement('li');
                li.textContent = `${match.equipe1} vs ${match.equipe2}`;
                listeMatchs.appendChild(li);

                const option = document.createElement('option');
                option.value = `${currenttour}-${matchIndex}`;
                option.textContent = `${match.equipe1} vs ${match.equipe2}`;
                selectMatch.appendChild(option);
            });
        } else {
            // Vérifier si tous les tours sont terminés
            if (currenttour >= maxTours) {
                afficherClassement();
                
            } else {
                // Générer de nouveaux matchs si la liste des matchs est vide et si le tour actuel est inférieur à maxTours
                if (currenttour < maxTours) {
                    tours = genererMatchs();
                    saveToLocalStorage('toursB', tours);
                    currenttour += 1; // Incrémenter le tour actuel
                    saveToLocalStorage('currenttourB', currenttour);
                    console.log("Tour actuel à augmenté de 1 : ", currenttour); // Ajouter un log pour vérifier la valeur de currenttour
                    afficherMatchs(); // Afficher les matchs une fois générés
                }
            }
        }
    }



        // Soumettre le résultat du match
        // Soumettre le résultat du match
    document.getElementById('resultatsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const indexMatch = document.getElementById('match').value;
        if (!indexMatch) return;

        const [tourIndex, matchIndex] = indexMatch.split('-').map(Number);
        const match = tours && tours[0] && tours[0][matchIndex];
        const resultat = document.getElementById('gagnant').value;

        // Vérifier que le match est défini
        if (!match) {
            alert("Veuillez sélectionner un match valide.");
            return;
        }

        // Vérifier que le résultat est valide
        if (resultat !== match.equipe1 && resultat !== match.equipe2 && resultat !== 'draw') {
            alert("Veuillez sélectionner un gagnant valide ou un match nul.");
            return;
        }

        // Vérifier que les équipes existent dans le classement
        if (!classement[match.equipe1] || !classement[match.equipe2]) {
            console.error(`Une ou plusieurs équipes ne sont pas présentes dans le classement : ${match.equipe1}, ${match.equipe2}`);
            alert("Erreur : certaines équipes ne sont pas définies dans le classement.");
            return;
        }

        // Traitement des résultats
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

        tours[0].splice(matchIndex, 1); // Supprimer le match joué
        saveToLocalStorage('toursB', tours);

        saveToLocalStorage('classementB', classement); // Sauvegarder le classement mis à jour

        afficherMatchs(); // Actualiser l'affichage des matchs
        console.log("Classement mis à jour : ", document.getElementById('match').value); // Vérifier la mise à jour du classement
    });


    // Afficher les options de sélection de gagnant
document.getElementById('match').addEventListener('change', function() {
    const indexMatch = document.getElementById('match').value;
    if (!indexMatch) return;

    const [tourIndex, matchIndex] = indexMatch.split('-').map(Number);
    const match = tours && tours[0] && tours[0][matchIndex];
    console.log(indexMatch)
    const selectGagnant = document.getElementById('gagnant');
    selectGagnant.innerHTML = '';

    // Ajouter les options de sélection de gagnant pour le match sélectionné
    if (match) {
        const option1 = document.createElement('option');
        option1.value = match.equipe1;
        option1.textContent = match.equipe1;
        selectGagnant.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = match.equipe2;
        option2.textContent = match.equipe2;
        selectGagnant.appendChild(option2);

        const optionDraw = document.createElement('option');
        optionDraw.value = 'draw';
        optionDraw.textContent = 'Match nul';
        selectGagnant.appendChild(optionDraw);
    }
});


    function quelle_etape() {
        let etape = JSON.parse(localStorage.getItem('etape')) || 0;
        let vu = JSON.parse(localStorage.getItem('B')) || 0;
        if (etape === 2 && vu==0) {
        window.location.href = '../elim/elim.html';
        } else {
            if (vu==0){
            etape++;
            vu++;
            localStorage.setItem('etape', JSON.stringify(etape));
            localStorage.setItem('B', JSON.stringify(vu));
            }
        }
    }
  

    // Fonction pour afficher le classement
    function afficherClassement() {
        const classementListe = document.getElementById('classement');
        classementListe.innerHTML = '';
        const equipesClassees = Object.keys(classement).sort((a, b) => classement[b].points - classement[a].points);

        // Calculer le nombre d'équipes dans la moitié supérieure
        const moitieSuperieure = Math.ceil(equipesClassees.length / 2);
        const vainqueurs = equipesClassees.slice(0, moitieSuperieure);

        
        quelle_etape();

        // Enregistrer la moitié supérieure dans le localStorage
        localStorage.setItem('vainqueursB', JSON.stringify(vainqueurs));

        // Afficher le classement
        equipesClassees.forEach(equipe => {
            const li = document.createElement('li');
            li.textContent = `${equipe}: ${classement[equipe].points} points (Gagnés: ${classement[equipe].gagnes}, Nuls: ${classement[equipe].nuls}, Perdus: ${classement[equipe].perdus}, Joués: ${classement[equipe].joues})`;
            classementListe.appendChild(li);
        });
    }
});
