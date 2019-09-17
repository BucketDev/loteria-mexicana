import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'uriStyleSanitizer'
})
export class UriStyleSanitizerPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}

  transform(uri: string, shadow: boolean = false): any {
    return shadow ?
      this.domSanitizer.bypassSecurityTrustStyle(`linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(47, 53, 66,1.0)), url(${uri})`) :
      this.domSanitizer.bypassSecurityTrustStyle(`url(${uri})`);

  }

}
