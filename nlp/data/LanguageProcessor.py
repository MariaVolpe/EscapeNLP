from nltk.corpus import wordnet
from nltk.corpus import wordnet_ic
import sys

# a list of valid actions for EscapeRoom
actions = ['walk.v.01', 'take.v.01', 'look.v.01', 'give.v.01', 'break.v.01', 'attack.v.01', 'jump.v.01']

w1 = wordnet.synset('lion.n.01')
print ('lion')
print(w1.path_similarity(wordnet.synset('tiger.n.01')))

w1 = wordnet.synset('grab.v.01')
# print (w1[0].lemmas()[0].name())
# print (w2[0].examples())   
for a in actions:
    print(a)
    print(w1.path_similarity(wordnet.synset(a)))
print ('---------------------------------------')
for a in actions:
    print(a)
    print(w1.lch_similarity(wordnet.synset(a)))
print ('---------------------------------------')
for a in actions:
    print(a)
    print(w1.wup_similarity(wordnet.synset(a)))
print ('---------------------------------------')
# for a in actions:
#     print(a)
#     print(w1.res_similarity(wordnet.synset(a), wordnet_ic.ic(wordnet.synset(a))))
# print ('---------------------------------------')
# for a in actions:
#     print(a)
#     print(w1.jcn_similarity(wordnet.synset(a)))
# print ('---------------------------------------')
# for a in actions:
#     print(a)
#     print(w1.lin_similarity(wordnet.synset(a)))

