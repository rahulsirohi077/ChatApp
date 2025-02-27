import { Grid2, Skeleton, Stack } from "@mui/material";
import React from "react";

export const LayoutLoader = () => {
  return (
    <Grid2 container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
        <Grid2
          item
          size={{ sm: 4, md: 3 }}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}
        >
          <Skeleton variant="rectangular" height="100vh" />
        </Grid2>
        <Grid2 item  size={{ xs: 12, sm: 8, md:5, lg:6 }} height={"100%"}>
          <Stack spacing={"1rem"}>
            {
                Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={"5rem"} />
                ))
            }
            </Stack>
        </Grid2>
        <Grid2
          item
          size={{ md: 4, lg: 3 }}
          sx={{
            display: { xs: "none", md: "block" },
          }}
          height={"100%"}
        >
          <Skeleton variant="rectangular" height="100vh" />
        </Grid2>
      </Grid2>
  );
};
