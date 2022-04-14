import { PLLodashService } from './pl-lodash.service';

describe('PLLodashService', () => {
    let service: PLLodashService;

    describe('findIndex', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return the index of the value in the array', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, { yo: 'lady' }];
            expect(service.findIndex(array1, 'cat.dog.bizz', 'bazz')).toEqual(0);
        });

        it('should return -1 since the value is not in the array', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, { yo: 'lady' }];
            expect(service.findIndex(array1, 'foo', 'bazz')).toEqual(-1);
        });
    });

    describe('dotNotationKeyValue', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return the value referenced by the dot notation', () => {
            const obj = { foo: 'bar', cat: { dog: { bizz: 'bazz' } } };
            expect(service.dotNotationKeyValue(obj, 'cat.dog.bizz')).toEqual('bazz');
        });

        it('should return an object when value referenced by the dot notation is an object', () => {
            const obj = { foo: 'bar', cat: { dog: { bizz: 'bazz' } } };
            expect(service.dotNotationKeyValue(obj, 'cat.dog')).toEqual({ bizz: 'bazz' });
        });
    });

    describe('noKeys', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return true when the object has no keys', () => {
            const obj = {};
            expect(service.noKeys(obj)).toEqual(true);
        });

        it('should return false when the object has keys', () => {
            const obj = { foo: 'bar', cat: 'bazz' };
            expect(service.noKeys(obj)).toEqual(false);
        });
    });

    describe('equals', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return true when two strings are the same', () => {
            expect(service.equals('foo', 'foo')).toEqual(true);
        });

        // TODO - omit is not defined in tests, but works fine otherwise.
        // it('should return true when two objects are the same after omit', () => {
        //     expect(service.equals({ foo: 'bar', cat: 'bazz' }, { foo: 'bar' }, 'cat')).toEqual(true);
        // });

        it('should return false when two objects are not the same', () => {
            expect(service.equals({ foo: 'bar', cat: 'bazz' }, { foo: 'bar' })).toEqual(false);
        });

        it('should return true when the two empty objects are the same', () => {
            expect(service.equals({}, {})).toEqual(true);
        });

        it('should return false when the values of the key in the objects do not match', () => {
            expect(service.equals({ foo: 'bar', cat: 'bazz' }, { foo: 'bar', cat: 'hair' }, '', true)).toEqual(false);
        });
    });

    describe('allTrue', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return true when all properties of the object are true', () => {
            const obj = { foo: 'bar', cat: { dog: { bizz: 'bazz' } } };
            expect(service.allTrue(obj)).toEqual(true);
        });

        it('should return false when one or more properties the object is false', () => {
            const obj: any = { foo: null, cat: { dog: { bizz: 'bazz' } } };
            expect(service.allTrue(obj)).toEqual(false);
        });

        it('should return true when all values of the array are true', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, { yo: 'lady' }];
            expect(service.allTrue(array1)).toEqual(true);
        });

        it('should return false when one or more values of the array is false', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, null];
            expect(service.allTrue(array1)).toEqual(false);
        });
    });

    describe('copy', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return a copy of the array', () => {
            const array1 = [{ foo: 'bar' }, { cat: { dog: { bizz: 'bazz' } } }];
            expect(service.copy(array1)).toEqual([{ foo: 'bar' }, { cat: { dog: { bizz: 'bazz' } } }]);
        });

        it('should return a copy of the object', () => {
            expect(service.copy({ foo: 'bar' })).toEqual({ foo: 'bar' });
        });

        it('should return a copy of an item', () => {
            expect(service.copy('non_object')).toEqual('non_object');
        });
    });

    describe('getFileExtension', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should get the file extension', () => {
            const extension = service.getFileExtension('foo.bar');
            expect(extension).toEqual('bar');
        });

        it('should get the file extension of a name with multiple dots', () => {
            const extension = service.getFileExtension('foo.bar.baz');
            expect(extension).toEqual('baz');
        });

        it('should get the file extension of a name with no extension', () => {
            const extension = service.getFileExtension('foo');
            expect(extension).toEqual('');
        });
    });

    describe('stripFileExtension', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should strip the file extension', () => {
            const extension = service.stripFileExtension('foo.bar');
            expect(extension).toEqual('foo');
        });

        it('should strip the file extension of a name with multiple dots', () => {
            const extension = service.stripFileExtension('foo.bar.baz');
            expect(extension).toEqual('foo.bar');
        });

        it('should strip the file extension of a name with no extension', () => {
            const extension = service.stripFileExtension('foo');
            expect(extension).toEqual('foo');
        });
    });

    describe('stripSpecialCharacters', () => {
        beforeEach(() => service = new PLLodashService());

        it('should strip the special characters', () => {
            const filename = service.stripSpecialCharacters('@file#$name%^ with&*, no. special.,, characters!@#$$$&+=');
            expect(filename.text).toEqual('filename with no special characters');
            expect(filename.charactersFound).toEqual(true);
        });

        it('should return the name as it is when no special characters are found', () => {
            const filename = service.stripSpecialCharacters('filenamewithnospecialcharacters');
            expect(filename.text).toEqual('filenamewithnospecialcharacters');
            expect(filename.charactersFound).toEqual(false);
        });
    });


    describe('objectValues', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return the values of the object', () => {
            const obj = { foo: 'bar', cat: 'dog' };
            const values = service.objectValues(obj);
            expect(values).toEqual(['bar', 'dog']);
        });

        it('should return an empty array for an empty object', () => {
            const obj = {};
            const values = service.objectValues(obj);
            expect(values).toEqual([]);
        });
    });

    describe('isObjectEmpty', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should return true for an empty object', () => {
            expect(service.isObjectEmpty({})).toEqual(true);
        });

        it('should return false for a non-empty object', () => {
            expect(service.isObjectEmpty({ foo: 'bar' })).toEqual(false);
        });
    });

    describe('getItemFromKey', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should get the item in the array from the key', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, { yo: 'lady' }];
            expect(service.getItemFromKey(array1, 'yo', 'lady')).toEqual({ yo: 'lady' });
        });

        it('should return null when item is not in the array', () => {
            const array1 = [{ foo: 'bar', cat: { dog: { bizz: 'bazz' } } }, { yo: 'lady' }];
            expect(service.getItemFromKey(array1, 'yo', 'lad')).toEqual(null);
        });
    });

    describe('getItemValueFromKey', () => {
        beforeEach(() => {
            service = new PLLodashService();
        });

        it('should get the items value in the array from the key', () => {
            const array1 = [{ foo: 'bar' }, { cat: 'pole', yo: 'lads' }, { dog: 'bar' }];
            expect(service.getItemValueFromKey(array1, 'cat', 'pole', 'cat')).toEqual('pole');
        });
    });

    describe('prefixProperties', () => {
        service = new PLLodashService();

        it('will not fail if obj is empty', () => {
            expect(service.prefixProperties('the_prefix', {})).toEqual({});
        });

        it('will be a copy', () => {
            const object = {};

            expect(service.prefixProperties('', object)).not.toBe(object);
        });

        it('will not modify the original', () => {
            const object = { a: 1, b: 2 };

            service.prefixProperties('the_prefix', object);

            expect(object).toEqual({ a: 1, b: 2 });
        });

        it('will prepend prefix to each property in object', () => {
            const object = { a: 1, b: 2 };

            expect(service.prefixProperties('the_prefix_', object)).toEqual({ the_prefix_a: 1, the_prefix_b: 2 });
        });

        it('will not include non-enumerable properties', () => {
            class Sample {
                foo = 'bar';

                get nonEnumerable() { return 0; }
            }

            const object = new Sample();

            expect(service.prefixProperties('prefix_', object)).toEqual({ prefix_foo: 'bar' });
        });
    });

});
