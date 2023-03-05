import yaml
from collections import OrderedDict

class OrderedSet:
    def __init__(self, items=None):
        self.dict = OrderedDict()
        if items is not None:
            for item in items:
                self.add(item)

    def __len__(self):
        return len(self.dict)

    def __contains__(self, item):
        return item in self.dict

    def add(self, item):
        if item == '':
            return
        self.dict[item] = None

    def remove(self, item):
        del self.dict[item]

    def __iter__(self):
        return iter(self.dict)

out=''
example=''

def write_env_variables(f, data, section_name='',path=OrderedSet()):
    global out,example
    path.add(section_name.split('_')[-1])

    split_path = list(path)
    out += ('\n')
    example += ('\n')

    for i,v in enumerate(list(path)):
        out += f'# {"  "*i}{split_path[i].split("_")[-1]}\n'
        example += f'# {"  "*i}{split_path[i].split("_")[-1]}\n'

    basekey = "_".join(list(path))

    for key, value in data.items():
        if isinstance(value, dict):
            # nested section
            section_name = f"{basekey.upper()}_{key.upper()}" if section_name else key.upper()
            write_env_variables(f, value, section_name,OrderedSet(path))
        else:
            # leaf node
            env_var_name = f"{section_name.upper()}_{key.upper()}"
            if isinstance(value, bool):
                env_var_value = str(value).lower()
            else:
                env_var_value = str(value)
            out += (f"{env_var_name}={env_var_value}\n")
            example += (f"{env_var_name}=\n")

with open('./.env.yaml', 'r') as f:
    data = yaml.safe_load(f)

write_env_variables(f, data)
with open('./.env', 'w') as f:
    out_lines = out.split('\n')
    out = '\n'.join(out_lines[4:])
    f.write(out)

with open('./.env.example', 'w') as f:
    out_lines = example.split('\n')
    out = '\n'.join(out_lines[4:])
    f.write(out)
