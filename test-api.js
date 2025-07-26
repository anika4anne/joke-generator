async function testHackClubAI() {
  try {
    console.log("Testing Hack Club AI...");

    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Tell me a funny joke about programming!",
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Success! Response:", data.choices[0]?.message?.content);
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

testHackClubAI();
