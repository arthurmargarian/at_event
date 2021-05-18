import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { GlobalVarsService } from '../../../global-vars.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { UserModel } from '../../../infratructure/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('signInModal') public signInModal: ModalDirective;
  public currentUser: UserInterface;
  public signedUser: UserInterface;
  public isLoading: boolean;
  public canFollow: boolean;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public isEditMode: boolean;
  public form: FormGroup;
  public submitted: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private toastr: ToastrService,
              private titleService: Title,
              private userProfileService: UserProfileService,
              private globalVarsService: GlobalVarsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.initForm();
    this.getUserIdFromRoute();
    this.getSignedUserFromService();
    this.getCurrentUserFormService();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      contactNumber: [null, [Validators.required]],
      contactEmail: [null, [Validators.required, EmailValidator]],
    });
  }

  private getUserIdFromRoute(): void {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        const userId = +params['id'];
        if (userId) {
          this.isLoading = true;
          this.getUserById(userId);
        }
      });
  }

  private getUserById(userId: number): void {
    this.userService.getUserById(userId)
      .subscribe(res => {
        if (res.model) {
          this.currentUser = res.model;
          this.isLoading = false;
          this.titleService.setTitle(`At Event | ${this.currentUser.fullName}`);
          this.userProfileService.currentUser.next(this.currentUser);
          if (this.signedUser) {
            this.patchForm(this.currentUser);
            this.checkFollow();
          } else {
            this.canFollow = true;
          }
        }
      });
  }

  private getSignedUserFromService() {
    this.globalVarsService.signedInUser
      .subscribe(user => {
        this.signedUser = user;
        this.patchForm(this.signedUser);
      });
  }

  public onFollowClick(): void {
    if (this.signedUser) {
      this.followToUser(this.signedUser.id, this.currentUser.id);
    } else {
      this.signInModal.show();
    }
  }

  public onUnFollowClick(): void {
    this.unFollowToUser(this.signedUser.id, this.currentUser.id);
  }

  public onHideSignInModal(): void {
    this.signInModal.hide();
  }

  private showNotificationMessage(key: string, params?: object): void {
    this.translateService.get(key, params)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }

  public followToUser(followerId: number, followingId: number): void {
    this.userService.followToUser(followerId, followingId)
      .subscribe(res => {
        if (res) {
          this.showNotificationMessage('NOTIFY_MESSAGES.follow', {value: this.currentUser.fullName});
          this.updateView();
        }
      });
  }

  public unFollowToUser(followerId: number, followingId: number): void {
    this.userService.unFollowToUser(followerId, followingId)
      .subscribe(res => {
        if (res) {
          this.showNotificationMessage('NOTIFY_MESSAGES.unfollow', {value: this.currentUser.fullName});
          this.updateView();
        }
      });
  }

  private updateView(): void {
    this.getUserById(this.currentUser.id);
  }

  private checkFollow(): void {
    const isFollow = this.currentUser.followerIds.find(id => id === this.signedUser.id);
    this.canFollow = !isFollow;
  }

  private getCurrentUserFormService() {
    this.userProfileService.currentUser
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
        }
      });
  }

  public onEditClick(): void {
    this.isEditMode = true;
  }


  private patchForm(user: UserModel) {
    this.form.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber: +user.contactNumber,
      contactEmail: user.contactEmail
    });
  }

  private updateUserInfo(model: UserModel) {
    this.userService.updateUserInfo(model)
      .subscribe(res => {
        if (res.model) {
          this.submitted = false;
          this.isEditMode = false;
          this.showNotificationMessage('NOTIFY_MESSAGES.profile_info_updated');
          this.getUserById(this.signedUser.id);
        }
      });
  }

  onCancelClick() {
    this.isEditMode = false;
  }

  onSaveClick() {
    this.submitted = true;
    if (this.form.valid) {
      const model = new UserModel(this.signedUser.id);
      const values = this.form.value;
      model.firstName = values.firstName;
      model.lastName = values.lastName;
      model.contactNumber = values.contactNumber;
      model.contactEmail = values.contactEmail;
      this.updateUserInfo(model);
    }
  }
}
