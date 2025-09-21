import React from "react";

export default function LoginInput({ type, text}) {
    return (<input type={type} placeholder={text} />);
}