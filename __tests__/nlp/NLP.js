const NLP = require('../../nlp/NLP.js');

describe('Natural Language Processing Tests', () => {
  const nlp = new NLP();
  describe('Action classifier Test Accuracy', () => {
    it('Action classifier test error rate should be below 15%', async () => {
      const errorRate = nlp.tester.testNetworkByDirectory('./nlp/data/friends/test/verb-relations/',
        nlp.actionClassifier);
      expect(errorRate).toBeLessThan(0.15);
    });
  });
  describe('Direct and indirect object extraction', () => {
    const tests = {
      move: { text: 'I move to the door', directObjects: 'door', indirectObjects: '' },
      place: { text: 'I throw the key to foo', directObjects: 'key', indirectObjects: 'foo' },
      give: { text: 'I pass the key to foo', directObjects: 'key', indirectObjects: 'foo' },
      activate: { text: 'I turn on the machine', directObjects: 'machine', indirectObjects: '' },
      deactivate: { text: 'I turn off the machine', directObjects: 'machine', indirectObjects: '' },
      destroy: { text: 'I break the wall', directObjects: 'wall', indirectObjects: '' },
      attack: {
        text: 'I attack the dragon and zombies with my sword',
        directObjects: 'dragon zombies',
        indirectObjects: 'my sword',
      },
    };
    it('Direct & indirect objects should be', async () => {
      const testKeys = Object.keys(tests);
      for (let i = 0; i < testKeys.length; i++) {
        const key = testKeys[i];
        const directObjects = tests[key].directObjects;
        const indirectObjects = tests[key].indirectObjects;
        const result = nlp.chunker.getObjectsOfSentence(tests[key].text);
        expect(directObjects).toEqual(result.directObjs.join(' '));
        expect(indirectObjects).toEqual(result.indirectObjs.join(' '));
      }
    });
  });
});
