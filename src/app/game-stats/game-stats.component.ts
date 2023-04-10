import {Component, OnDestroy, OnInit} from '@angular/core';
import {Team} from '../data.models';
import {NbaService} from '../nba.service';
import {Division, divisions} from "../divisions.model";
import {conferences} from "../conferences.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {statsDays} from "../stats-days.model";
import {StatsService} from "../stats.service";

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent implements OnInit, OnDestroy {

  allTeams: Team[] = [];
  filteredTeams: Team[] = [];
  conferences = conferences;
  divisions: Division[] = [];
  teamForm!: FormGroup;
  allTeamsSelectedDays: number;

  protected readonly statsDays = statsDays;

  destroy = new Subject();

  constructor(protected nbaService: NbaService,
              private statsService: StatsService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.nbaService.getAllTeams().pipe(
      takeUntil(this.destroy)
    ).subscribe(data => {
      /* Get all teams and order by full_name*/
      this.allTeams = [...data];
      this.allTeams.sort((a, b) => a.full_name.localeCompare(b.full_name));

      /* Filter teams that i'm already tracking*/
      const trackedTeams = this.nbaService.getTrackedTeams();
      this.filteredTeams = data.filter(team => !trackedTeams.some(trackedTeam => trackedTeam.id === team.id));

      this.initForm();
    });

    this.statsService.statsDays.subscribe(value => this.allTeamsSelectedDays = value);
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }

  /**
   * Build Form and create valueChanges methods
   * @private
   */
  private initForm() {
    this.teamForm = this.fb.group({
      conferenceSelect: [conferences[0].code],
      divisionSelect: [''],
      teamSelect: [this.allTeams[0].id],
    });

    /* Every time I change the Conference or the Division, I calculate the correct teams to show */
    this.teamForm.get('conferenceSelect')?.valueChanges.subscribe(conferenceCode => {
      const trackedTeams = this.nbaService.getTrackedTeams();

      if (conferenceCode === 'default') {
        this.divisions = [];
        this.filteredTeams = this.allTeams.filter(team => !trackedTeams.some(trackedTeam => trackedTeam.id === team.id));
        this.teamForm.get('divisionSelect').setValue(null);
        return;
      }

      this.divisions = divisions.filter(division => division.conferenceCode === conferenceCode);
      this.filterTeamsByConferenceCode(trackedTeams, conferenceCode);
      this.teamForm.get('teamSelect').setValue(this.filteredTeams[0]?.id);
    });

    this.teamForm.get('divisionSelect')?.valueChanges.subscribe(divisionCode => {
      if (divisionCode) {
        const trackedTeams = this.nbaService.getTrackedTeams();
        this.filterTeamsByDivisionCode(trackedTeams, divisionCode);
        this.teamForm.get('teamSelect').setValue(this.filteredTeams[0]?.id);
      }
    });
  }

  changeStatsDays() {
    this.statsService.changeValue(this.allTeamsSelectedDays);
  }

  /* Track team and remove that from selectable teams */
  trackTeam(): void {
    const teamId = this.teamForm.get('teamSelect')?.value;
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team) {
      this.nbaService.addTrackedTeam(team);
      this.filteredTeams = this.filteredTeams.filter(team => team.id !== Number(teamId));
      this.teamForm.get('teamSelect').setValue(this.filteredTeams[0]?.id);
    }
  }

  /* When I remove a tracked team, I add the team to the list of teams that I can track */
  addRemovedTeam(idTeam: number) {
    const team = this.allTeams.find(team => team.id === idTeam);
    if (team) {
      /* If I select the Division, I calculate only the teams of that Division */
      const trackedTeams = this.nbaService.getTrackedTeams();
      if (this.teamForm.get('divisionSelect')?.value) {
        this.filterTeamsByDivisionCode(trackedTeams, this.teamForm.get('divisionSelect').value);
        return;
      }

      /* If I only select the Conference, I calculate only the teams of that Conference */
      if (this.teamForm.get('conferenceSelect')?.value !== 'default') {
        this.filterTeamsByConferenceCode(trackedTeams, this.teamForm.get('conferenceSelect').value);
        return;
      }

      /* If I didn't select the Division or the Conference, I add the team to the list and thant order by full_name */
      this.filteredTeams.push(team);
      this.filteredTeams.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
  }

  private filterTeamsByConferenceCode(trackedTeams: Team[], conferenceCode) {
    this.filteredTeams = this.allTeams.filter(team => !trackedTeams.some(trackedTeam => trackedTeam.id === team.id) && team.conference === conferenceCode);
  }

  private filterTeamsByDivisionCode(trackedTeams: Team[], divisionCode) {
    this.filteredTeams = this.allTeams.filter(team => !trackedTeams.some(trackedTeam => trackedTeam.id === team.id) && team.division === divisionCode);
  }
}
