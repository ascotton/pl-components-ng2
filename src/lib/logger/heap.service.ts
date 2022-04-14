import { Injectable } from '@angular/core';

// TODO - un-hardcode the relative path here.
import { environment } from '../../environments/environment';

@Injectable()
export class HeapLogger {
    user: any = null;

    constructor() {
        const heapKey = environment.heap_key;
        if (heapKey && heapKey.length) {
            window['heap'] = window['heap'] || [];
            var heap = window['heap'];
            heap.load = function(e: any, t: any) {
                heap.appid = e;
                heap.config = t = t || {};

                var r = t.forceSSL || 'https:' === document.location.protocol;
                var a = document.createElement('script');
                a.type = 'text/javascript';
                a.async = !0;
                a.src = (r ? 'https:' : 'http:') + '//cdn.heapanalytics.com/js/heap-' + e + '.js';

                var n = document.getElementsByTagName('script')[0];
                n.parentNode.insertBefore(a, n);

                var o = function(e: any) {
                    return function() {
                        heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                };
                var p = [
                    'addEventProperties',
                    'addUserProperties',
                    'clearEventProperties',
                    'identify',
                    'removeEventProperty',
                    'setEventProperties',
                    'track',
                    'unsetEventProperty',
                ];
                for (var c = 0; c < p.length; c++) {
                    heap[p[c]] = o(p[c]);
                }
            };

            heap.load(heapKey);

            if (window['heap']) {
                window['heap'].addEventProperties({
                    version: environment.git_sha,
                });
            }
        }
    }

    setUser(user: any) {
        if (user) {
            const userGroups = user.groups ? user.groups.join('+') : 'no-groups';
            this.user = user;
            if (window['heap'] && user.username) {
                window['heap'].identify(this.user.username);
                window['heap'].addUserProperties({
                    email: this.user.email,
                    uuid: this.user.uuid,
                    groups: userGroups,
                });
            }
        }
    }

    setIsHijacked(val: boolean) {
        if (window['heap']) {
            window['heap'].addUserProperties({
                hijacked: val,
            });
        }
    }

    logCustomEvent(name: string, data: any) {
        if (window['heap']) {
            window['heap'].track(name, data);
        }
    }
}
