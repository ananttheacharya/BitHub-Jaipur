fetch('https://ce.judge0.com/submissions?wait=true', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({
        source_code: '#include <stdio.h>\nint main(){printf("Hello");return 0;}', 
        language_id: 50
    })
}).then(r => r.json()).then(console.log).catch(console.error);
