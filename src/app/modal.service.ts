import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, Observable} from "rxjs";

/* This service control all the modals in my application, using an identifier and a boolean value to open and close the modals */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private display = new BehaviorSubject<{identifier: string, open: boolean}>({identifier: null, open: false});

  watch(identifier: string): Observable<{identifier: string, open: boolean}> {
    return this.display.asObservable().pipe(
      filter(modal => modal.identifier === identifier)
    );
  }

  open(identifier: string) {
    this.display.next({identifier: identifier, open: true});
  }

  close(identifier: string) {
    this.display.next({identifier: identifier, open: false});
  }
}
