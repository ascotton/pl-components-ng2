import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, Inject } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

/**
 * PLModalServiceRoot lives in the root scope.
 * Do not include in any NgModule.
 * It self-declares its injector scope.
 */
@Injectable({ providedIn: 'root' })
export class PLModalServiceRoot {
    ID: string;

    private actions$: Subject<{ action: string, inputs?: any }> = new Subject();
    // Copied from: http://blog.brecht.io/Modals-in-angular2/
    // here we hold our placeholder
    private vcRef: ViewContainerRef;
    // we can use this to determine z-index of multiple modals
    // private activeInstances = 0;
    private componentRefs: any[] = [];

    constructor() {
        this.ID = `${Math.random()}`.substring(2, 6);
        if (localStorage.getItem('DEBUG')) {
            console.log(`\n[${this.ID}] PLModalServiceRoot`);
        }
    }

    registerViewContainerRef(vcRef: ViewContainerRef): void {
        this.vcRef = vcRef;
    }

    getViewContainerRef(): ViewContainerRef {
        return this.vcRef;
    }

    getComponentRef() {
        return this.componentRefs && this.componentRefs[0] && this.componentRefs[0].instance;
    }

    isBackgroundClickDisabled() {
        const ref = this.getComponentRef();
        return ref && ref.isBackgroundClickDisabled;
    }

    loadObserver(): Observable<{ action: string, inputs?: any }> {
        return this.actions$.asObservable();
    }

    hide(): void {
        const componentRef = this.getComponentRef();
        this.actions$.next({ action: 'hide' });
        if (componentRef && componentRef.onHide) {
            componentRef.onHide();
        }
    }

    addInstance<T>(componentRef: ComponentRef<T>, disableModalBackground = true): void {
        // this.activeInstances += 1;
        // Custom - only support 1 instance.
        this.clearInstances();
        this.componentRefs.push(componentRef);
        this.actions$.next({ action: 'show' });

        componentRef.instance['destroy'] = () => {
            // this.activeInstances -= 1;
            componentRef.destroy();
            this.hide();
        };

        const componentReferences = this.getComponentRef();
        componentReferences.isBackgroundClickDisabled = disableModalBackground;
    }

    clearInstances(): void {
        this.componentRefs.forEach((componentRef: any) => {
            if (componentRef.destroy) {
                componentRef.destroy();
            }
        });
        this.hide();
        this.componentRefs = [];
    }
}

/**
 * PLModalService acts as a module-local service instance with access to module scoped ComponentFactoryResolver.
 * It delegates to the root modal service for access to the app root pl-modal container element.
 */
@Injectable()
export class PLModalService {
    ID: string;
    isDebug: boolean;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private plModalServiceRoot: PLModalServiceRoot) {
        this.ID = `${Math.random()}`.substring(2, 6);
        this.isDebug = !!localStorage.getItem('PL_DEBUG_MODAL');

        if (this.isDebug) console.log(`\n[${this.ID}] PLModalService`);
    }

    create<T>(component: Type<T>, parameters: any = {}, disableModalBackground = true) {
        if (this.isDebug) console.log(`\n[${this.ID}] PLModalService: create ${this.ID}`);
        return this.createFromResolver<T>(component, this.componentFactoryResolver, parameters, disableModalBackground);
    }

    createFromResolver<T>(
        component: Type<T>,
        resolver: ComponentFactoryResolver,
        parameters: any = {},
        disableModalBackground = true): Observable<ComponentRef<T>> {

        if (this.isDebug) console.log(`\n[${this.ID}] PLModalService: createFromResolver ${this.ID}`);

        const vcRef = this.plModalServiceRoot.getViewContainerRef();
        const componentFactory = resolver.resolveComponentFactory(component);
        const componentRef: ComponentRef<T> = vcRef.createComponent(componentFactory);

        // pass the @Input parameters to the instance
        Object.assign(componentRef.instance, parameters);
        this.plModalServiceRoot.addInstance(componentRef, disableModalBackground);

        return of(componentRef);
    }

    destroyAll(): void {
        this.plModalServiceRoot.clearInstances();
    }
}
