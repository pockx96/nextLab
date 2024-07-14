"use client";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { useState } from "react";
import { api } from "~/trpc/react";

export function UserCrud() {


  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <h1>hola mundo</h1>
      </body>
    </html>
  );
}
