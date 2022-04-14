import { PLNameService } from './pl-name.service';
describe('pl-name.service', () => {
    let nameService: PLNameService;

    beforeEach(() => {
        nameService = new PLNameService();
    });

    it('should form full name from a first and last name', () => {
        const name = nameService.formFullName('first', 'last');
        expect(name).toEqual('first last');
    });

    it('should properly strip whitespace if the name has leading or trailing whitespace', () => {
        const name = nameService.formFullName('first', '');
        expect(name).toEqual('first');
    });

    it('should parse a properly formed full name', () => {
        const name = nameService.parseFullName('first last');
        expect(name).toEqual({ firstName: 'first', lastName: 'last' });
    });

    it('should properly parse a missing last name', () => {
        const name = nameService.parseFullName('first');
        expect(name).toEqual({ firstName: 'first', lastName: '' });
    });
});
