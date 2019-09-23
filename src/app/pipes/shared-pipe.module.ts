import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UriStyleSanitizerPipe } from './uri-style-sanitizer.pipe';

@NgModule({
  imports: [
    CommonModule
  ], declarations: [
    UriStyleSanitizerPipe
  ], exports: [
    UriStyleSanitizerPipe
  ]
})
export class SharedPipeModule { }
