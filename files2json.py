import os
import json
d_obj = {}
for file in os.listdir('./data'):
    with open('./data/'+file,'r') as f:
        print(file)
        d_obj[file] = f.read()
with open('data.json', 'w') as outfile:
    json.dump(d_obj, outfile)