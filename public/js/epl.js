// require('dotenv').config();
// year
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const searchForm = document.getElementById("search-form");

// team1
const team1 = document.getElementById('team1');
const rank1 = document.getElementById('rank1');
const points1 = document.getElementById('points1');
const won1 = document.getElementById('won1');
const lose1 = document.getElementById('lose1');
const draw1 = document.getElementById('draw1');
const played1 = document.getElementById('played1');

// // team2
const team2 = document.getElementById('team2');
const rank2 = document.getElementById('rank2');
const points2 = document.getElementById('points2');
const won2 = document.getElementById('won2');
const lose2 = document.getElementById('lose2');
const draw2 = document.getElementById('draw2');
const played2 = document.getElementById('played2');

// // team3
const team3 = document.getElementById('team3');
const rank3 = document.getElementById('rank3');
const points3 = document.getElementById('points3');
const won3 = document.getElementById('won3');
const lose3 = document.getElementById('lose3');
const draw3 = document.getElementById('draw3');
const played3 = document.getElementById('played3');

const getApi = async () => {
    const season = searchBox.value;
    const url = `https://api-football-beta.p.rapidapi.com/standings?season=${season}&league=39`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': "8008fc6ce6msh111a680d5698362p1b0f3djsnfa989567897b",
            // 'X-RapidAPI-Key': "process.env.API_KEY",
            'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com'
        }
    };
    
    try {
        const res = await fetch(url, options);
        const result = await res.json();
        // console.log(result);
        const finalApi =  result.response;
        // console.log(finalApi);
        const data = finalApi[0].league;
        // console.log(data);
        const standings = data.standings;
        // console.log(standings);
        
        standings.forEach(element => {

            // visibility
            searchResult.style.visibility = "visible";

            

            // team1
            // console.log(element[0]);
            team1.innerHTML = element[0].team.name;
            rank1.innerHTML = "#" + element[0].rank;
            points1.innerHTML = element[0].points + " POINTS";
            played1.innerHTML ="PLAYED : " + element[0].all.played;
            won1.innerHTML = "WON : " + element[0].all.win;
            lose1.innerHTML = "LOST : " + element[0].all.lose;
            draw1.innerHTML = "DRAW : " + element[0].all.draw;
            document.getElementById("logo1").src = element[0].team.logo;

            // team2
            team2.innerHTML = element[1].team.name;
            rank2.innerHTML = "#" + element[1].rank;
            points2.innerHTML = element[1].points + " POINTS";
            played2.innerHTML ="PLAYED : " + element[1].all.played;
            won2.innerHTML = "WON : " + element[1].all.win;
            lose2.innerHTML = "LOST : " + element[1].all.lose;
            draw2.innerHTML = "DRAW : " + element[1].all.draw;
            document.getElementById("logo2").src = element[1].team.logo;

            // team3
            team3.innerHTML = element[2].team.name;
            rank3.innerHTML = "#" + element[2].rank;
            points3.innerHTML = element[2].points + " POINTS";
            played3.innerHTML ="PLAYED : " + element[2].all.played;
            won3.innerHTML = "WON : " + element[2].all.win;
            lose3.innerHTML = "LOST : " + element[2].all.lose;
            draw3.innerHTML = "DRAW : " + element[2].all.draw;
            document.getElementById("logo3").src = element[2].team.logo;
        });

        
    
    } catch (error) {
        console.error(error);
    }
}
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getApi();
  });
