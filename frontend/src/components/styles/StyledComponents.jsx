import { styled } from "@mui/material"
import { Link as LinkComponent } from "react-router-dom"
import { grayColor } from "../../constants/color"

export const VisuallyHiddenInput = styled("input")({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
})

export const Link = styled(LinkComponent)`
    text-decoration: none;
    color: black;
    padding: 1rem;
    &:hover {
        background-color: rgba(0,0,0,0.1);
    }
`

export const InputBox = styled("input")`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 3rem;
    borderRadius: 1.5rem;
    backgroundColor: ${grayColor};
`