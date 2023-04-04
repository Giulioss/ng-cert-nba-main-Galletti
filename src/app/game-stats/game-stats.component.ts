import {Component, OnDestroy, OnInit} from '@angular/core';
import {Team} from '../data.models';
import {NbaService} from '../nba.service';
import {Division, divisions} from "../divisions.model";
import {conferences} from "../conferences.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

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
  destroy = new Subject();

  constructor(protected nbaService: NbaService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.nbaService.getAllTeams().pipe(
      takeUntil(this.destroy)
    ).subscribe(data => {
      this.allTeams = [...data]

      const trackedTeams = this.nbaService.getTrackedTeams();
      this.filteredTeams = data.filter(team => !trackedTeams.some(trackedTeam => trackedTeam.id === team.id));
      this.orderTeamsByName();

      this.initForm();
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }

  private initForm() {
    this.teamForm = this.fb.group({
      conferenceSelect: [conferences[0].code],
      divisionSelect: [''],
      teamSelect: [this.allTeams[0].id],
    });

    this.teamForm.get('conferenceSelect')?.valueChanges.subscribe(conferenceCode => {
      if (conferenceCode === 'default') {
        this.divisions = [];
        this.filteredTeams = [...this.allTeams];
        this.orderTeamsByName();
        return;
      }

      this.divisions = divisions.filter(division => division.conferenceCode === conferenceCode);
      this.filteredTeams = this.allTeams.filter(team => team.conference === conferenceCode);
      this.orderTeamsByName();
    });

    this.teamForm.get('divisionSelect')?.valueChanges.subscribe(divisionCode => {
      this.filteredTeams = this.filteredTeams.filter(team => team.division === divisionCode);
      this.orderTeamsByName();
    });
  }

  trackTeam(): void {
    const teamId = this.teamForm.get('teamSelect')?.value;
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team) {
      this.nbaService.addTrackedTeam(team);
      this.filteredTeams = this.filteredTeams.filter(team => team.id !== Number(teamId));
      this.teamForm.get('teamSelect').setValue(this.filteredTeams[0]?.id);
      this.orderTeamsByName();
    }
  }

  addTeamRemoved(idTeam: number) {
    const team = this.allTeams.find(team => team.id === idTeam);
    if (team) {
      this.filteredTeams.push(team);
      this.orderTeamsByName();
    }
  }

  private orderTeamsByName() {
    this.filteredTeams = this.filteredTeams.sort((a, b) => a.full_name.localeCompare(b.full_name));
  }
}
