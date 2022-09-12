import _ from 'lodash';
import { FileInPlayer } from './store/FileInPlayer';

// prettier-ignore
export function formatLeftColumn(file: FileInPlayer, showTags: boolean) {
    if (!file.isMetadataLoaded || !showTags) return file.name;
    return `${_.padStart(file.metadata?.common.track.no?.toString(), 2, '0')}. ${file.metadata?.common.artist} - ${file.metadata?.common.title ?? file.name}`;
}

export function formatRightColumn(file: FileInPlayer, showTags: boolean) {
    if (!file.isMetadataLoaded || !showTags) return '';
    return `${file.metadata?.common.album} (${file.metadata?.common.year})`;
}
