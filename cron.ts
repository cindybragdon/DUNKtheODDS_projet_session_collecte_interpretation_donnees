import cron from 'node-cron';
import { AnalyseService } from './src/services/analyse.service';

export const Analyse = () => {
  cron.schedule('0 0 */2 * *', () => {
    console.log("Lancement de l'analyse détection de valeurs aberrantes sur les teams à l'extérieur");
    AnalyseService.detectionAberrantesAwayTeamPourToutesLesTeams();
  });

  cron.schedule('30 0 */2 * *', () => {
    console.log("Lancement de l'analyse détection de valeurs aberrantes sur les teams à la maison");
    AnalyseService.detectionAberrantesHomeTeamPourToutesLesTeams();
  });

  cron.schedule('0 6 */2 * *', () => {
    console.log("Lancement de l'analyse moyenne de points marqués par les teams à la maison");
    AnalyseService.moyennePointHomeParTeam();
  });

  cron.schedule('30 6 */2 * *', () => {
    console.log("Lancement de l'analyse moyenne de points marqués par les teams à l'extérieur");
    AnalyseService.moyennePointAwayParTeam();
  });
  
};
