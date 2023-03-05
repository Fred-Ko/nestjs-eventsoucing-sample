import yaml

out=''

def write_env_variables(f, data, section_name='',path=''):  
    global out
    path = f'{path}//{section_name}'

    split_path = path[4:].split('//')
    out += ('\n')
    for i in range(len(split_path)):
        out += f'# {"  "*i}{split_path[i].split("_")[-1]}\n'

    for key, value in data.items():
        if isinstance(value, dict):
            # nested section
            section_name = f"{section_name}_{key.upper()}" if section_name else key.upper()
            write_env_variables(f, value, section_name,path)
        else:
            # leaf node
            env_var_name = f"{section_name.upper()}_{key.upper()}"
            if isinstance(value, bool):
                env_var_value = str(value).lower()
            else:
                env_var_value = str(value)
            out += (f"{env_var_name}={env_var_value}\n")        

with open('./.env.yaml', 'r') as f:
    data = yaml.safe_load(f)

with open('./.env', 'w') as f:
    write_env_variables(f, data)
    out_lines = out.split('\n')
    out = '\n'.join(out_lines[8:])
    f.write(out)
