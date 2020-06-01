from flask import Flask, request, current_app
import os, json



app = Flask(__name__)



@app.route('/storage/presets', methods=['GET', 'POST'])
def handle_presets():
    if request.method == 'GET':
        presets_file = os.path.join(current_app.root_path, 'storage', 'presets.json')

        presets = json.load(open(presets_file))

        return presets

    elif request.method =='POST':
        presets_file = os.path.join(current_app.root_path, 'storage', 'presets.json')

        data = request.json

        with open(presets_file, 'w') as out:
            json.dump(data, out)
        return 'Success'

    else:
        return "Invalid method"