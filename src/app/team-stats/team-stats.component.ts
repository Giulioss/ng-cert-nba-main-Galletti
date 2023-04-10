import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NbaService} from '../nba.service';
import {Stats, Team} from '../data.models';
import {statsDays} from "../stats-days.model";
import {ModalService} from "../modal.service";
import {Subject, takeUntil} from "rxjs";
import {StatsService} from "../stats.service";

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit, OnDestroy {

  @Input() team!: Team;

  @Output() onTeamRemoved = new EventEmitter();

  stats!: Stats;
  statsDays = statsDays;
  selectedDays: number = 6;
  modalIdentifier: string;
  destroy = new Subject();

  constructor(protected nbaService: NbaService,
              private statsService: StatsService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.statsDaysChange();
    this.modalIdentifier = 'modal-' + this.team.abbreviation;
    this.statsService.statsDays.subscribe(value => {
      this.selectedDays = value;
      this.statsDaysChange();
    });
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
