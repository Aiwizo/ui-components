import React, { useReducer } from "react";
import { reducer } from "./store/reducer";
import { FileList } from "./components/FileList";
import { useFileUpload } from "./hooks/useFileUpload";
import { useFileUploadBatchControl } from "./hooks/useFileUploadBatchControl";
import { initialState } from "./store/initialState";
import { appendFiles } from "./store/appendFiles";
import isDefined from "@codewell/is-defined";
import styled from "styled-components";
import { FileDropZone } from "../FileInput/DropZone";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  border: 1px solid var(--aiwizo-application-primary-border-blue);
  border-radius: var(--aiwizo-application-border-radius-primary);
  background-color: #ffffff;
`;

export const FileUpload = ({
  url,
  onUploadResponse,
  onRowClick,
  requestBatchSize = 1,
  requestOptions = {},
  loglevel = "",
}) => {
  if (isDefined(requestOptions.body) && isDefined(requestOptions.form)) {
    throw new Error(
      "Specifying both requestOptions.body and requestOptions.form is a contradiction.",
    );
  }
  if (isDefined(requestOptions.form)) {
    if (Array.isArray(requestOptions.form)) {
      throw new Error("requestOptions.form is an array.");
    }
    if (typeof requestOptions.form !== "object") {
      throw new Error("requestOptions.form is not an object.");
    }
    Object.keys(requestOptions.form).forEach((key) => {
      if (typeof requestOptions.form[key] === "object") {
        throw new Error(
          `requestOptions.form[${key}]: Nested form not supported yet.`,
        );
      }
    });
  }

  const [state, dispatch] = useReducer(reducer({ loglevel }), {
    ...initialState,
    requestBatchSize,
  });
  useFileUploadBatchControl(state, dispatch);
  useFileUpload(state, dispatch, url, onUploadResponse, requestOptions);

  const borderRadius =
    "calc(var(--aiwizo-application-border-radius-primary) - 1px)";

  const dropzoneStyles = {
    border: "none",
    borderTopRightRadius: borderRadius,
    borderTopLeftRadius: borderRadius,
    borderBottomRightRadius: state.files.length > 0 ? 0 : borderRadius,
    borderBottomLeftRadius: state.files.length > 0 ? 0 : borderRadius,
  };

  return (
    <Wrapper>
      <FileDropZone
        onChange={({ files }) => dispatch(appendFiles(files))}
        styles={dropzoneStyles}
      />
      <FileList {...state} onRowClick={onRowClick} dispatch={dispatch} />
    </Wrapper>
  );
};

FileUpload.propTypes = {
  url: PropTypes.string.isRequired,
  onUploadResponse: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  requestBatchSize: PropTypes.number,
  requestOptions: PropTypes.shape(),
  loglevel: PropTypes.string,
};
