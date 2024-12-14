import { from } from "rxjs";
import { ITeamInfo } from "../interfaces/teamInfo.interface";
import { IPoints } from "../interfaces/points.interface";
import { MongoTeamInfo, validateMongoTeamInfo } from "../models/mongoTeamInfo.model";
import { MongoPoints, validateMongoPoints } from "../models/mongoPoints.model";
import { MongoUser } from "../models/mongoUser.model";
import { MongoGames, validateMongoGames } from "../models/mongoGame.model";

function fetchData(url: string) {
  return from(fetch(url).then(response => response.json()));
}


function generateEmptyTeamInfo(listTeamsInfo:ITeamInfo[], nameOfTeam:string) {
  if(!listTeamsInfo.some((team) => team.teamName === nameOfTeam)) {
    const newMongoTeam =  new MongoTeamInfo(
      {
        teamName:nameOfTeam,
        homeWins:0,
        homeLosts:0,
        awayWins:0,
        awayLosts:0
      }
    );
    listTeamsInfo.push(newMongoTeam);
  }
}

function generateEmptyPoints(listPointsMongo:IPoints[], listOfTeamNames:string[]) {
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
}

function addWinsAndLossTeamInfo(listTeamsInfo:ITeamInfo[], game:any) {
  if(game.home_points > game.away_points) {
    const winningTeam = listTeamsInfo.find(team => team.teamName === game.home.name);
    const losingTeam = listTeamsInfo.find(team => team.teamName === game.away.name);
    if(winningTeam) {
      winningTeam.homeWins += 1;
    }
    if(losingTeam) {
      losingTeam.awayLosts +=1;
    }
  } else {
    const winningTeam = listTeamsInfo.find(team => team.teamName === game.away.name);
    const losingTeam = listTeamsInfo.find(team => team.teamName === game.home.name);
    if(winningTeam) {
      winningTeam.awayWins += 1;
    }
    if(losingTeam) {
      losingTeam.homeLosts +=1;
    }
  }
}



export function fetchAllData(urlGamesId: string) {
  MongoPoints.collection.drop();
  MongoTeamInfo.collection.drop();
  MongoGames.collection.drop();

  fetchData(urlGamesId).subscribe({
    next(data) {

      let listGames: any[] = data.games || [];
      let listTeamsInfo:ITeamInfo[] = [];
      let listPointsMongo:IPoints[] = [];

      listGames.forEach((game) => {

        const nameOfHomeTeam = game.home.name;
        const nameOfAwayTeam = game.away.name;
        generateEmptyTeamInfo(listTeamsInfo, nameOfHomeTeam);
        generateEmptyTeamInfo(listTeamsInfo, nameOfAwayTeam);
        addWinsAndLossTeamInfo(listTeamsInfo, game);

        
        const listOfTeamNames: string[] = [nameOfHomeTeam, nameOfAwayTeam];
        const unsortedList:string[] = listOfTeamNames;
        listOfTeamNames.sort((a, b) => a.localeCompare(b));
        let needsInversion = false;
        if(unsortedList == listOfTeamNames) {
          needsInversion = false;
        } else {
          needsInversion = true;
        }

        generateEmptyPoints(listPointsMongo, listOfTeamNames);

        const mongoPointsToModify = listPointsMongo.find((points) => points.team1Name === listOfTeamNames[0] && points.team2Name === listOfTeamNames[1]);
        if(mongoPointsToModify) {
          if(!needsInversion){

            mongoPointsToModify.team1Points += game.home_points;
            mongoPointsToModify.team2Points += game.away_points;
            mongoPointsToModify.numberOfPlayedGames += 1
            
          } else  {

            mongoPointsToModify.team1Points += game.away_points;
            mongoPointsToModify.team2Points += game.home_points;
            mongoPointsToModify.numberOfPlayedGames += 1

          }
        }
        //Games

        if(validateMongoGames({
          homeTeamName: game.home.name,
          homePoints: game.home_points,
          awayTeamName: game.away.name,
          awayPoints: game.away_points,
          scheduled: game.scheduled
        })) {
          const newGame = new MongoGames(
            {
              homeTeamName:game.home.name, 
              homePoints:game.home_points, 
              awayTeamName:game.away.name, 
              awayPoints:game.away_points,
              scheduled: game.scheduled
            }).save()
            console.log(newGame);
        }
      });

      //console.log(listTeamsScore.toString());

      listTeamsInfo.forEach(teamInfo => {
        if(validateMongoTeamInfo(teamInfo)) {
          new MongoTeamInfo(teamInfo).save()
        }
      });
      listPointsMongo.sort((mongoPoints1, mongoPoints2) => mongoPoints1.team1Name.localeCompare(mongoPoints2.team1Name));


      listPointsMongo.forEach(points => {
        if(validateMongoPoints(points)) {
          new MongoPoints(points).save()
        }

      });
      //console.log(listTeamsScore.toString());


    },
    error(err) {
      console.error('Erreur:', err);
    },
    complete() {
      console.log('all ids fetched complétée');

    }
  });


}

//fetchAllData(urlSchedule);
