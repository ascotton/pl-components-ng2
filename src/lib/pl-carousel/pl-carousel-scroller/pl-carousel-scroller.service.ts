import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PLCarouselScrollerService {
    items: any[] = [];
    itemsUpdatedSource = new Subject<any>();
    itemsUpdated$ = this.itemsUpdatedSource.asObservable();

    setItems(items: any[]) {
        // Add an id if not already there.
        items.forEach((item: any) => {
            if (!item.id) {
                item.id = (Math.random() + 1).toString(36).substring(7);
            }
        });
        this.items = items;
        this.pushItemUpdates();
    }

    pushItemUpdates() {
        this.itemsUpdatedSource.next({ items: this.items });
    }

    selectItem(item: any) {
        this.items.forEach((item1: any) => {
            if (!item1.xClasses) {
                item1.xClasses = {};
            }
            if (item1.id === item.id) {
                item1.xClasses.selected = true;
                item1.xClasses.visited = true;
            } else {
                item1.xClasses.selected = false;
            }
        });
        this.pushItemUpdates();
    }
}
