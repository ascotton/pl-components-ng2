import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';

@Injectable()
export class PLTimezoneService {
    formatDateTime: string = 'YYYY-MM-DD HH:mm:ssZ';
    dateTimeFormat: string = this.formatDateTime;
    formatDateTimeNoTz: string = 'YYYY-MM-DD HH:mm:ss';
    formatDate: string = 'YYYY-MM-DD';

    constructor() {}

    curDateTime(format1: any = null, nowTime1: any = null) {
        const format = format1 || this.formatDateTime;
        const nowTime = nowTime1 || moment();
        const dtMoment = nowTime.utc();
        return format === 'moment' ? dtMoment : dtMoment.format(format);
    }

    curDateTimeTz(format1: any, nowTime1: any, tz: string) {
        const format = format1 || this.formatDateTime;
        const nowTime = nowTime1 || moment();
        return moment.tz(nowTime.format(format), format, tz);
    }

    getTimezones() {
        // Get the 70ish most common timezones out of the 350+ total
        // https://github.com/thespacedojo/timezone-picker/blob/master/jstz.js
        return {
            'Pacific/Majuro': { name: 'Majuro', offset: '-12:00' },
            'Pacific/Pago_Pago': { name: 'Samoa', offset: '-11:00' },
            'America/Adak': { name: 'Adak', offset: '-10:00' },
            'Pacific/Honolulu': { name: 'Honolulu', offset: '-10:00' },
            'Pacific/Marquesas': { name: 'Marquesas', offset: '-09:30' },
            'Pacific/Gambier': { name: 'Gambier', offset: '-09:00' },
            'America/Anchorage': { name: 'Anchorage', offset: '-09:00' },
            'America/Los_Angeles': { name: 'Los Angeles', offset: '-08:00' },
            'Pacific/Pitcairn': { name: 'Pitcairn', offset: '-08:00' },
            'America/Phoenix': { name: 'Phoenix', offset: '-07:00' },
            'America/Denver': { name: 'Denver', offset: '-07:00' },
            'America/Guatemala': { name: 'Guatemala', offset: '-06:00' },
            'America/Chicago': { name: 'Chicago', offset: '-06:00' },
            'America/Bogota': { name: 'Bogota', offset: '-05:00' },
            'America/New_York': { name: 'New York', offset: '-05:00' },
            'America/Caracas': { name: 'Caracas', offset: '-04:30' },
            'America/Santiago': { name: 'Santiago', offset: '-04:00' },
            'America/Santo_Domingo': {
                name: 'Santo Domingo',
                offset: '-04:00',
            },
            'America/St_Johns': { name: 'St Johns', offset: '-03:30' },
            'America/Montevideo': { name: 'Montevideo', offset: '-03:00' },
            'America/Argentina/Buenos_Aires': {
                name: 'Buenos Aires',
                offset: '-03:00',
            },
            'America/Noronha': { name: 'Noronha', offset: '-02:00' },
            'Atlantic/Azores': { name: 'Azores', offset: '-01:00' },
            'Atlantic/Cape_Verde': { name: 'Cape Verde', offset: '-01:00' },
            UTC: { name: 'UTC', offset: '+00:00' },
            'Europe/London': { name: 'London', offset: '+00:00' },
            'Europe/Berlin': { name: 'Berlin', offset: '+01:00' },
            'Africa/Lagos': { name: 'Lagos', offset: '+01:00' },
            'Asia/Beirut': { name: 'Beirut', offset: '+02:00' },
            'Africa/Johannesburg': { name: 'Johannesburg', offset: '+02:00' },
            'Asia/Baghdad': { name: 'Baghdad', offset: '+03:00' },
            'Europe/Moscow': { name: 'Moscow', offset: '+03:00' },
            'Asia/Tehran': { name: 'Tehran', offset: '+03:30' },
            'Asia/Dubai': { name: 'Dubai', offset: '+04:00' },
            'Asia/Baku': { name: 'Baku', offset: '+04:00' },
            'Asia/Kabul': { name: 'Kabul', offset: '+04:30' },
            'Asia/Yekaterinburg': { name: 'Yekaterinburg', offset: '+05:00' },
            'Asia/Karachi': { name: 'Karachi', offset: '+05:00' },
            'Asia/Kolkata': { name: 'Kolkata', offset: '+05:30' },
            'Asia/Kathmandu': { name: 'Kathmandu', offset: '+05:45' },
            'Asia/Dhaka': { name: 'Dhaka', offset: '+06:00' },
            'Asia/Omsk': { name: 'Omsk', offset: '+06:00' },
            'Asia/Rangoon': { name: 'Rangoon', offset: '+06:30' },
            'Asia/Krasnoyarsk': { name: 'Krasnoyarsk', offset: '+07:00' },
            'Asia/Jakarta': { name: 'Jakarta', offset: '+07:00' },
            'Asia/Shanghai': { name: 'Shanghai', offset: '+08:00' },
            'Asia/Irkutsk': { name: 'Irkutsk', offset: '+08:00' },
            'Australia/Eucla': { name: 'Eucla', offset: '+08:45' },
            'Asia/Yakutsk': { name: 'Yakutsk', offset: '+09:00' },
            'Asia/Tokyo': { name: 'Tokyo', offset: '+09:00' },
            'Australia/Darwin': { name: 'Darwin', offset: '+09:30' },
            'Australia/Adelaide': { name: 'Adelaide', offset: '+09:30' },
            'Australia/Brisbane': { name: 'Brisbane', offset: '+10:00' },
            'Australia/Sydney': { name: 'Sydney', offset: '+10:00' },
            'Australia/Lord_Howe': { name: 'Lord Howe', offset: '+10:30' },
            'Asia/Kamchatka': { name: 'Kamchatka', offset: '+11:00' },
            'Pacific/Noumea': { name: 'Noumea', offset: '+11:00' },
            'Pacific/Norfolk': { name: 'Norfolk', offset: '+11:30' },
            'Pacific/Auckland': { name: 'Auckland', offset: '+12:00' },
            'Pacific/Tarawa': { name: 'Tarawa', offset: '+12:00' },
            'Pacific/Chatham': { name: 'Chatham', offset: '+12:45' },
            'Pacific/Tongatapu': { name: 'Tongatapu', offset: '+13:00' },
            'Pacific/Apia': { name: 'Apia', offset: '+13:00' },
            'Pacific/Kiritimati': { name: 'Kiritimati', offset: '+14:00' },
        };
    }

