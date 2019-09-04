import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsModalComponent } from '@app/shared/tags-modal/tags-modal.component';
import { TagsModalModule } from '@app/shared/tags-modal/tags-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';

@NgModule({
  declarations: [
    TagsComponent,
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
    FontAwesomeModule,
    TranslateModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TagsModalModule,
  ],
})
export class TagsModule {
  constructor() {
    library.add(faBars);
    library.add(faEdit);
    library.add(faTrash);
    library.add(faEye);
  }
}
