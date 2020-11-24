const fs = require("fs");
const path = require("path");

console.warn("Currently not working because of base64");

const content = fs.readFileSync(path.join(__dirname, '/../flutter/build/web/main.dart.js'));
const html = `
<!DOCTYPE html>
<html>
<head>
<script async>
${content}
</script>
</body>
</html>
`

fs.writeFileSync(path.join(__dirname, '/../src/flutter.ts'), `export default atob('${Buffer.from(html).toString('base64')}')`);