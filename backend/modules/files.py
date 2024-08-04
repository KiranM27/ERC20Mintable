import os
import json


class FileHelpers:
    def __init__(self, path_to_file: str):
        # check if the file exists
        if not os.path.exists(path_to_file):
            raise FileNotFoundError(f"File {path_to_file} not found")

        self.path_to_file = path_to_file

    def read_json(self):
        with open(self.path_to_file, "r") as file:
            return json.load(file)
