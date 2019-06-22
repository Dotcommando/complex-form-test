import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pages
import { AppComponent } from './app.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';

// Material
import { MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// Guards
import { SubmittedOnlyGuard } from './guards/submitted-only.guard';

@NgModule({
  declarations: [
    AppComponent,
    FormPageComponent,
    ResultPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [SubmittedOnlyGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
