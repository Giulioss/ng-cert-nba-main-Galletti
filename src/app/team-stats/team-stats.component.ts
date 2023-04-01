import {Component, Input, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {

  @Input() team!: Team;

  games$!: Observable<Game[]>;
  stats!: Stats;
  showRemoveModal = false;
  constructor(protected nbaService: NbaService) { }

  ngOnInit(): void {
    this.games$ = this.nbaService.getLastResults(this.team, 12).pipe(
      tap(games =>  this.stats = this.nbaService.getStatsFromGames(games, this.team))
    )
  }

  closeModal() {
    this.showRemoveModal = false;
  }

  confirmTeamRemoval(team: Team) {
    this.showRemoveModal = false;
    this.nbaService.removeTrackedTeam(team);
  }

}
