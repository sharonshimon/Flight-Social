import React from "react";

export default function LoginInput({ type, text, value, onChange, name }) {
    return (
        <input 
            type={type} 
            placeholder={text}
            value={value || ''}
            onChange={onChange}
            name={name}
            className="login-input"
            required
        />
    );
}