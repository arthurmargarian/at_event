import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from '../../../infratructure/models/select-option.model';
import { TranslateService } from '@ngx-translate/core';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit, OnChanges {

  @Output() hideModal: EventEmitter<any> = new EventEmitter();
  @Input() eventTypeIds: number[];
  @Input() currentUserId: number;
  public form: FormGroup;
  public eventTypes: SelectOption[];
  submitted: boolean;

  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private userService: UserService,
              private toastr: ToastrService,
              private router: Router,
              private globalVarsService: GlobalVarsService) {
  }

  ngOnInit() {
    this.getEventTypes();
  }

  ngOnChanges() {
    if (this.eventTypeIds) {
      this.initForm(this.eventTypeIds);
    }
  }

  onSaveClick() {
    this.submitted = true;
    if (this.form.valid) {
      this.userService.updateUserInterests(this.currentUserId, this.form.get('eventTypes').value)
        .subscribe(resp => {
          this.userService.getUserById(this.currentUserId).subscribe(res => {
            if (res.model) {
              this.globalVarsService.signedInUser.next(res.model);
            }
          });
          this.showNotificationMessage('NOTIFY_MESSAGES.interests');
          this.hideModal.emit();
          this.router.navigate(['events', 'for-you']);
        });
    }
  }

  private initForm(typeIds: number[]) {
    this.form = this.fb.group({
      eventTypes: [typeIds, [Validators.required]],
    });
  }

  private getEventTypes() {
    this.globalVarsService.getEventTypes()
      .subscribe(res => {
        const options = res.model.map(item => {
          let typeName = null;
          this.translateService.get(`EVENT_TYPES.${item.label}`)
            .subscribe(message => {
              typeName = message;
            });
          return new SelectOption(typeName, +item.id);
        });
        this.eventTypes = options;
      });
  }

  private showNotificationMessage(key: string): void {
    this.translateService.get(key)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }
}
