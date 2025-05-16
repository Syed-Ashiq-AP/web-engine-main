"use client";
import React, { useEffect, useRef, useState } from "react";

export const Preview = ({ id, page }: { id: string; page?: string }) => {
  const didMount = useRef<boolean>(false);
  const previewRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (didMount.current || !previewRef.current) return;
    didMount.current = true;
    const fetchPreview = async () => {
      const req = await fetch(
        `/api/projects/preview?id=${id}${page ? `&page=${page}` : ""}`
      );
      if (req.ok) {
        const res = await req.json();
        if (res.success) {
          if (!previewRef.current) return;
          const { html, js, styles } = res.data;
          const SRC = `
                <html>
                    <head>
                        <style>
                            ${styles}
                        </style>
                    </head>
                    <body>
                    ${html
                      .replaceAll('contenteditable="true"', "")
                      .replaceAll("we-active-element", "")}
                    </body>
                    <script>
                    ${js}
                    </script>
                </html>
            `;
          previewRef.current.srcdoc = SRC;
        }
      }
    };
    fetchPreview();
  }, []);
  return <iframe className="w-dvw h-dvh" ref={previewRef}></iframe>;
};
