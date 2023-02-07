import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringLengthExceedPipe'
})
export class StringLengthExceedPipePipe implements PipeTransform {

  transform(name: string, maxlengh: number) {

    return (name.length > maxlengh) ? name.slice(0,maxlengh-3) + '..' : name;
  }

}
