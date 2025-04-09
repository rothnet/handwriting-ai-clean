import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function HandwritingAnalyzer() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image");

    const extractedText = "[simulated text from handwriting]"; // בהמשך יוחלף בתוצאה מ-OCR

    const prompt = `
This is a handwriting analysis request.
Details:
Age: ${age}
Gender: ${gender}
Status: ${status}
Custom Notes: ${customPrompt}

Handwritten Text:
${extractedText}

Please analyze this person's personality and traits based on their handwriting.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // או gpt-3.5-turbo
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const gptOutput = data.choices?.[0]?.message?.content || "No result from GPT.";
    setResult(gptOutput);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Handwriting AI Analyzer</h1>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Input
              placeholder="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <Input
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <Textarea
            placeholder="Write here any specific requests, questions, or focus points for the analysis."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />

          <Button onClick={handleSubmit} className="w-full">Analyze Handwriting</Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-6 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
            {result}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