    getTimezonesSelect() {
        const timezones = this.getTimezones();
        let options: any = [];
        for (let key in timezones) {
            options.push({
                value: key,
                label: `${timezones[key].offset} ${timezones[key].name}`,
            });
        }
        return options;
    }

    guessTimezone(allZones: boolean = true) {
        const guess = moment.tz.guess();
        if (!allZones) {
            const timezones = this.getTimezones();
            if (timezones[guess]) {
                return guess;
            }
            return '';
        }
        return guess;
    }

    getZone(moment: any) {
        const offset = moment.format('Z');
        const timezones = this.getTimezones();
        for (let key in timezones) {
            if (timezones[key].offset === offset) {
                return key;
            }
        }
        // Default to UTC if not found.
        return 'UTC';
    }

    fromTZFormat(datetime: any) {
        if (!datetime) {
            return datetime;
        }
        return datetime.replace('Z', '+00:00').replace('T', ' ');
    }

    toUserZone(datetime: any, format: string, tz: string) {
        const format1 = format || this.formatDateTime;
        // Convert the datetime to the user's timezone.
        const timezone1 = tz || this.guessTimezone() || this.getZone(moment.tz(datetime, format1));
        return moment.tz(datetime, format1, timezone1);
    }

    getUserZone(currentUser: any) {
        let zone: any = false;
        if (currentUser) {
            if (currentUser.timezone) {
                zone = currentUser.timezone;
            } else if (currentUser.provider && currentUser.provider.timezone) {
                zone = currentUser.provider.timezone;
            } else if (currentUser.xProvider && currentUser.xProvider.timezone) {
                zone = currentUser.xProvider.timezone;
            }
        }
        return zone ? zone : this.guessTimezone() || 'UTC';
    }

    getUserToday(currentUser: any = null, format: string = 'YYYY-MM-DD', nowDate1: string = null) {
        const tz: any = this.getUserZone(currentUser);
        let nowTime: any;
        nowTime = nowDate1 || this.toUserZone(moment().format(this.formatDateTime), this.formatDateTime, tz);
        return nowTime.format(format);
    }

