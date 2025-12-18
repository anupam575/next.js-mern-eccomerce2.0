"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function UIPagination({ totalPages = 1, page = 1, onChange }) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={page}
        variant="outlined"
        color="primary"
        onChange={onChange}
      />
    </Stack>
  );
}

export default UIPagination;
