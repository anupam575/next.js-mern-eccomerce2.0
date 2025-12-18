"use client";

import * as React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

function SelectBasic({ value, onChange, options = [], disabled = false }) {
  return (
    <Select
      value={value || ""}
      onChange={(_, val) => onChange(val)}
      placeholder="Select..."
      disabled={disabled}
    >
      {options.map((item, idx) => {
        const optionValue = item?.id ?? item?.value ?? item ?? "";
        const optionLabel =
          item?.name ?? item?.label ?? item?.title ?? item?.status ?? item ?? "Unknown";

        return (
          <Option key={idx} value={optionValue}>
            {optionLabel}
          </Option>
        );
      })}
    </Select>
  );
}

export default SelectBasic;
