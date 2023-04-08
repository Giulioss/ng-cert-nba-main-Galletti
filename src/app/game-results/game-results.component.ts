import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NbaService} from '../nba.service';
import {Game, Team} from '../data.models';
import {Observable} from 'rxjs';
import {statsDays} from "../stats-days.model";

@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.css']
})
export class GameResultsComponent {

  team?: Team;
  numberOfDays = 6;
  games$?: Observable<Game[]>;
  protected readonly statsDays = statsDays;

  constructor(private activatedRoute: ActivatedRoute, private nbaService: NbaService) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
        this.team = this.nbaService.getTrackedTeams().find(team => team.abbreviation === paramMap.get("teamAbbr"));
        const numberOfDays = paramMap.get('numberOfDays');
        if (numberOfDays) {
          this.numberOfDays = +numberOfDays;
        }

        if (this.team) {
          this.getLastResults();
        }
    });
  }

  protected getLastResults() {
    this.games$ = this.nbaService.getLastResults(this.team, this.numberOfDays);
  }

}
