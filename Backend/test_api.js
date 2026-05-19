const http = require('http');

http.get('http://localhost:3001/api/practice/questions?subject=MA24101', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const questions = parsed.questions || [];
    const qWithText = questions.find(q => q.question_latex && q.question_latex.includes('text{'));
    
    if (qWithText) {
      console.log("Raw JSON string over HTTP for question_latex:");
      const rawJson = JSON.stringify(qWithText.question_latex);
      console.log(rawJson);
      
      console.log("\nIn-memory string for question_latex:");
      console.log(qWithText.question_latex);
      
      console.log("\nDoes it contain double backslash? ", qWithText.question_latex.includes('\\\\'));
    } else {
      console.log("No question with text found in API response.");
      console.log("Returned questions count:", questions.length);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
