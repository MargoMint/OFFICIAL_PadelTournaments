const myForm = document.querySelector('form'),
    mainButton = document.querySelector('#btn'),
    mainInput = document.querySelector('#mainInput'),
    allPlayers = document.querySelector('.players'),
    modal = document.querySelector('.main__modal'),
    closeBtn = document.querySelector('.close'),
    listOfPlayers = document.querySelector('.players__display-none'),
    maxClicks = 8;
let startClicks = 0;
let overflow = null;

function checkInput() {
    let isFilled = true;
    if (mainInput.value.trim() === '') {
        isFilled = false;
    }
    mainButton.disabled = !isFilled || startClicks > maxClicks;
};

let playersArray = [];
let matches = [];
let rounds = [[], [], [], [], [], [], []];

mainButton.addEventListener('click', (event)=> {
    event.preventDefault();
    
    if (startClicks < maxClicks) {
        listOfPlayers.style.display = 'block';
        const player = document.createElement('li');
        player.classList.add('players__item');
        const playerNumber = document.createElement('span');
        playerNumber.innerText = startClicks + 1;
        player.appendChild(playerNumber);
        const playerName = document.createTextNode(mainInput.value);
        player.appendChild(playerName);
        allPlayers.appendChild(player);
        
        playersArray.push({
            id: startClicks + 1,
            name: mainInput.value,
            matchesPlayed: 0,
            opponents: new Set() // Множество для хранения оппонентов
        });
        
        mainInput.value = '';
    }
    startClicks++;
    if (startClicks === maxClicks) {
        const generateMatchScheduleBtn = document.createElement('button');
        generateMatchScheduleBtn.classList.add('generate-match-schedule');
        generateMatchScheduleBtn.innerText = 'Сгенерировать расписание матчей';
        document.body.appendChild(generateMatchScheduleBtn);

        generateMatchScheduleBtn.addEventListener('click', ()=> {
            generateSchedule();
            displaySchedule();
            if (!overflow) {
                overflow = document.createElement('div');
                overflow.classList.add('overflow');
                document.body.appendChild(overflow);
            }
            overflow.style.display = 'block';
            listOfPlayers.style.display = 'none';
            generateMatchScheduleBtn.style.display = 'none';
        });
        
    }
    if (startClicks > maxClicks) {
        mainButton.disabled = true;
        myForm.style.zIndex = -1;
        mainInput.value = '';
        if (!overflow) {
            overflow = document.createElement('div');
            overflow.classList.add('overflow');
            document.body.appendChild(overflow);
        }
        overflow.style.display = 'block';
        modal.style.display = 'block';
    }
    
    checkInput();
});
mainInput.addEventListener('input', checkInput);

function generateSchedule() {
    for (let i = 0; i < playersArray.length; i++) {
            for (let j = i + 1; j < playersArray.length; j++) {
                matches.push({ player1: playersArray[i], player2: playersArray[j] });
            };
        };
    // Распределяем пары по раундам
    for (let match of matches) {
        let player1 = match.player1;
        let player2 = match.player2;
        // Пытаемся добавить матч в один из раундов
        for (let round of rounds) {
            const player1HasPlayedThisRound = round.some(m => m.player1.id === player1.id || m.player2.id === player1.id);
            const player2HasPlayedThisRound = round.some(m => m.player1.id === player2.id || m.player2.id === player2.id);
            // Оба игрока должны быть свободны в этом раунде
            if (!player1HasPlayedThisRound && !player2HasPlayedThisRound
                && player1.matchesPlayed < 7 && player2.matchesPlayed < 7
                && !player1.opponents.has(player2.id) && !player2.opponents.has(player1.id)) {
                    round.push(match);
                    // Обновляем количество сыгранных матчей и добавляем в список оппонентов
                    player1.matchesPlayed++;
                    player2.matchesPlayed++;
                    player1.opponents.add(player2.id);
                    player2.opponents.add(player1.id);
                    break;
                }
        }
    }
}

//функция для составления расписания
function displaySchedule() {
    const scheduleContainer = document.createElement('div');
    scheduleContainer.classList.add('schedule__container');
    document.body.appendChild(scheduleContainer);

    rounds.forEach((round, i) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        
        const roundTitle = document.createElement('h3');
        roundTitle.classList.add('round__title');
        roundTitle.innerText = `Round ${i + 1}`;
        roundDiv.appendChild(roundTitle);

        const matchesList = document.createElement('ul');
        matchesList.classList.add('matches__list');

        const closeMatchesListBtn = document.createElement('img');
        closeMatchesListBtn.classList.add('close');
        closeMatchesListBtn.src = '../icons/close.png';
        closeMatchesListBtn.style.marginTop = '5px';
        closeMatchesListBtn.style.marginRight = '5px';
        roundDiv.appendChild(closeMatchesListBtn);

        closeMatchesListBtn.addEventListener('click', ()=> {
            scheduleContainer.style.display = 'none';
            overflow.style.display = 'none';
            location.reload(); //чтобы полностью обновить страницу,чтобы можно было повторно ввести участников
        });

        let roundMatches = []; // Массив для хранения текущих матчей в раунде
        round.forEach(match => {
            roundMatches.push(`${match.player1.name} и ${match.player2.name}`);
        });

        for (let i = 0; i < roundMatches.length; i += 2) {
            const matchItem = document.createElement('li');
            matchItem.classList.add('match__item');
            matchItem.innerText = `${roundMatches[i]} VS ${roundMatches[i + 1]}`;
            matchesList.appendChild(matchItem);
        }

        roundDiv.appendChild(matchesList);
        scheduleContainer.appendChild(roundDiv);
        
    });
};










//закрытие модального окна, когда введено максимальное количество участников
closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    myForm.style.zIndex = 1;
    if (overflow) {
        overflow.style.display = 'none';
    }
});





