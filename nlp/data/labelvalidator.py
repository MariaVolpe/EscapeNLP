import sys
import pandas as pd
#from nltk.tokenize import sent_tokenize, word_tokenize
#import warnings
#import gensim
#from gensim import Word2Vec

df = pd.read_csv(sys.argv[1])
validWordUses = {}
# iterate over every column and validate entries
for column in df:
    uses = []
    for entry in df[column]:
        if entry == 'NA':
            break
        #x = input('Valid?' + column + ' -> ' + entry + ' y || n: ')
        #if x == 'y' or x == 'v':
        uses.append(entry)
    validWordUses[column] = uses

################## Create new dataset ##############################
rowMap = {}
colMap = {}
dataMatrix = []
# get the row dimension for dataMatrix
maxColumnLength = 0
header = []
colIndex = 0
for column in df:
    colMap[column] = colIndex
    rowMap[column] = 1
    colIndex += 1
    header.append(column)
    if maxColumnLength < len(validWordUses[column]):
        maxColumnLength = len(validWordUses[column])
dataMatrix.append(header) # add the header as first element
for i in range(maxColumnLength): # initialize empty rows for population
    row = []
    for j in range(len(header)):
        row.append('')
    dataMatrix.append(row)
for column in df:
    for entry in validWordUses[column]:
        r = rowMap[column]
        rowMap[column] += 1
        c = colMap[column]
        dataMatrix[r][c] = entry
#print(dataMatrix)
#pd.to_csv('./data/'+sys.argv[1])
