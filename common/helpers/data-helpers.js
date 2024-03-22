
export const isEmptyString = str => !str?.trim();
export const isEmptyArray = arr => !arr?.length;
export const isEmptyObject = obj => !obj || !Object.keys(obj).length;
export const isEmptyNumber = num => num === null || num === undefined;

export const isEmpty = item => {
  if (Array.isArray(item)) return isEmptyArray(item);
  if (typeof item === 'string') return isEmptyString(item);
  if (typeof item === 'object') return isEmptyObject(item);
  if (typeof item === 'number') return isEmptyNumber(item);
  return true;
};

export const allEmpty = (object, properties) => {
  let empty = true; 
  properties.forEach(prop => {
    if(!isEmpty(object[prop])) empty = false;
  });
  return empty;
}

export const parseToWorkWith = data => {
  const mapItem = (item) => ({
      ...item,
      ...(isEmpty(item.skills) ? {skills: []} : (!Array.isArray(item.skills) && {skills: item.skills.split(',')})),
  });

  if(Array.isArray(data)) return data.map(item => mapItem(item));
  return mapItem(data);
}

export const parseToSave = data => {
  return data.map(item => ({
      ...item,
      ...(Array.isArray(item.skills) && {skills: item.skills.join()}),
  }))
}

export const orderByStringValue = (items, key, direction = 'asc') => {
  if(direction.toLowerCase() === 'asc') return items.sort((a, b) => a[key].toLowerCase().localeCompare(b[key].toLowerCase()));
  else return items.sort((a, b) => b[key].toLowerCase().localeCompare(a[key].toLowerCase()));
}

export const orderByIntegerValue = (items, key, direction = 'asc') => {
  if(direction.toLowerCase() === 'asc') return items.sort((a, b) => a[key] - b[key]);
  else return items.sort((a, b) => b[key] - a[key]);
}

export const filterBy = (type, value, filter) => {
  if(filter === undefined) return true;

  const filterOptions = {
    'stringEqual' : () => value.toLowerCase() === filter.toLowerCase(),
    'stringIncludes': () => value.toLowerCase().includes(filter.toLowerCase()),
    'lessThan': () => value <= filter,
    'greaterThan': () => value >= filter,
    'includesAll': () => {
      const valueToLowerCase = value.map(item => item.toLowerCase());
      const arrayFilter = !Array.isArray(filter) ? filter.split(',') : filter;
      return arrayFilter.every(f => valueToLowerCase.includes(f.toLowerCase()));
    },
  }

  const filterFunc = filterOptions[type];
  return filterFunc ? filterFunc() : true; 
}

export const filterObject = (schema, object, filters) => {
  let pass = true;

  Object.keys(schema.properties).forEach(prop => {
    const propFilters = schema.properties[prop].filters || [];
    propFilters.forEach(({ name, type }) => {
      if(!filterBy(type, object[prop], filters[name])) pass = false;
    })
  });

  return pass;
}

