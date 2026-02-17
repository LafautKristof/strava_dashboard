from utils.read_json_file import read_json_file


def get_stream(id: str):
    return read_json_file(f"streams/{id}.json")
