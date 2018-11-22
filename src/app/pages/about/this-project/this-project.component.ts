import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'this-project',
  templateUrl: './this-project.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ThisProjectComponent {

  constructor(private router: Router) {
  }

  listPatients() {
    this.router.navigate([ '/pages/tables/patient-table/' ]);
  }

  showDesirableLevels() {
    this.router.navigate([ '/pages/tables/desirable-levels' ]);
  }
}
