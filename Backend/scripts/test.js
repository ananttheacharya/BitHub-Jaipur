fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({
        language: 'c', 
        version: '*', 
        files: [{name: 'main.c', content: '#include <stdio.h>\nint main(){printf("Hello");return 0;}'}], 
        stdin: '', 
        compile_timeout: 10000, 
        run_timeout: 5000
    })
}).then(r => r.json()).then(console.log).catch(console.error);
