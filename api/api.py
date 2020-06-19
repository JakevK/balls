"""
api.py

receives requests
reads and writes storage
returns json response
"""



# imports!
from flask import Flask, request, current_app
import os, json



# create the app variable
app = Flask(__name__)



# define the endpoint for handling the storage of preset game types
@app.route('/storage/presets', methods=['GET', 'POST'])
def handle_presets():
    # get the filepath where presets are stored
    presets_file = os.path.join(current_app.root_path, 'storage', 'presets.json')

    if request.method == 'GET': # read storage
        # retrieve existing preset data from json file
        presets = json.load(open(presets_file))

        # return the json data as a response
        return presets


    elif request.method =='POST': # write to storage
        # read the json data sent through the post request
        data = request.json

        # write the new presets to the presets json file
        with open(presets_file, 'w') as out:
            json.dump(data, out)

        # show that it all worked!
        return data

    else:
        # not a post request or a get request so not supported
        return 'Invalid method'