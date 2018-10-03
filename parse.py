from json import dump
import re

with open("functions.c") as f:
    lines = [x.strip() for x in f.readlines()]

regex = re.compile(r'(\w+) ([\w.]+)\((.*)\)')

class TemplateSyntaxError(Exception):
    ...

def error(line):
    raise TemplateSyntaxError("Invalid syntax on line \"{}\"".format(line))

def function(line):
    try:
        return_type, name, arg_list = regex.match(line).groups()
        args = re.split(r', ?', arg_list)
    except AttributeError:
        error(line)

    args = list(filter(lambda x: x, args))

    f = {}

    f['function'] = name
    if not return_type == 'void':
        f['returns'] = {'type': return_type}
    f['tags'] = []
    f['arguments'] = []
    f['desc'] = []

    for arg in args:
        f['arguments'].append({})
        f['arguments'][-1]['type'] = arg.split()[0]
        f['arguments'][-1]['name'] = arg.split()[1]

    return f


print()
print("Parsing:")
functions = []
for line in lines:
    if not line:
        continue
    if not line.startswith('//'):
        functions.append(function(line))
        print()
        print(" .. " + functions[-1]['function'], end=': ')
    else:
        line = line[3:]
        if line.startswith(':'):
            descriptor = line.split(':')[1].split()
            trailing = ': '.join(line.split(': ')[1:])
            key = descriptor[0]
            if key == 'param':
                arg = descriptor[1]
                print(arg, end=' ')
                arg_dict = [x for x in functions[-1]['arguments'] if x['name'] == arg][0]
                index = functions[-1]['arguments'].index(arg_dict)
                if len(descriptor) > 2 and descriptor[2] == 'opt':
                    functions[-1]['arguments'][index]['optional'] = True
                functions[-1]['arguments'][index]['desc'] = trailing
            elif key == 'tags':
                functions[-1]['tags'] = trailing.split()
            elif key == 'week':
                functions[-1]['week'] = int(trailing)
            elif key == 'returns':
                if 'returns' not in functions[-1]:
                    error('// ' + line)
                functions[-1]['returns']['desc'] = trailing
        else:
            functions[-1]['desc'].append({'type': 'text', 'content': line})
print()
with open('reference.json', 'w') as f:
    dump({'functions': functions}, f)
