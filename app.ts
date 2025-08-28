import express from "express";
import type { Request, Response } from "express";


const app = express();
app.use(express.json());

interface InputItem {
    id: number;
    name: string;
    category: string;
    sub_category: string;
}

interface ReformattedData {
    [category: string]: {
        [subCategory: string]: {
            id: number;
            name: string;
        }[];
    };
}

function reformatData(data: InputItem[]): ReformattedData {
    const result: ReformattedData = {};

    for (const item of data) {
        const { id, name, category, sub_category } = item;

        if (!result[category]) {
            result[category] = {};
        }

        if (!result[category][sub_category]) {
            result[category][sub_category] = [];
        }

        result[category][sub_category].push({ id, name });
    }

    return result;
}

app.post("/", (req: Request, res: Response) => {
    try {
        const data: InputItem[] = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Input must be an array" });
        }

        const reformatted = reformatData(data);
        return res.json(reformatted);

    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

// Hanya izinkan POST, tolak method lain
app.all("/reformat", (_req: Request, res: Response) => {
    return res.status(405).json({ error: "Only POST requests are allowed" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
