import _ from 'lodash';
import { FileInPlayer } from './store/FileInPlayer';

// prettier-ignore
// todo move to settings
export const leftColFormatStr ='%if(%tracknumber,%tracknumber. ,) %IF(%artist,%artist - ,) %if(%title,%title,%name)';
export const rightColFormatStr = '%album %if(%year,(%year),)';

/**
 * Formats metadata to string.
 * For example %IF(%Album,%Album - ,)%IF(%Artist,%Artist - ,)%Title
 */
export function formatTitle(file: Pick<FileInPlayer, 'metadata' | 'name'>, formatString: string) {
    const common = file?.metadata?.common;

    // simplify metadata
    const data = {
        artist: common?.artist,
        title: common?.title,
        album: common?.album,
        name: file.name,
        tracknumber: common?.track.no
            ? _.padStart(common?.track.no?.toString(), 2, '0')
            : undefined,
        year: common?.year?.toString(),
    };

    formatString = formatString.toLowerCase();

    let pos = 0;
    while (pos < formatString.length) {
        if (!(formatString[pos] === '%')) {
            pos++;
            continue;
        }
        if (formatString[pos + 1] === 'i') {
            let openParenthesisCount = 0;
            let closedParenthesisCount = 0;
            let closeParenthesisIndex = pos + 5;
            while (!(closedParenthesisCount > openParenthesisCount)) {
                closeParenthesisIndex++;
                if (formatString[closeParenthesisIndex] === '(') {
                    openParenthesisCount++;
                }
                if (formatString[closeParenthesisIndex] === ')') {
                    closedParenthesisCount++;
                }
            }

            // substring between ( and )
            const operator = formatString.slice(pos + 4, closeParenthesisIndex);

            const condition = operator.slice(0, operator.indexOf(','));

            const leftExpression = operator.slice(
                operator.indexOf(',') + 1,
                operator.lastIndexOf(',')
            );
            const rightExpression = operator.slice(operator.lastIndexOf(',') + 1);

            const operatorResult = formatTitle(file, condition)
                ? formatTitle(file, leftExpression)
                : formatTitle(file, rightExpression);

            formatString =
                formatString.slice(0, pos) +
                operatorResult +
                formatString.slice(closeParenthesisIndex + 1);

            pos += operatorResult.length;
        } else {
            const key = Object.keys(data).find((x) => formatString.startsWith(x, pos + 1));
            if (!key) {
                pos++;
                continue;
            }
            const value = data[key as keyof typeof data] ?? '';
            formatString =
                formatString.slice(0, pos) + value + formatString.slice(pos + key.length + 1);
            pos += value.length;
        }
    }
    return formatString;
}
