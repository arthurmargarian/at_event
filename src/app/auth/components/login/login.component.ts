import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { AuthService } from '../../auth-service.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private titleService: Title,
              private authService: AuthService) {
  }

  public form: FormGroup;
  public submitted: boolean;

  ngOnInit() {
    this.titleService.setTitle('Sign In');
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, EmailValidator.validate]],
      password: [null, [Validators.required]]
    });
  }

  public signInSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
