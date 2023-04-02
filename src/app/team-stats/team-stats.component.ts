import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';
import {statsDays} from "../stats-days.model";

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit, AfterViewInit {

  @Input() team!: Team;

  allGames!: Game[];
  stats!: Stats;
  statsDays = statsDays;
  showRemoveModal = false;

  @ViewChild('statsDaysSelect', {static: true}) statsDaysSelect!: ElementRef;

  constructor(protected nbaService: NbaService) { }

  ngOnInit(): void {
    this.nbaService.getLastResults(this.team, 3).pipe(
      tap(games => {
        this.allGames = games;
        this.stats = this.nbaService.getStatsFromGames(games, this.team);
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    /*fromEvent(this.statsDaysSelect.nativeElement, 'change').subscribe(data => {
      console.log(data);
    });*/
  }

  statsDaysChange(daysSelected: string) {
    const days: number = +daysSelected;
    this.nbaService.getLastResults(this.team, days).pipe(
      tap(games =>  this.stats = this.nbaService.getStatsFromGames(games, this.team))
    ).subscribe();
  }

  closeModal() {
    this.showRemoveModal = false;
  }

  confirmTeamRemoval(team: Team) {
    this.showRemoveModal = false;
    this.nbaService.removeTrackedTeam(team);
  }

}
