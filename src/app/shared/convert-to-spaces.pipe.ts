import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToSpaces',
})
export class ConvertToSpacesPipe implements PipeTransform {
  transform (value: string, character: string, symbolDisplay: string): string {
    // symbolDisplay reference: https://github.com/angular/angular/blob/master/packages/common/test/pipes/number_pipe_spec.ts
    // symbolDisplay is any of "code, symbol, symbol-narrow"
    return value.replace(character, ' ');
  }
}
