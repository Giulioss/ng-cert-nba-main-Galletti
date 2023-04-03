import {Component, Input, OnInit} from '@angular/core';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';
import {statsDays} from "../stats-days.model";

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {

  @Input() team!: Team;

  allGames!: Game[];
  stats!: Stats;
  statsDays = statsDays;
  showRemoveModal = false;
  selectedDays: number = 3;

  constructor(protected nbaService: NbaService) { }

  ngOnInit(): void {
    this.nbaService.getLastResults(this.team, 3).subscribe((games) => {
      this.allGames = games;
      this.stats = this.nbaService.getStatsFromGames(games, this.team);
    });
  }

  statsDaysChange() {
    this.nbaService.getLastResults(this.team, this.selectedDays).subscribe((games) => {
      this.stats = this.nbaService.getStatsFromGames(games, this.team);
    });
  }

  closeModal() {
    this.showRemoveModal = false;
  }

  confirmTeamRemoval(team: Team) {
    this.showRemoveModal = false;
    this.nbaService.removeTrackedTeam(team);
  }

}
