export namespace PLInputMimeTypesService {

    // Harcoded. Selected the key ones we use from this list: https://www.freeformatter.com/mime-types-list.html
    const extensionMap: any = {
        'application/x-7z-compressed': '7z',
        'application/x-shockwave-flash': 'swf',
        'application/pdf': 'pdf',
        'video/x-msvideo': 'avi',
        'application/octet-stream': 'bin',
        'image/bmp': 'bmp',
        'application/x-sh': 'sh',
        'image/prs.btif': 'bitf',
        'application/x-bzip': 'bz',
        'application/x-bzip2': 'bz2',
        'text/css': 'css',
        'text/csv': 'csv',
        'video/x-flv': 'flv',
        'image/gif': 'gif',
        'text/html': 'html',
        'image/x-icon': 'ico',
        'application/javascript': 'js',
        'application/json': 'json',
        'image/jpeg': ['jpg', 'jpeg'],
        'image/pjpeg': 'pjeg',
        'video/jpeg': 'jpgv',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.openxmlformats-officedocument.presentationml.slide': 'sldx',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'potx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'xltx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/msword': 'doc',
        'video/mpeg': 'mpeg',
        'video/mp4': 'mp4',
        'application/mp4': 'mp4',
        'video/webm': 'webm',
        'image/vnd.adobe.photoshop': 'psd',
        'image/png': 'png',
        'image/x-png': 'png',
        'application/postscript': 'ai',
        'image/svg+xml': 'svg',
        'image/tiff': 'tiff',
        'text/plain': 'txt',
        'application/zip': 'zip',
    };

    export function getExtensionsFromMimeTypes(mimeTypes: string) {
        let extensions: string[] = [];
        if (mimeTypes.length) {
            const mimeTypesArray = mimeTypes.split(',');

            mimeTypesArray.forEach((mimeType) => {
                if (extensionMap[mimeType]) {
                    if (Array.isArray(extensionMap[mimeType])) {
                        extensions = extensions.concat(extensionMap[mimeType]);
                    } else {
                        extensions.push(extensionMap[mimeType]);
                    }
                }
            });
        }

        return extensions.join(',');
    }
}
