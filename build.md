## How to build

- Run flutter build in ./flutter
- Paste the build ./flutter/build/web/main.dart.js in to the script tag of the ./flutter/build/web/index.html and remove the src from the tag
- Copy the whole file and convert it into base64 (watch out that the whole file is converted)
- Paste the base64 string into the ./src/flutter.ts file inside the atob("...")
- Run npm build


This process should eventually be automated 