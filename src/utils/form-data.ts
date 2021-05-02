export default function objectToFormData(
  obj: Object,
  rootName: string = '',
  ignoreList: Array<any> = [],
) {
  var formData = new FormData();
  function appendFormData(data, root) {
    if (!ignore(root)) {
      root = root || '';
      if (data instanceof File) {
        formData.append(root, data);
      } else if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          appendFormData(data[i], root + '[' + i + ']');
        }
      } else if (typeof data === 'object' && data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '[' + key + ']');
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined' && data !== '') {
          formData.append(root, data);
        }
      }
    }
  }

  function ignore(root) {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some(function (x) {
        return x === root;
      })
    );
  }

  appendFormData(obj, rootName);

  return formData;
}
