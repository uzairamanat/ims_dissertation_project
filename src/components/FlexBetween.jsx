// Styling component to space out items and reduce css code

import { Box, styled } from "@mui/material";

const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
