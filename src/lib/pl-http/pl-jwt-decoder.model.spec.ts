import { TestBed } from '@angular/core/testing';

import { PLJWTDecoder } from './pl-jwt-decoder.model';

describe('PLJWTDecoderModel', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLJWTDecoder,
            ]
        });
        // this.encoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
        this.encoded = 'eyJraWQiOiI3MDU4YTg0ZDc0YTRhZTM0MjM5OTVlMGVjMDUxZjkwOCIsImFsZyI6IlJTMjU2In0.' +
         'eyJzdWIiOiJhOGVkMDJiZC0wNWVjLTNmYjctYjZlNy05OTBjNjhiODYyNDAiLCJpYXQiOjE1MTE4MTkwMTgsInBscnUiOiJmZmZmNmZ' +
         'iNy1lYzZhLTRjNGYtYTQzOC0zYzcyMWJiODI3MTQiLCJleHAiOjE1MTE5MDU0MTgsImlzcyI6Ii9vcGVuaWQiLCJhdXRoX3RpbWUiOjE1MTE4MTYxNjYsImF1ZCI6ImFsbCJ9.' +
         'JK7DxQGem-6INiCyINVObMZefHWdY87q2Ma5-far9HuLrsqN1cPwtrRAvT0SA-WvOu2hprCoAdVjeKtKB074K6eD2lQpzeD_' +
         'nvkoKKwEnKNJZhTowyvVAXbCgb62ghY1rOJrUf8X8YU5jX3Gt_QCG8kF-xi4nFsBROhi4wlzxb_hR1qXckeGFsiJRwBZ-' +
         '40vdnyw1Ya-B1ZkwAndiGtPpLycGMHW7JHc73yI_R07Whx6eBtahwXm5uKnkIzux2YzCyVZLDd-0BaxNNyDxIYmyH3cLyAR02hZU3G_' +
         'EIDFFM5spRLiACXnbbipudYqH4Sz-z5El-WiqvBXKFZeYo55hDeFViSxTgewGEJMCImeuo_' +
         'iRkRA8yx4sDR6brBq71YrSHT3PIckDGPaIHJw6ArNCKKlBD6Jv8VDY1dsxLpbnT7_0tgNJZMlkCYPped2n2K_' +
         '7t4p12C5R3vRQx1fpKbMxCtXEm7v347ZHSZqt3v0UiO8sCDgPbREkNxfleiw_tVjqR8_' +
         'pZur30XyMJpSPIM41AGGPJGUkFomWiyG-VyKG-pOzvQH4djb3xwKaNaaVdmu5oJeXumu-' +
         'Lo3kVdcRvOaefs4xxS3frB_8O8OFksbm0GIbrV6Ab8D5IE1u42jIpOyTN4wOBQXDRJb-Cl29_g5dQZpu0BpkHrtrL5Lg_v3Ch0';
        this.decoded = {
            // sub: '1234567890',
            // name: 'John Doe',
            // admin: true
            sub: "a8ed02bd-05ec-3fb7-b6e7-990c68b86240",
            iat: 1511819018,
            plru: "ffff6fb7-ec6a-4c4f-a438-3c721bb82714",
            exp: 1511905418,
            iss: "/openid",
            auth_time: 1511816166,
            aud: "all"
        };

        this.plJWTDecoder = new PLJWTDecoder(this.encoded);
    });

    describe('get', () => {
        it('should get payload', () => {
            const decoded = this.plJWTDecoder.payload;
            expect(decoded).toEqual(this.decoded);
        });

        it('should get expirationTime', () => {
            const expirationTime = this.plJWTDecoder.expirationTime;
            expect(expirationTime).toEqual(this.decoded.exp);
        });

        it('should get issuedAtTime', () => {
            const issuedAtTime = this.plJWTDecoder.issuedAtTime;
            expect(issuedAtTime).toEqual(this.decoded.iat);
        });

        it('should get realUserID', () => {
            const userId = this.plJWTDecoder.realUserID;
            expect(userId).toEqual(this.decoded.plru);
        });
    });
});