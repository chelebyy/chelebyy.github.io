import { describe, expect, it } from 'vitest';
import { searchFold } from './format';

describe('searchFold', () => {
    it('matches Latin capital I in any UI language', () => {
        expect(searchFold('REST API and CLI')).toContain(searchFold('api'));
        expect(searchFold('AI agents')).toContain(searchFold('ai'));
    });

    it('treats Turkish dotted and dotless i as the same letter', () => {
        expect(searchFold('Araç Kiralama İŞLEMLERİ')).toContain(searchFold('işlemleri'));
        expect(searchFold('kitaplık')).toContain(searchFold('KITAPLIK'));
    });
});
