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
    const error = 'ERROR';
    let pos = 0;
    while (pos < formatString.length) {
        if (!(formatString[pos] === '%')) {
            pos++;
            continue;
        }
        if (formatString.slice(pos + 1).startsWith('if')) {
            let unclosedParenthesisCount = 1;
            let closeParenthesisIndex = pos + 'if('.length + 1;
            for (; closeParenthesisIndex < formatString.length; closeParenthesisIndex++) {
                switch (formatString[closeParenthesisIndex]) {
                    case '(':
                        unclosedParenthesisCount++;
                        break;
                    case ')':
                        unclosedParenthesisCount--;
                        break;
                }
                if (unclosedParenthesisCount === 0) {
                    break;
                } else if (closeParenthesisIndex === formatString.length - 1) {
                    return error;
                }
            }
            // substring between ( and )
            const operator = formatString.slice(pos + '%if('.length + 1, closeParenthesisIndex);
            const condition = operator.slice(0, operator.indexOf(','));
            const leftExpression = operator.slice(
                operator.indexOf(',') + 1,
                operator.lastIndexOf(',')
            );
            const rightExpression = operator.slice(operator.lastIndexOf(',') + 1);
            const conditionValue = formatTitle(file, condition);
            const operatorResult =
                conditionValue === error
                    ? error
                    : conditionValue !== ''
                    ? formatTitle(file, leftExpression)
                    : formatTitle(file, rightExpression);

            formatString =
                formatString.slice(0, pos) +
                operatorResult +
                formatString.slice(closeParenthesisIndex + 1);

            pos += operatorResult.length;
        } else {
            const searchEndFrom = pos + 1;
            let end = formatString.slice(searchEndFrom).search(/[^a-z]/);
            end = end === -1 ? formatString.length : end + searchEndFrom;
            const key = formatString.slice(pos + 1, end);
            const value = data[key as keyof typeof data] ?? error;
            formatString =
                formatString.slice(0, pos) + value + formatString.slice(pos + key.length + 1);
            pos += value.length;
        }
    }
    return formatString;
}
