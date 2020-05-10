
import re
import itertools
import os
import json

reInclude = re.compile('^\s*#\s*include\s*[<"]\s*(?P<header_file>\S+)\s*[>"].*$')
def get_includes(path):
    with open(path) as src_file:
        for l in src_file.read().splitlines():
            m = reInclude.match(l)
            if m:
                yield m.group("header_file")


id_gen = itertools.count(0)
def create_unique_id():
    return id_gen.next()

class Node:
    def __init__(self, filename):
        self.id = create_unique_id()
        self.filename = filename
        self.path = ""

nodes = []
def get_node(f):
    for n in nodes:
        if n.filename == f:
            return n
    n = Node(f)
    nodes.append(n)
    return n

def get_links(path, f):
    source_node = get_node(f)
    source_node.path = path
    for included_by in get_includes(path + "/" + f):
        target_node = get_node(included_by)
        yield (source_node.id, target_node.id)

links = []

path = "."
for root, dirs, files in os.walk(path):
    for f in files:
        if f.endswith(".hpp") or f.endswith(".cpp"):
            links += list( get_links(root, f) )

for n in nodes:
    print "{}:{} {}".format(n.id, n.filename, "[" + n.path + "]" if n.path else "")

graph = { 'nodes': [{'id': n.id, 'text': n.filename, 'path': n.path} for n in nodes],
        'links': [{'id': i, 'source': l[0], 'target': l[1]} for i, l in enumerate(links)] }

s = json.dumps(graph, indent=2, sort_keys=True)
with open("includes.json", "w") as json_file:
    json_file.write(s)

