import { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "../../pdf-worker"; // Make sure this path points to the actual worker file

export default function ExtractPdfText({ file, onExtractedText }) {
  useEffect(() => {
    if (!file || file.type !== "application/pdf") {
      onExtractedText("");
      return;
    }

    const extractTextFromPDF = async () => {
      try {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const typedArray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str).join(" ");
            fullText += strings + "\n";
          }

          console.log("✅ Extracted PDF text:", fullText);
          onExtractedText(fullText);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("❌ Failed to extract PDF text:", error);
        onExtractedText("");
      }
    };

    extractTextFromPDF();
  }, [file, onExtractedText]);

  return null;
}
