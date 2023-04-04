import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';
import {statsDays} from "../stats-days.model";
import {ModalService} from "../modal.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit, OnDestroy {

  @Input() team!: Team;

  @Output() onTeamRemoved = new EventEmitter();

  allGames!: Game[];
  stats!: Stats;
  statsDays = statsDays;
  selectedDays: number = 6;
  modalIdentifier: string;
  destroy = new Subject();

  constructor(protected nbaService: NbaService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.nbaService.getLastResults(this.team, this.selectedDays).pipe(
      takeUntil(this.destroy)
    ).subscribe((games) => {
      this.allGames = games;
      this.stats = this.nbaService.getStatsFromGames(games, this.team);
    });

    this.modalIdentifier = 'modal-' + this.team.abbreviation;
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }

  statsDaysChange() {
    this.nbaService.getLastResults(this.team, this.selectedDays).pipe(
      takeUntil(this.destroy)
    ).subscribe((games) => {
      this.stats = this.nbaService.getStatsFromGames(games, this.team);
    });
  }

  closeModal() {
    this.modalService.close(this.modalIdentifier);
  }

  confirmTeamRemoval(team: Team) {
    this.closeModal();
    this.nbaService.removeTrackedTeam(team);
    this.onTeamRemoved.emit();
  }

  openConfirmationModal() {
    this.modalService.open(this.modalIdentifier);
  }

}
