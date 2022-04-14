export class PLJWTDecoder {
    private _decodedPayload: any;

    constructor(private encoded: string) {}

    get payload() {
        this._decodedPayload = this._decodedPayload || JSON.parse(atob(this.encoded.split('.')[1]));

        return this._decodedPayload;
    }

    get expirationTime() {
        return this.payload.exp;
    }

    get issuedAtTime() {
        return this.payload.iat;
    }

    get realUserID(): string {
        return this.payload.plru || '';
    }
}
