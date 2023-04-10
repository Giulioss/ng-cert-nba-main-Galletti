import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  protected statsDays$ = new BehaviorSubject<number>(6);
  constructor() {}

  get statsDays() {
    return this.statsDays$.asObservable();
  }

  changeValue(value: number) {
    this.statsDays$.next(value);
  }
}
