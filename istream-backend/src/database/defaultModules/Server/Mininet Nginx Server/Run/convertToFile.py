import base64
import re
import json
import os


def convert_base64_to_file(base64_string, output_file_path):
    try:
        # Decode the base64 string
        decoded_data = base64.b64decode(base64_string)

        # Write the decoded data to the output file
        with open(output_file_path, 'wb') as output_file:
            output_file.write(decoded_data)

        print(f"File '{output_file_path}' created successfully.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


defaultConfigPath = "{}/config.json".format(
    os.path.realpath(os.path.dirname(__file__)))

configJson = ""
if os.path.isfile(defaultConfigPath):
    with open(defaultConfigPath, "rt") as configFile:
        configJson = json.load(configFile)


# Base64 string to convert
string = configJson["file"]

# Extract the file name
file_name = 'Topology.py'

path = "{}/{}".format(
    os.path.realpath(os.path.dirname(__file__)), file_name)

# Split the string after base64
base64_string = string.split(';base64,', 1)[-1]

# Call the function to convert base64 to file
convert_base64_to_file(base64_string, path)
