"use client";
import { createContext } from "react";


export const SpotifyContext = createContext<{
            code: string | null;
            state: string | null;
            accessToken: string | null;
            refreshToken: string | null;
            expiresIn: number | null;
            scope: string;
        }>({
            code: null,
            state: null,
            accessToken: null,
            refreshToken: null,
            expiresIn: null,
            scope: ''});