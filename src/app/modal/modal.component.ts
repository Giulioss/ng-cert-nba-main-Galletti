import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ModalService} from "../modal.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class ModalComponent implements OnInit {

  @Input() identifier = '';
  display$: Observable<{identifier: string, open: boolean}>;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.display$ = this.modalService.watch();
  }

  close(identifier: string) {
    this.modalService.close(identifier);
  }

}
