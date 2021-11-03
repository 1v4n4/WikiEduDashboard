import '../testHelper';
import { formatOption, url, trackedWikisMaker } from '../../app/assets/javascripts/utils/wiki_utils';


describe('formatOption', () => {
  test(
    'formats wiki data',
    () => {
      const wikiData = {
        language: 'en',
        project: 'wikipedia'
      };
      const result = formatOption(wikiData);
      expect(result).toStrictEqual({ label: 'en.wikipedia.org', value: '{"language":"en","project":"wikipedia"}' });
    }
  );
});

describe('url', () => {
  test(
    'returns url format',
    () => {
      const wikiData = {
        language: 'en',
        project: 'wikipedia'
      };
      const result = url(wikiData);
      expect(result).toStrictEqual('en.wikipedia.org');
    }
  );
  test(
    'if no language specified, returns www subdomain',
    () => {
      const wikiData = {
        language: null,
        project: 'wikipedia'
      };
      const result = url(wikiData);
      expect(result).toStrictEqual('www.wikipedia.org');
    }
  );
});

describe('trackedWikisMaker', () => {
  test(
    'if course includes wikis data, creates an array of tracked Wikis objects',
    () => {
      const course = {
        wikis: [{
          language: 'en',
          project: 'wikipedia'
        }, {
          language: null,
          project: 'wikipedia'
        }]
      };
  const result = trackedWikisMaker(course);
  expect(result).toStrictEqual([{ label: 'en.wikipedia.org', value: '{"language":"en","project":"wikipedia"}' }, { label: 'www.wikipedia.org', value: '{"language":"www","project":"wikipedia"}' }]);
    }
  );
  test(
    'if course does not include wikis data, returns an empty array',
    () => {
      const course = 'no Wikis here';
      const result = trackedWikisMaker(course);
      expect(result).toStrictEqual([]);
    }
  );
});
