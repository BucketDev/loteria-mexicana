import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { LandingModule } from './components/landing/landing.module';

import { PhotoPipe } from './pipes/photo.pipe';

import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { BoardModule } from './components/board/board.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    SharedModule,
    LandingModule,
    BoardModule
  ],
  declarations: [
    AppComponent,
    PhotoPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
