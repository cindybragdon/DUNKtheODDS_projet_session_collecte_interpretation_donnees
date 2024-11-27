import { from } from "rxjs";
import { config } from "../config/config";
import { MongoPoints, MongoTeamScore } from "./databaseMongo";
import { ITeamScore } from "../interfaces/teamScore.interface";
import { IPoints } from "../interfaces/points.interface";



const api_key = "P2IWsEF0Qk70Io2LKTMd5yhrGSzoWWKYK2esg3Vh"

//Used to fetch all games
const urlSchedule = `https://api.sportradar.com/nba/trial/v8/en/games/2024/REG/schedule.json?api_key=${api_key}`

/*
const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};
*/

function fetchData(url: string) {
  return from(fetch(url).then(response => response.json()));
}


function generateEmptyTeamScore(listTeamsScore:ITeamScore[], nameOfTeam:string) {
  if(!listTeamsScore.some((team) => team.teamName === nameOfTeam)) {
    const newMongoTeam =  new MongoTeamScore(
      {
        teamName:nameOfTeam,
        homeWins:0,
        homeLosts:0,
        awayWins:0,
        awayLosts:0
      }
    );
    listTeamsScore.push(newMongoTeam);
  }
}

function addWinsAndLossTeamScore(listTeamsScore:ITeamScore[], game:any) {
  if(game.home_points > game.away_points) {
    const winningTeam = listTeamsScore.find(team => team.teamName === game.home.name);
    const losingTeam = listTeamsScore.find(team => team.teamName === game.away.name);
    if(winningTeam) {
      winningTeam.homeWins += 1;
    }
    if(losingTeam) {
      losingTeam.awayLosts +=1;
    }
  } else {
    const winningTeam = listTeamsScore.find(team => team.teamName === game.away.name);
    const losingTeam = listTeamsScore.find(team => team.teamName === game.home.name);
    if(winningTeam) {
      winningTeam.awayWins += 1;
    }
    if(losingTeam) {
      losingTeam.homeLosts +=1;
    }
  }
}
function createNewTeamScore(nameOfTeam:string) {

}



export function fetchAllData (urlGamesId: string) {


  fetchData(urlGamesId).subscribe({
    next(data) {

      let listGames: any[] = data.games || [];
      let listTeamsScore:ITeamScore[] = [];
      let listPointsMongo:IPoints[] = [];

      listGames.forEach((game) => {

        const nameOfHomeTeam = game.home.name;
        const nameOfAwayTeam = game.away.name;
        generateEmptyTeamScore(listTeamsScore, nameOfHomeTeam);
        generateEmptyTeamScore(listTeamsScore, nameOfAwayTeam);
        addWinsAndLossTeamScore(listTeamsScore, game);

        
        const listOfTeamNames: string[] = [nameOfHomeTeam, nameOfAwayTeam];
        const unsortedList:string[] = listOfTeamNames;
        listOfTeamNames.sort((a, b) => a.localeCompare(b));
        let needsInversion = false;
        if(unsortedList == listOfTeamNames) {
          needsInversion = false;
        } else {
          needsInversion = true;
        }

        if(!listPointsMongo.some((points) => points.team1Name === listOfTeamNames[0] && points.team2Name === listOfTeamNames[1])) {
          const newMongoPoints =  new MongoPoints(
            {
              team1Name:listOfTeamNames[0],
              team2Name:listOfTeamNames[1],
              team1Points:0,
              team2Points:0,
              pointsDifference:0,
              numberOfPlayedGames:0
            }
          );
          listPointsMongo.push(newMongoPoints);
        }
        const mongoPointsToModify = listPointsMongo.find((points) => points.team1Name === listOfTeamNames[0] && points.team2Name === listOfTeamNames[1]);
        if(mongoPointsToModify) {
          if(!needsInversion){

            mongoPointsToModify.team1Points += game.home_points;
            mongoPointsToModify.team2Points += game.away_points;
            mongoPointsToModify.pointsDifference += game.home_points - game.away_points;
            mongoPointsToModify.numberOfPlayedGames += 1
            
          } else  {

            mongoPointsToModify.team1Points += game.away_points;
            mongoPointsToModify.team2Points += game.home_points;
            mongoPointsToModify.pointsDifference += game.away_points - game.home_points;
            mongoPointsToModify.numberOfPlayedGames += 1

          }
        }




      });

      //console.log(listTeamsScore.toString());
      listPointsMongo.sort((mongoPoints1, mongoPoints2) => mongoPoints1.team1Name.localeCompare(mongoPoints2.team1Name));
      console.log(listPointsMongo.toString());


    },
    error(err) {
      console.error('Erreur:', err);
    },
    complete() {
      console.log('all ids fetched complétée');

    }
  });


}

fetchAllData(urlSchedule);
