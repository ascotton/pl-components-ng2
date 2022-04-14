
import { PLLinkService } from './pl-link.service';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'pl-link',
    templateUrl: './pl-link.component.html',
    styleUrls: ['./pl-link.component.less'],
})
export class PLLinkComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() classesLink: any = { 'a-link': true };
    @Input() emitEvent = false;
    @Input() hrefAbsolute: string;
    @Input() href = '';
    @Input() label: string;
    @Input() queryParams: any = {};
    @Input() replaceHistory = false;
    @Input() stylesLink: any = {};

    @Output() readonly plLinkEvent = new EventEmitter<string>();

    fragment: string;

    constructor(private plLink: PLLinkService) { }

    ngOnInit() {
        this.updateClass();
        if (!this.hrefAbsolute) {
            const split = this.href.split('#');
            split.length === 2 && (this.href = split[0]);
            split.length === 2 && (this.fragment = split[1]);
        }
    }

    ngAfterViewInit() {
        if (this.emitEvent) this.emitLinkLabelOfActiveLink();
    }

    ngOnChanges() {
        this.updateClass();
    }

    updateClass() {
        if (!this.classesLink) {
            this.classesLink = {
                'link-unstyled': true,
                'link-no-color': true,
            };
        }
    }

    onClick() {
        if (this.emitEvent) this.emitLinkLabel(this.label);
        this.plLink.navigate(this.href, this.queryParams);
    }

    /**
     * Function for emiting a label/text to the parent.
     * Should be useful for parents that have many pl-links and wish to know which one was clicked or is active.
     *
     * @param label The text of the link.
     */
    private emitLinkLabel(label: string) {
        this.plLinkEvent.emit(label);
    }

    /**
     * Will emit only the text/label of the link that is active.
     * This functions works only for now when pl-link is used within pl-tabs.
     *
     * The timeout gives time for the class `active` to be set on the active link.
     * Iteration through the `classList` is performed in order to look for the `active` div.
     * Once found, the text of the `active` link is emitted.
     */
    private emitLinkLabelOfActiveLink() {
        setTimeout(() => {
            const plLinkElements: any = document.getElementsByClassName('pl-link');

            for (let indxA = 0; indxA < plLinkElements.length; indxA++) {
                const classList = plLinkElements[indxA].parentElement.classList;

                for (let indxB = 0; indxB < classList.length; indxB++) {
                    if (classList[indxB] === 'active') this.emitLinkLabel(plLinkElements[indxA].innerText);
                }
            }
        },         0);
    }
}
