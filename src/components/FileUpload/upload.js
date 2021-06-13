import axios from "axios";
import isDefined from "@codewell/is-defined";
import { fileToBase64 } from "../../core/fileToBase64";

const getData = (requestOptions, file) =>
  new Promise((resolve, reject) => {
    if (isDefined(requestOptions.body)) {
      return fileToBase64(file)
        .then((base64File) => {
          resolve({
            ...requestOptions.body,
            file: {
              ...requestOptions.body.file,
              data: base64File.split(",")[1],
              format: file.type,
              name: file.name,
              size: file.size,
            },
          });
        })
        .catch(reject);
    } else {
      const data = new FormData();
      data.append("file", file);

      if (isDefined(requestOptions.form)) {
        Object.keys(requestOptions.form).forEach((key) => {
          data.append(key, requestOptions.form[key]);
        });
      }

      return resolve(data);
    }
  });

const getHeaders = (requestOptions) => {
  if (isDefined(requestOptions.body)) {
    return {
      "Content-Type": "application/json",
      ...requestOptions.headers,
    };
  }

  return {
    "Content-Type": "multipart/form-data",
    ...requestOptions.headers,
  };
};

export const upload = (url, onUploadProgress, requestOptions) => (file) =>
  getData(requestOptions, file).then((data) =>
    axios({
      method: "post",
      url,
      data,
      onUploadProgress,
      headers: getHeaders(requestOptions),
    }),
  );
