# SpatialJS Core

SpatialJS Core is a powerful library for building spatial applications for the open web. Leveraging React Three Fiber (R3F), it enables developers to create fully immersive 3D experiences. With SpatialJS, you can easily construct and manage spatial user interfaces, making it an ideal toolkit for developing next-generation web applications, VR/AR experiences, and spatial computing platforms.

<p align="center">
  <img src="assets/main.png" width="500" alt="SpatialJS Logo" />
</p>

<p align="center">
  <a href="https://npmjs.com/package/@spatialjs/core" target="_blank">
    <img src="https://img.shields.io/npm/v/@spatialjs/core?style=flat&colorA=000000&colorB=000000" alt="NPM" />
  </a>
  <a href="https://npmjs.com/package/@spatialjs/core" target="_blank">
    <img src="https://img.shields.io/npm/dt/@spatialjs/core.svg?style=flat&colorA=000000&colorB=000000" alt="NPM" />
  </a>
  <a href="https://twitter.com/spatialmatty" target="_blank">
    <img src="https://img.shields.io/twitter/follow/spatialmatty?label=%40spatialmatty&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Twitter" />
  </a>
  <a href="https://discord.gg/tKNwtpDVJn" target="_blank">
    <img src="https://img.shields.io/discord/1124026138465939506?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000" alt="Discord" />
  </a>
</p>

## Features

- Create and manage 3D windows in a spatial environment
- Intuitive React components for building 3D UIs
- Flexible window management with tiling, focusing, and minimizing
- Support for VR/AR experiences
- Easy integration with React Three Fiber

## What does Spatialjs do?

| Simple Example for a room with a music player | ![render of the above code](./assets/spatialjs-demo.gif) |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |

## Installation

Install SpatialJS Core and its peer dependencies:

```bash
npm install @spatialjs/core react @react-three/fiber three @react-three/uikit
```
## Quick Start

1. Add the WindowManager to your scene  
```tsx
import { WindowManager, createWindow } from "@spatialjs/core";
<WindowManager />
```

2. Add a Window to your scene  
```tsx
import { createWindow } from "@spatialjs/core";
const window = createWindow(<MusicPlayer />, {
  title: "My Window",
});
```

## Documentation

For detailed usage instructions and API reference, please refer to our [documentation](https://www.spatialjs.dev/).

## Examples

Check out our [examples directory](https://www.spatialjs.dev/examples) for more advanced usage scenarios and demos.

## Contributing

We welcome contributions! Please see our [contributing guidelines](link_to_contributing_guidelines) for more details.


## Support

For questions, bug reports, or feature requests, please open an issue on our [GitHub repository](https://github.com/Deamoner/spatialjs).

---

Built with ❤️ by [Deamoner](https://twitter.com/spatialmatty)