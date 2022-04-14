import { Observable } from "rxjs";

export abstract class PLAbstractUserIDService {
    abstract userID(): Observable<string>;
}