    toUTCNoSeconds(datetime: any, format1: string = '') {
        const format = format1 || this.formatDateTime;
        const datetimeObj = moment(datetime, format).utc();
        // moment switches the `T` to an `A` so we manually form the string..
        return `${datetimeObj.format('YYYY-MM-DD')}T${datetimeObj.format('HH:mm')}`;
    }

    toUTCBackend(datetime: any, format1: string = '') {
        const format = format1 || this.formatDateTime;
        const datetimeObj = moment(datetime, format).utc();
        // moment switches the `T` to an `A` so we manually form the string..
        return `${datetimeObj.format('YYYY-MM-DD')}T${datetimeObj.format('HH:mm:ss')}`;
    }

    toUTC(datetime: any, format1: string = '') {
        const format = format1 || this.formatDateTime;
        return moment(datetime, format).utc().format(format);
    }

    convertToOffset(datetime: any, format1: string, offset: number) {
        const format = format1 || this.formatDateTime;
        if (offset < 0) {
            return moment(datetime, format).utc().subtract(offset * -1, 'minutes');
        }
        return moment(datetime, format).utc().add(offset, 'minutes');
    }

    // copied from edu-clients pl-util.service
    computeAppointmentLocalDateTimes(A: any, timezone: string, forDisplay: boolean = true) {
        const OFFSET_DIFF = moment.tz(A.event.start, timezone).utcOffset() - moment.tz(A.start, timezone).utcOffset();
        const DIRECTION = forDisplay ? 'add' : 'subtract';
        const apptStart = moment.tz(A.start, timezone)[DIRECTION](OFFSET_DIFF, 'minutes');
        const apptEnd = moment.tz(A.end, timezone)[DIRECTION](OFFSET_DIFF, 'minutes');
        return { apptStart, apptEnd };
    }

    /**
    For repeating events, we do NOT want to switch the time across daylight savings.
    For example, an event created at 9am should show up at 9am always, not 9am during half the year
     and 10am the other half of the year. So, we need to take the FIRST appointment's start
     date and use that (with the timezone) to calculate the offset. Then use that offset for
     the current appointment date to get the appropriate time.
    */
    convertAppointmentTime (appointment: any, user: any, appointmentFields = ['start', 'end'], revert = false) {
        const offsetDiff = this.getAppointmentOriginalOffset(appointment, user);
        const userTz = this.getUserZone(user);

        appointmentFields.forEach((field) => {
            if (appointment[field]) {
                appointment[field] = this.fromTZFormat(appointment[field]);
                if (offsetDiff > 0) {
                    if (revert) {
                        appointment[field] = moment(appointment[field], this.formatDateTime).subtract(offsetDiff, 'minutes');
                    } else {
                        appointment[field] = moment(appointment[field], this.formatDateTime).add(offsetDiff, 'minutes');
                    }
                } else if (offsetDiff < 0) {
                    if (revert) {
                        appointment[field] = moment(appointment[field], this.formatDateTime).add((offsetDiff * -1), 'minutes')
                         .format(this.formatDateTime);
                    } else {
                        appointment[field] = moment(appointment[field], this.formatDateTime).subtract((offsetDiff * -1), 'minutes')
                         .format(this.formatDateTime);
                    }
                }
                appointment[field] = moment.tz(appointment[field], this.formatDateTime, userTz)
                 .format(this.formatDateTime);
            }
        });
        return appointment;
    }

    getAppointmentOriginalOffset(appointment: any, user: any) {
        let start = this.fromTZFormat(appointment.start);
        // If appointment has been altered (original_start is different than start), just use time as is.
        // Otherwise can not edit the appointment time without it jumping if it WAS
        // part of a repeating event. Only alter times if an unaltered event.
        if (this.toUTC(this.fromTZFormat(appointment.original_start)) !== this.toUTC(start)) {
            return 0;
        }
        let originalStart = (appointment.event && appointment.event.start) ? appointment.event.start : appointment.start;
        // Get offset for the original start date.
        originalStart = this.fromTZFormat(originalStart);
        let end = this.fromTZFormat(appointment.end);
        const userTz = this.getUserZone(user);
        // We'll compare the original offset from the current offset and adjust the UTC time accordingly.
        const offsetOriginal = moment.tz(originalStart, this.formatDateTime, userTz).utcOffset();
        const offsetNow = moment.tz(start, this.formatDateTime, userTz).utcOffset();
        const offsetDiff = offsetOriginal - offsetNow;
        return offsetDiff;
    }
}
