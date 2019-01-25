const convertName = name => (name.charAt(0).toUpperCase() + name.slice(1)).trim();
const sanitizer = text => text.replace(/([@#$%&=<>*/\\])/g, '').trim();

export { convertName, sanitizer };
