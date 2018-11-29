import os
import json
import nltk
import string
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.manifold import TSNE
from sklearn.manifold import MDS

# Download punkt if needed
# nltk.download('punkt')

d_obj = {}
for file in os.listdir('./data'):
    with open('./data/' + file, 'r') as f:
        d_obj[file] = f.read()

# Use this to produce the original data.json
# with open('data.json', 'w') as outfile:
#     json.dump(d_obj, outfile)

df = pd.DataFrame.from_dict(d_obj, orient='index', columns=['Text'])
v = TfidfVectorizer()
x = v.fit_transform(df['Text'])

# TSNE is good for visualization of high dimensional data
# It's primarily used for dimensionality reduction in place of methods like PCA
# Please see https://lvdmaaten.github.io/tsne/ for more information
tsne_reduced = TSNE(n_components=2).fit_transform(x.toarray())
df['tsne0'] = tsne_reduced[:, 0]
df['tsne1'] = tsne_reduced[:, 1]

mds_reduced = MDS(n_components=2).fit_transform(x.toarray())
df['mds0'] = mds_reduced[:, 0]
df['mds1'] = mds_reduced[:, 1]

# Finally output our new dataset
df.to_json('reduced-data.json', orient='index')