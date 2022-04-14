export namespace PLClientStudentDisplayService {

    export function get(user: any, options: { capitalize?: boolean, uppercase?: boolean } = { capitalize: false, uppercase: false }) {
        let text = 'client';
        if (user.xEnabledUiFlags && user.xEnabledUiFlags.includes('display-client-as-student')) {
            text = 'student';
        }

        if (options.capitalize) {
            text = `${text[0].toUpperCase()}${text.slice(1, text.length)}`;
        }
        else if (options.uppercase) {
            text = text.toUpperCase();
        }

        return text;
    }
}
