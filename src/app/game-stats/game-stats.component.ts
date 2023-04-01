import { Component } from '@angular/core';
import {Team} from '../data.models';
import {NbaService} from '../nba.service';
import {Division, divisions} from "../divisions.model";
import {conferences} from "../conferences.model";

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

  constructor(protected nbaService: NbaService) {
    this.nbaService.getAllTeams().subscribe({
      next: data => {
        this.allTeams = data
        this.filteredTeams = data;
      }
    });
  }

  filterDivisions(conferenceCode: string) {
    if (conferenceCode === 'default') {
      this.divisions = [];
      this.filteredTeams = this.allTeams;
      return;
    }

    this.divisions = divisions.filter(division => division.conferenceCode === conferenceCode);
    this.filteredTeams = this.allTeams.filter(team => team.conference === conferenceCode);
  }

  filterTeams(divisionCode: string) {
    this.filteredTeams = this.allTeams.filter(team => team.division === divisionCode);
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team)
      this.nbaService.addTrackedTeam(team);
  }
}
