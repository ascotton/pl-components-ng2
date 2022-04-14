import { Component, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'pl-app-nav',
    templateUrl: './pl-app-nav.component.html',
    styleUrls: ['./pl-app-nav.component.less'],
    inputs: ['user', 'pageLinks', 'appLinks', 'supportLinks', 'userMenuLinks', 'version', 'sidebarSide', 'logo', 'isAlert', 'noLogoLink'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class PLAppNavComponent {
    @ViewChild('navSidebar') navSidebar: ElementRef;
    @ViewChild('navSidebarButton') navSidebarButton: ElementRef;
    @ViewChild('menuContainer') menuContainer: ElementRef;

    user: any = {};
    pageLinks: any[] = [];
    appLinks: any[] = [];
    supportLinks: any[];
    userMenuLinks: any[];
    version: string = '';
    sidebarSide: string = 'right';
    logo: any = {};
    isAlert: boolean = false;
    noLogoLink: boolean = false;
    @Input() showLinks = true;

    classes: any = {
        sidebar: {
            hidden: true,
        },
    };
    stylesSidebar: any = {};
    sidebarVisible: boolean = false;
    // private loggedIn: boolean = false;
    links: any = {
        page: [],
        app: [],
        support: [],
        menu: [],
    };
    sidebarHiddenStyles: any = {
        left: 'auto',
    };
    sidebarVisibleStyles: any = {
        left: 'auto',
    };
    timeoutResize: any = null;

    constructor() {}

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }

    // Due to view child change, need to move from ngOnInit to here:
    // https://angular.io/guide/static-query-migration#is-there-a-case-where-i-should-use-static-true
    ngAfterViewInit() {
        this.onResize();
        this.setSidebarStyles();
    }

    init() {
        this.logo = Object.assign(
            {},
            {
                href: '/c/home',
                svg: 'logo-color-with-tm',
                width: 50,
                height: 27,
                verticalAlign: '-5px',
            },
            this.logo
        );
        // this.loggedIn = (this.user && this.user.uuid) ? true : false;
        this.user = this.user ? this.user : {};
        this.formPageLinks();
        this.formAppLinks();
        this.formSupportLinks();
        this.formUserMenuLinks();
    }

    formPageLinks() {
        this.links.page = this.pageLinks;
    }

    formAppLinks() {
        this.links.app = (this.appLinks || []).filter(l => l.hrefAbsolute);
    }

    formSupportLinks() {
        this.links.support = this.supportLinks;
    }

    formUserMenuLinks() {
        this.links.menu = this.userMenuLinks.filter(l => l.href || l.hrefAbsolute);
    }

    getMenuItemClass(item: any) {
        return item.class || '';
    }

    onClick(evt: any) {
        if (
            this.sidebarVisible &&
            !this.navSidebar.nativeElement.contains(evt.target) &&
            !this.navSidebarButton.nativeElement.contains(evt.target)
        ) {
            this.toggleSidebar();
        }
    }

    onNavItemClicked(evt: any) {
        evt.currentTarget.blur(); // hides the box-shadow after item is clicked
    }

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        this.classes.sidebar.hidden = !this.sidebarVisible;
        this.setSidebarStyles();
    }

    setSidebarStyles() {
        this.classes.sidebar[this.sidebarSide] = true;
        if (this.classes.sidebar.hidden) {
            this.stylesSidebar = this.sidebarHiddenStyles;
        } else {
            this.stylesSidebar = this.sidebarVisibleStyles;
        }
    }

    onResizeEle(evt: any) {
        this.onResize();
    }

    onResize(setWidth: number = -1) {
        const menu = this.menuContainer.nativeElement;
        if (this.timeoutResize) {
            clearTimeout(this.timeoutResize);
        }
        // To prevent glimpsing sidebar while resizing, remove transition. Re-add when done.
        this.stylesSidebar.transition = '';
        setTimeout(() => {
            this.stylesSidebar.transition = 'left 500ms';
        }, 50);
        const sidebarWidth = this.navSidebar.nativeElement.offsetWidth;
        if (this.sidebarSide === 'left') {
            this.sidebarHiddenStyles['left'] = `-${sidebarWidth}px`;
            this.sidebarVisibleStyles['left'] = '0px';
        } else if (this.sidebarSide === 'right') {
            let width;
            let fullWidth;
            let height;
            if (setWidth > -1) {
                width = setWidth;
            } else {
                width = menu.offsetLeft + menu.offsetWidth;
                height = menu.offsetHeight - 9; // 9 is arrow size
                fullWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            }
            this.sidebarHiddenStyles['top'] = `${height}px`;
            this.sidebarHiddenStyles['left'] = `${fullWidth}px`;
            this.sidebarVisibleStyles['top'] = `${height}px`;
            this.sidebarVisibleStyles['left'] = `${width - sidebarWidth}px`;
        }
    }
}
