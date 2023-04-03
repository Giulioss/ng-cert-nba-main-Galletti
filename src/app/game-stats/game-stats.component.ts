import { Component } from '@angular/core';
import {Team} from '../data.models';
import {NbaService} from '../nba.service';
import {Division, divisions} from "../divisions.model";
import {conferences} from "../conferences.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent {

  allTeams: Team[] = [];
  filteredTeams: Team[] = [];
  conferences = conferences;
  divisions: Division[] = [];
  teamForm!: FormGroup;

  constructor(protected nbaService: NbaService,
              private fb: FormBuilder) {

    this.nbaService.getAllTeams().subscribe({
      next: data => {
        this.allTeams = data
        this.filteredTeams = data;

        this.initForm();
      }
    });
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
        return;
      }

      this.divisions = divisions.filter(division => division.conferenceCode === conferenceCode);
      this.filteredTeams = this.allTeams.filter(team => team.conference === conferenceCode);
    });

    this.teamForm.get('divisionSelect')?.valueChanges.subscribe(divisionCode => {
      this.filteredTeams = this.filteredTeams.filter(team => team.division === divisionCode);
    });
  }

  trackTeam(): void {
    const teamId = this.teamForm.get('teamSelect')?.value;
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team) {
      this.nbaService.addTrackedTeam(team);
    }
  }
}
