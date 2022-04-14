import { Observable } from "rxjs";

export abstract class PLAbstractRealUserIDService {
    abstract realUserID(): Observable<string>;
}
