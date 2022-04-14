import { Component, SimpleChanges } from '@angular/core';
// import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import { PLToastService } from './pl-toast.service';

@Component({
    selector: 'pl-toast',
    templateUrl: './pl-toast.component.html',
    styleUrls: ['./pl-toast.component.less'],
    inputs: ['hideDelayTime', 'verticalAlign', 'autoHide', 'closeOnTop', 'leftIcon'],
})
export class PLToastComponent {
    hideDelayTime: number = 4000;
    verticalAlign: string = 'center';
    autoHide: boolean = false;
    closeOnTop: boolean = true;
    leftIcon: boolean = true;

    message: string = '';
    hideFadeTime: number = 1000; // should match CSS
    hideFadeTimeoutTrigger: any = -1;
    classes: any = {
        container: {
            info: false,
            error: false,
            warning: false,
            success: false,
            hidden: true,
            visible: false,
            hiding: false,
            closeOnTop: false,
            leftIcon: false,
            // verticalTop: false,
            // verticalCenter: false,
        },
    };
    stylesContainer: any = {};
    leftIconSvg: any = '';
    leftIconSvgMap: any = {
        info: 'info',
        error: 'cross',
        warning: 'info',
        success: 'check',
    };

    constructor(private plToast: PLToastService) {}

    ngOnInit() {
        this.plToast.loadObserver(this.hideDelayTime, this.autoHide).subscribe((res: any) => {
            if (res.action === 'show') {
                this.show(res.type, res.message);
            } else {
                this.hide();
            }
        });
        this.init();
        this.onResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }

    init() {
        this.classes.container.closeOnTop = this.closeOnTop;
        this.classes.container.leftIcon = this.leftIcon;
        // this.setVerticalAlign();
    }

    // setVerticalAlign() {
    //     this.classes.container.verticalTop = (this.verticalAlign === 'top') ? true : false;
    //     this.classes.container.verticalCenter = (this.verticalAlign === 'center') ? true : false;
    // }

    setLeftIcon(type: string) {
        this.leftIconSvg = this.leftIconSvgMap[type];
    }

    onResizeEle(evt: any) {
        this.onResize();
    }

    onResize() {
        if (this.verticalAlign === 'center') {
            const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            const toastHeight = 50; // hardcoded guess.
            const top = height / 2 - toastHeight / 2;
            this.stylesContainer.top = `${top}px`;
        }
    }

    resetClassesContainer() {
        return Object.assign({}, this.classes.container, {
            info: false,
            error: false,
            warning: false,
            success: false,
            hidden: true,
            visible: false,
            hiding: false,
        });
    }

    show(type: string, message: string) {
        // Hide first to notify user in case there was another toast up already.
        this.fullHide();
        setTimeout(() => {
            this.resetTimeout();
            this.setLeftIcon(type);
            this.message = message;
            const classesContainer = this.resetClassesContainer();
            classesContainer[type] = true;
            classesContainer.visible = true;
            classesContainer.hidden = false;
            this.classes.container = classesContainer;
        }, 100);
    }

    resetTimeout() {
        if (this.hideFadeTimeoutTrigger) {
            clearTimeout(this.hideFadeTimeoutTrigger);
        }
    }

    hide() {
        this.resetTimeout();
        this.classes.container.hiding = true;
        this.hideFadeTimeoutTrigger = setTimeout(() => {
            this.fullHide();
        }, this.hideFadeTime);
    }

    fullHide() {
        this.message = '';
        const classesContainer = this.resetClassesContainer();
        this.classes.container = classesContainer;
    }
}
