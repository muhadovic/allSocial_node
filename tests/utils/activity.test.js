import test from 'ava';
import { extractHashtags } from '../../src/utils/activity';

test('extractHashtags: empty param', (t) => {
    const hashtags = extractHashtags();
    t.deepEqual(hashtags, []);
});

test('extractHashtags: empty string', (t) => {
    const hashtags = extractHashtags('');
    t.deepEqual(hashtags, []);
});

test('extractHashtags: string without #', (t) => {
    const hashtags = extractHashtags('Lorem Ipsum is simply dummy text of the printing and typesetting industry. ');
    t.deepEqual(hashtags, []);
});

test('extractHashtags: basic #', (t) => {
    const hashtags = extractHashtags('Lorem #Ipsum is #simply_dummy text #of the printing and typesetting industry.');
    t.deepEqual(hashtags, ['hashtag:ipsum', 'hashtag:simply_dummy', 'hashtag:of']);
});

test('extractHashtags: duplicated #', (t) => {
    const hashtags = extractHashtags('Lorem #Ipsum is #ipsum text of the #printing and #printing industry.');
    t.deepEqual(hashtags, ['hashtag:ipsum', 'hashtag:printing']);
});

test('extractHashtags: complicated #', (t) => {
    const hashtags = extractHashtags(
        '#allsocial, #allsocial1! #allsocial_x #allsocial_x1! (#allsocial2)[#allsocial_3] [#allsocial_4)',
    );
    t.deepEqual(hashtags, [
        'hashtag:allsocial',
        'hashtag:allsocial1',
        'hashtag:allsocial_x',
        'hashtag:allsocial_x1',
        'hashtag:allsocial2',
        'hashtag:allsocial_3',
        'hashtag:allsocial_4',
    ]);
});
