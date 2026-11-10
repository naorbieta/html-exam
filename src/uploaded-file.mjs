export function isUploadedFile(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    typeof value.name === 'string' && value.name.length > 0 && value.name.length <= 255 && !/[\\/\x00-\x1f]/.test(value.name) &&
    typeof value.content === 'string' && Object.keys(value).every(key => ['name','content'].includes(key)) && JSON.stringify(value).length <= 20000;
}
