
import * as moment from 'moment-timezone';
import { TestBed, async } from '@angular/core/testing';

import { PLTimezoneService } from './pl-timezone.service';

describe('PLTimezoneService', function() {
    let dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
    let dateTimeTzFormat = 'YYYY-MM-DD HH:mm:ss Z';
    let dateTime = '2017-03-23 10:20:03';
    let dateTimeTz = '2017-03-23 10:20:03 +00:00';
    let dateTimeMoment = moment(dateTime, dateTimeFormat);
    let dateTimeTzMoment = moment(dateTimeTz, dateTimeTzFormat);

    beforeEach(() => {
        this.timezoneService = new PLTimezoneService();
    });

    // Not Testing these functions since the timezone/zone are server specific
    // it('curDateTime - should return the provided date and time', () => {
    //     expect(this.timezoneService.curDateTime(dateTimeFormat, dateTimeMoment)).toEqual('2017-03-23 17:20:03');
    // });

    it('curDateTimeTz - should return the provided date and time with the timezone', () => {
        expect(
            this.timezoneService.curDateTimeTz(dateTimeTzFormat, dateTimeTzMoment, 'UTC').format(dateTimeTzFormat)
        ).toEqual('2017-03-23 10:20:03 +00:00');
    });

    it('getTimezonesSelect - should return the timezone options', () => {
        expect(this.timezoneService.getTimezonesSelect()).toEqual([
            Object({ value: 'Pacific/Majuro', label: '-12:00 Majuro' }),
            Object({ value: 'Pacific/Pago_Pago', label: '-11:00 Samoa' }),
            Object({ value: 'America/Adak', label: '-10:00 Adak' }),
            Object({ value: 'Pacific/Honolulu', label: '-10:00 Honolulu' }),
            Object({ value: 'Pacific/Marquesas', label: '-09:30 Marquesas' }),
            Object({ value: 'Pacific/Gambier', label: '-09:00 Gambier' }),
            Object({ value: 'America/Anchorage', label: '-09:00 Anchorage' }),
            Object({ value: 'America/Los_Angeles', label: '-08:00 Los Angeles' }),
            Object({ value: 'Pacific/Pitcairn', label: '-08:00 Pitcairn' }),
            Object({ value: 'America/Phoenix', label: '-07:00 Phoenix' }),
            Object({ value: 'America/Denver', label: '-07:00 Denver' }),
            Object({ value: 'America/Guatemala', label: '-06:00 Guatemala' }),
            Object({ value: 'America/Chicago', label: '-06:00 Chicago' }),
            Object({ value: 'America/Bogota', label: '-05:00 Bogota' }),
            Object({ value: 'America/New_York', label: '-05:00 New York' }),
            Object({ value: 'America/Caracas', label: '-04:30 Caracas' }),
            Object({ value: 'America/Santiago', label: '-04:00 Santiago' }),
            Object({ value: 'America/Santo_Domingo', label: '-04:00 Santo Domingo' }),
            Object({ value: 'America/St_Johns', label: '-03:30 St Johns' }),
            Object({ value: 'America/Montevideo', label: '-03:00 Montevideo' }),
            Object({ value: 'America/Argentina/Buenos_Aires', label: '-03:00 Buenos Aires' }),
            Object({ value: 'America/Noronha', label: '-02:00 Noronha' }),
            Object({ value: 'Atlantic/Azores', label: '-01:00 Azores' }),
            Object({ value: 'Atlantic/Cape_Verde', label: '-01:00 Cape Verde' }),
            Object({ value: 'UTC', label: '+00:00 UTC' }),
            Object({ value: 'Europe/London', label: '+00:00 London' }),
            Object({ value: 'Europe/Berlin', label: '+01:00 Berlin' }),
            Object({ value: 'Africa/Lagos', label: '+01:00 Lagos' }),
            Object({ value: 'Asia/Beirut', label: '+02:00 Beirut' }),
            Object({ value: 'Africa/Johannesburg', label: '+02:00 Johannesburg' }),
            Object({ value: 'Asia/Baghdad', label: '+03:00 Baghdad' }),
            Object({ value: 'Europe/Moscow', label: '+03:00 Moscow' }),
            Object({ value: 'Asia/Tehran', label: '+03:30 Tehran' }),
            Object({ value: 'Asia/Dubai', label: '+04:00 Dubai' }),
            Object({ value: 'Asia/Baku', label: '+04:00 Baku' }),
            Object({ value: 'Asia/Kabul', label: '+04:30 Kabul' }),
            Object({ value: 'Asia/Yekaterinburg', label: '+05:00 Yekaterinburg' }),
            Object({ value: 'Asia/Karachi', label: '+05:00 Karachi' }),
            Object({ value: 'Asia/Kolkata', label: '+05:30 Kolkata' }),
            Object({ value: 'Asia/Kathmandu', label: '+05:45 Kathmandu' }),
            Object({ value: 'Asia/Dhaka', label: '+06:00 Dhaka' }),
            Object({ value: 'Asia/Omsk', label: '+06:00 Omsk' }),
            Object({ value: 'Asia/Rangoon', label: '+06:30 Rangoon' }),
            Object({ value: 'Asia/Krasnoyarsk', label: '+07:00 Krasnoyarsk' }),
            Object({ value: 'Asia/Jakarta', label: '+07:00 Jakarta' }),
            Object({ value: 'Asia/Shanghai', label: '+08:00 Shanghai' }),
            Object({ value: 'Asia/Irkutsk', label: '+08:00 Irkutsk' }),
            Object({ value: 'Australia/Eucla', label: '+08:45 Eucla' }),
            Object({ value: 'Asia/Yakutsk', label: '+09:00 Yakutsk' }),
            Object({ value: 'Asia/Tokyo', label: '+09:00 Tokyo' }),
            Object({ value: 'Australia/Darwin', label: '+09:30 Darwin' }),
            Object({ value: 'Australia/Adelaide', label: '+09:30 Adelaide' }),
            Object({ value: 'Australia/Brisbane', label: '+10:00 Brisbane' }),
            Object({ value: 'Australia/Sydney', label: '+10:00 Sydney' }),
            Object({ value: 'Australia/Lord_Howe', label: '+10:30 Lord Howe' }),
            Object({ value: 'Asia/Kamchatka', label: '+11:00 Kamchatka' }),
            Object({ value: 'Pacific/Noumea', label: '+11:00 Noumea' }),
            Object({ value: 'Pacific/Norfolk', label: '+11:30 Norfolk' }),
            Object({ value: 'Pacific/Auckland', label: '+12:00 Auckland' }),
            Object({ value: 'Pacific/Tarawa', label: '+12:00 Tarawa' }),
            Object({ value: 'Pacific/Chatham', label: '+12:45 Chatham' }),
            Object({ value: 'Pacific/Tongatapu', label: '+13:00 Tongatapu' }),
            Object({ value: 'Pacific/Apia', label: '+13:00 Apia' }),
            Object({ value: 'Pacific/Kiritimati', label: '+14:00 Kiritimati' }),
        ]);
    });

    // Not Testing these functions since the timezone/zone are server specific
    // it('guessTimezone - should return a timezone', () => {
    //     expect(this.timezoneService.guessTimezone(true)).toEqual('America/Los_Angeles');
    // });

    // it('guessTimezone - should return a timezone', () => {
    //     expect(this.timezoneService.guessTimezone(false)).toEqual('America/Los_Angeles');
    // });

    // it('getZone - should get the zone based on the provided time', () => {
    //     expect(this.timezoneService.getZone(dateTimeTzMoment)).toEqual('America/Phoenix');
    // });

    // it('getZone - should return UTC since the zone cannot be found', () => {
    //     expect(this.timezoneService.getZone(moment('2017-05-23 24:10:03Z'))).toEqual('UTC');
    // });

    it('fromTZFormat - should return date and time in TZ format', () => {
        expect(this.timezoneService.fromTZFormat('2017-3-23 10:20:03TZ')).toEqual('2017-3-23 10:20:03 +00:00');
    });

    it('fromTZFormat - should return null since a date and time was not provided', () => {
        expect(this.timezoneService.fromTZFormat(null)).toEqual(null);
    });

    it('toUserZone - should return the converted date and time to the timezone', () => {
        expect(
            this.timezoneService.toUserZone(dateTimeTz, dateTimeFormat, 'America/Los_Angeles').format(dateTimeTzFormat)
        ).toEqual('2017-03-23 10:20:03 -07:00');
    });

    it('getUserZone - should return the zone of the user', () => {
        const user = {
            timezone: { 'America/New_York': { name: 'New York', offset: '-05:00' } },
        };
        expect(this.timezoneService.getUserZone(user)).toEqual({
            'America/New_York': { name: 'New York', offset: '-05:00' },
        });
    });

    it('getUserZone - should return the zone of the provider of the user', () => {
        const user = {
            provider: {
                timezone: { 'Pacific/Gambier': { name: 'Gambier', offset: '-09:00' } },
            },
        };
        expect(this.timezoneService.getUserZone(user)).toEqual({
            'Pacific/Gambier': { name: 'Gambier', offset: '-09:00' },
        });
    });

    it('getUserToday - should return the date provided', () => {
        expect(this.timezoneService.getUserToday(null, 'YYYY-MM-DD', moment('2017-09-11'))).toEqual('2017-09-11');
    });

    // Not Testing these functions since the timezone/zone are server specific
    // it('toUTCNoSeconds - should return the date and time without seconds in UTC', () => {
    //     expect(this.timezoneService.toUTCNoSeconds(dateTime, dateTimeFormat)).toEqual('2017-03-23T17:20');
    // });

    // it('toUTCBackend - should return the date and time in UTC', () => {
    //     expect(this.timezoneService.toUTCBackend(dateTime, dateTimeFormat)).toEqual('2017-03-23T17:20:03');
    // });

    // it('toUTC - should return the date and time in UTC', () => {
    //     expect(this.timezoneService.toUTC(dateTime)).toEqual('2017-03-23 17:20:03+00:00');
    // });

    it('convertToOffset - should return the date and time with additional minutes', () => {
        expect(
            this.timezoneService.convertToOffset(dateTimeTzMoment, dateTimeFormat, 3).format(dateTimeTzFormat)
        ).toEqual('2017-03-23 10:23:03 +00:00');
    });

    it('convertToOffset - should return the date and time with less minutes', () => {
        expect(
            this.timezoneService.convertToOffset(dateTimeTzMoment, dateTimeFormat, -3).format(dateTimeTzFormat)
        ).toEqual('2017-03-23 10:17:03 +00:00');
    });
});
