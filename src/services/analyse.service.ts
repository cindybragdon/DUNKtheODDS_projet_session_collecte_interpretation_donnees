
import { MongoGameService } from './game.service';
import { exec } from 'child_process';
import fs from 'fs'


const runPython = (data : string, script : string, titre : string) : Promise<any> =>{

    return new Promise((resolve, reject) => {
        const pythonProcess = exec(script, { timeout: 30000 });


        pythonProcess.stdin?.write(data);
        pythonProcess.stdin?.end();

        pythonProcess.stdout?.on('data', (stdout) => {
            try {
                const results = JSON.parse(stdout);
                
                fs.writeFileSync(`./analyse/${titre}.json`,JSON.stringify(results,null,2), "utf-8")
                return results;
            } catch (e) {
                console.error('Erreur:', e);
            }
        });

        pythonProcess.stderr?.on('data', (stderr) => {
            console.error(`stderr: ${stderr}`);
        });

        pythonProcess.on('error', (error) => {
            console.error(`exec error: ${error}`);
        });
        

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
            }
        });

    })
}

export class AnalyseService{
public static async detectionAberrantesHomeTeamPourToutesLesTeams(){
    try { 
        const TitreAnalyse = "Détection abérrantes de toute les teams à la maison"
        console.log(TitreAnalyse);
        const games = await MongoGameService.getAllGames();
        const homePoints = games.map((game: any) => game.homePoints);
        const data = JSON.stringify(homePoints);
        console.log(data);

        const pythonScript = 'python3 script/Aberrantes.py';
       
         runPython(data,pythonScript, TitreAnalyse);
        


    } catch (error) {
        console.error('Error durant execution:', error);
    }
};

public static async detectionAberrantesAwayTeamPourToutesLesTeams(){
    try {
        const TitreAnalyse = "Détection abérrantes de toute les teams hors maison"
        console.log(TitreAnalyse);
        const games = await MongoGameService.getAllGames();
        const awayPoints = games.map((game: any) => game.awayPoints);
        const data = JSON.stringify(awayPoints);
         

        const pythonScript = 'python3 script/Aberrantes.py';

        runPython(data,pythonScript, TitreAnalyse);
    } catch (error) {
        console.error('Error durnat execution:', error);
    }
};
public static async moyennePointHomeParTeam(){
    try{ 
        const TitreAnalyse = "Moyenne de point marqué par chaque team à la maison"
        console.log(TitreAnalyse);
        const games = await MongoGameService.getAllGames();
        const HomeTeamGame: any = Array.from(new Set(games.map((game: any) => `${game.homeTeamName}:${game.homePoints}`))).map((item: string) => {const [team, points] = item.split(':');return { TeamName: team, Points: Number(points) };});
        const data = JSON.stringify(HomeTeamGame);
       


        const pythonScript = 'python3 script/pointsMoyen.py';
        runPython(data,pythonScript, TitreAnalyse);
    } catch (error) {
    console.error('Error durant execution:', error);
    }
}
public static async moyennePointAwayParTeam(){
    try{const TitreAnalyse = "Moyenne de point marqué par chaque team hors maison"
        console.log(TitreAnalyse);
        const games = await MongoGameService.getAllGames();
        const awayTeamGame: any = Array.from(new Set(games.map((game: any) => `${game.awayTeamName}:${game.awayPoints}`))).map((item: string) => {const [team, points] = item.split(':');return { TeamName: team, Points: Number(points) };});
        const data = JSON.stringify(awayTeamGame);
        
       
        const pythonScript = 'python3 script/pointsMoyen.py';
        runPython(data,pythonScript, TitreAnalyse);
    } catch (error) {
    console.error('Error durant execution:', error);
    }
}


}