const OCR_SPACE_API = "https://api.ocr.space/parse/image";
const OCR_SPACE_KEY = "K85289644388957"; // free demo key (25k req/month)

interface OcrMedicine {
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions: string;
}

interface OcrResult {
    rawText: string;
    diagnosis: string;
    advice: string;
    medicines: OcrMedicine[];
}

async function extractTextFromImage(imageUrl: string): Promise<string> {
    const formData = new URLSearchParams();
    formData.append("url", imageUrl);
    formData.append("apikey", OCR_SPACE_KEY);
    formData.append("isOverlayRequired", "false");
    formData.append("OCREngine", "2"); // engine 2 is better for handwritten

    const response = await fetch(OCR_SPACE_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
    });

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage?.[0] || "OCR processing failed");
    }

    const parsedResults = data.ParsedResults;
    if (!parsedResults || parsedResults.length === 0) {
        throw new Error("No text found in image");
    }

    return parsedResults.map((r: { ParsedText: string }) => r.ParsedText).join("\n");
}

function parsePrescriptionText(rawText: string): OcrResult {
    const lines = rawText
        .split(/\r?\n/)
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0);

    let diagnosis = "";
    let advice = "";
    const medicines: OcrMedicine[] = [];

    // common medicine keywords to detect medicine lines
    const medicineKeywords = [
        "tablet", "capsule", "syrup", "drop", "injection", "mg", "ml",
        "tab", "cap", "inj", "susp", "syp", "ext", "sol", "cream", "ointment",
        "powder", "gel", "spray", "inhaler",
    ];

    const freqKeywords = [
        "once daily", "twice daily", "thrice daily", "three times",
        "four times", "every 6", "every 8", "every 12", "bd", "tds", "qid",
        "od", "daily", "morning", "night", "bedtime", "before meal", "after meal",
        "before food", "after food", "with meal", "stat", "prn", "as needed",
        "1x", "2x", "3x", "4x",
    ];

    const durationKeywords = [
        "days", "day", "weeks", "week", "months", "month", "for",
        "x 7", "x 14", "x 30",
    ];

    // Try to find diagnosis line (usually first few lines)
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i].toLowerCase();
        if (
            line.includes("diagnosis") ||
            line.includes("d/d") ||
            line.includes("dd") ||
            line.includes("condition") ||
            line.includes("complaint")
        ) {
            diagnosis = lines[i].replace(/^(diagnosis|d\/d|dd|condition|complaint)\s*[:\-]?\s*/i, "").trim();
            break;
        }
    }

    // If no diagnosis found, use first non-medicine line
    if (!diagnosis && lines.length > 0) {
        const nonMedicineLine = lines.find(
            (l) => !medicineKeywords.some((k) => l.toLowerCase().includes(k))
        );
        if (nonMedicineLine) {
            diagnosis = nonMedicineLine;
        }
    }

    // Try to find advice line
    for (const line of lines) {
        const lower = line.toLowerCase();
        if (
            lower.includes("advice") ||
            lower.includes("instructions") ||
            lower.includes("note") ||
            lower.includes("follow up") ||
            lower.includes("follow-up") ||
            lower.includes("return") ||
            lower.includes("review")
        ) {
            advice = line.replace(/^(advice|instructions|note|follow[- ]up|return|review)\s*[:\-]?\s*/i, "").trim();
            break;
        }
    }

    // Extract medicines
    for (const line of lines) {
        const lower = line.toLowerCase();
        const isMedicineLine = medicineKeywords.some((k) => lower.includes(k));

        if (isMedicineLine) {
            // try to extract medicine name (first part before dosage info)
            let name = line;
            let dosage = "";
            let frequency = "";
            let duration = "";
            let instructions = "";

            // extract dosage (e.g., 500mg, 5mg, 10ml)
            const dosageMatch = line.match(/(\d+\s*(?:mg|ml|mcg|g|iu|%))/i);
            if (dosageMatch) {
                dosage = dosageMatch[1];
            }

            // extract frequency
            for (const fk of freqKeywords) {
                if (lower.includes(fk)) {
                    const freqMap: Record<string, string> = {
                        "once daily": "Once daily",
                        "twice daily": "Twice daily",
                        "thrice daily": "Three times daily",
                        "three times": "Three times daily",
                        "four times": "Four times daily",
                        "every 6": "Every 6 hours",
                        "every 8": "Every 8 hours",
                        "every 12": "Every 12 hours",
                        "bd": "Twice daily",
                        "tds": "Three times daily",
                        "qid": "Four times daily",
                        "od": "Once daily",
                        "daily": "Once daily",
                        "morning": "Once daily",
                        "night": "Once daily",
                        "bedtime": "Once daily",
                        "before meal": "Before meals",
                        "after meal": "After meals",
                        "before food": "Before meals",
                        "after food": "After meals",
                        "with meal": "With meals",
                        "stat": "As needed",
                        "prn": "As needed",
                        "as needed": "As needed",
                        "1x": "Once daily",
                        "2x": "Twice daily",
                        "3x": "Three times daily",
                        "4x": "Four times daily",
                    };
                    frequency = freqMap[fk] || fk;
                    break;
                }
            }

            // extract duration
            for (const dk of durationKeywords) {
                if (lower.includes(dk)) {
                    const durMatch = line.match(
                        /(\d+\s*(?:days?|weeks?|months?|for\s+\d+))/i
                    );
                    if (durMatch) {
                        duration = durMatch[1];
                    } else {
                        duration = dk;
                    }
                    break;
                }
            }

            // extract quantity (e.g., "x10", "10 tab", "#10")
            const qtyMatch = line.match(/[x#]\s*(\d+)|(\d+)\s*(?:tab|cap|ml|unit)/i);
            if (qtyMatch) {
                const qty = qtyMatch[1] || qtyMatch[2];
                if (qty) {
                    // remove medicine name part to get cleaner name
                }
            }

            // clean medicine name: remove dosage, frequency, duration parts
            name = line
                .replace(/(\d+\s*(?:mg|ml|mcg|g|iu|%))/gi, "")
                .replace(
                    /(?:once daily|twice daily|thrice daily|three times|four times|every \d+ hours|bd|tds|qid|od|daily|morning|night|bedtime|before meal|after meal|before food|after food|with meal|stat|prn|as needed)/gi,
                    ""
                )
                .replace(/(\d+\s*(?:days?|weeks?|months?))/gi, "")
                .replace(/[x#]\s*\d+/gi, "")
                .replace(/\d+\s*(?:tab|cap|ml|unit)/gi, "")
                .replace(/[,;|/\\]+/g, " ")
                .trim();

            if (name.length < 2) {
                name = line.trim();
            }

            medicines.push({
                name,
                dosage,
                quantity: qtyMatch ? parseInt(qtyMatch[1] || qtyMatch[2] || "10") : 10,
                frequency,
                duration,
                instructions,
            });
        }
    }

    // if no medicines found, try to extract at least one from any line
    if (medicines.length === 0 && lines.length > 0) {
        for (const line of lines) {
            if (line.length > 3 && line.length < 100) {
                medicines.push({
                    name: line,
                    dosage: "",
                    quantity: 10,
                    frequency: "",
                    duration: "",
                    instructions: "",
                });
                break;
            }
        }
    }

    return { rawText, diagnosis, advice, medicines };
}

const extractPrescription = async (imageUrl: string): Promise<OcrResult> => {
    const rawText = await extractTextFromImage(imageUrl);
    return parsePrescriptionText(rawText);
};

export const OcrService = {
    extractPrescription,
};
