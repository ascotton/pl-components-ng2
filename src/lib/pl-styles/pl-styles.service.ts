import { Injectable } from '@angular/core';

export enum PL_COLORS {
    orange = 'orange',
    orangeDark = 'orange-dark',

    blue = 'blue',
    blueMedium = 'blue-medium',
    blueLight = 'blue-light',
    blueLighter = 'blue-lighter',
    blueLighest = 'blue-lightest',

    gray = 'gray',
    grayDarkest = 'gray-darkest',
    grayDarker = 'gray-darker',
    grayDark = 'gray-dark',
    grayLight = 'gray-light',
    grayLighter = 'gray-lighter',
    grayLighest = 'gray-lightest',

    slate = 'slate',
    slateDarkest = 'slate-darkest',
    slateDarker = 'slate-darker',
    slateDark = 'slate-dark',
    slateMedium = 'slate-medium',
    slateLight = 'slate-light',
    slateLighter = 'slate-lighter',
    slateLighest = 'slate-lightest',
}

@Injectable()
export class PLStylesService {
    colors = {
        [PL_COLORS.orange]: 'ed8000',
        [PL_COLORS.orangeDark]: 'F26724',

        [PL_COLORS.blue]: '4d8bbe',
        [PL_COLORS.blueMedium]: '46b1e1',
        [PL_COLORS.blueLight]: '85D4F8',
        [PL_COLORS.blueLighter]: 'B6E6FB',
        [PL_COLORS.blueLighest]: 'e5f6fe',

        [PL_COLORS.gray]: 'b6b8ba',
        [PL_COLORS.grayDarkest]: '4c4f52',
        [PL_COLORS.grayDarker]: '747678',
        [PL_COLORS.grayDark]: '8f9194',
        [PL_COLORS.grayLight]: 'd2d3d5',
        [PL_COLORS.grayLighter]: 'e6e6e6',
        [PL_COLORS.grayLighest]: 'edeeef',

        [PL_COLORS.slate]: '647f94',
        [PL_COLORS.slateDarkest]: '2d3a45',
        [PL_COLORS.slateDarker]: '465460',
        [PL_COLORS.slateDark]: '556879',
        [PL_COLORS.slateMedium]: '95aabb',
        [PL_COLORS.slateLight]: 'd7e2ea',
        [PL_COLORS.slateLighter]: 'e8eef2',
        [PL_COLORS.slateLighest]: 'f8f9fa',

        'green': '78a240',
        'green-medium': '9ac61e',
        'green-light': 'EBF6CC',

        'red': 'D0021B',
        'red-light': 'FEE2E2',

        'yellow': 'f9b417',
        'yellow-light': 'FDEBC1',
        'yellow-dark': 'F0B643',

        'purple': 'b665a6',

        'cream': 'F8F3E0',

        'black': '000000',
        'white': 'FFFFFF',
    }

    constructor() {}

    getColorForName(name: string) {
        return this.colors[name];
    }

    getColorsArray(validColors: PL_COLORS[], size: number): PL_COLORS[] {
        const colors = [];
        for (let i = 0; i < size; i++) {
            colors.push(validColors[i % validColors.length]);
        }
        return colors;
    }
}
