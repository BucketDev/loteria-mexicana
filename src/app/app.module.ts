import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedModule } from './components/shared/shared.module';
import { LandingModule } from './components/landing/landing.module';

import { PhotoPipe } from './pipes/photo.pipe';
import { UriStyleSanitizerPipe } from './pipes/uri-style-sanitizer.pipe';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotoPipe,
    UriStyleSanitizerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    SharedModule,
    LandingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
