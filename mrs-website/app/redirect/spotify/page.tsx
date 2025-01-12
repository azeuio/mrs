"use client";
import { SpotifyContext } from "@/app/contexts/spotify";
import { redirect, useSearchParams } from "next/navigation";
import { useContext } from "react";

export default function Spotify() {
    const search = useSearchParams();
    const params = new URLSearchParams(search);

    const code = params.get('code');
    const state = params.get('state');
    
    const context = useContext(SpotifyContext);
    context.code = code;
    context.state = state;

    // close the window
    window.opener.postMessage({ code, state }, 'http://localhost:3000');
    window.close();
    return null;
}