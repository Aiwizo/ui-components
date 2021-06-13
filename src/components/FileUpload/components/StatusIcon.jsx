import React from "react";
import PropTypes from "prop-types";
import { UPLOADING, DONE, FAIL } from "../constants";
import {
  faExclamationCircle,
  faCheck,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const iconSwitch = (status) => {
  switch (status) {
    case UPLOADING: {
      return (
        <FontAwesomeIcon
          icon={faSyncAlt}
          style={{
            color: "var(--aiwizo-application-blue)",
            animation: "rotate 1s ease-in-out infinite",
          }}
        />
      );
    }

    case DONE: {
      return (
        <FontAwesomeIcon
          icon={faCheck}
          style={{ color: "var(--aiwizo-application-green)" }}
        />
      );
    }

    case FAIL: {
      return (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          style={{ color: "var(--aiwizo-application-red)" }}
        />
      );
    }

    default: {
      return null;
    }
  }
};

export const StatusIcon = ({ status }) => (
  <span style={{ marginRight: "7px" }}>{iconSwitch(status)}</span>
);

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};
