import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photo',
  pure: false
})
export class PhotoPipe implements PipeTransform {

  transform(value: string, size?: number, name?: string, type?: string): any {
    size = size || 16;
    type = type || 'cotton';
    name = name || 'empty-box'
    return value ? value : `https://png.icons8.com/${type}/${name}/${size}`
  }

}
