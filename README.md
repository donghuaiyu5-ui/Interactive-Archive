# My Yarn Room

My Yarn Room is a personal yarn archive inspired by early Flash games. I placed 15 yarn photographs around a room so visitors can explore the collection and rearrange the yarns as if they were organizing objects in their own home.

## Features

- Click a yarn to view its name, colors, and description.
- Drag yarns to rearrange them, or use the arrow keys when a yarn is focused.
- Search by name, color, or notes, and filter the collection by color.
- Upload your own yarn photographs with names, colors, and notes. Uploaded entries can also be deleted.
- Reset the room layout while keeping uploaded yarns.

Yarn details, uploaded images, and positions are saved in the current browser using IndexedDB and remain after refreshing the page. They do not sync across browsers or devices.

## Project Setup

This project is built with React and Vite. React's `useState` manages the yarn entries, positions, search terms, color filter, and dialog states. The interface updates automatically when these states change.

The initial collection is stored in `src/yarns.json`, and the default layout is defined in `src/roomLayout.js`. Reusable components are in `src/components/`, and shared styles are in `src/styles.css`.

To run the project locally, install Node.js 22.12 or later, or Node.js 24, then run:

```bash
npm install
npm run dev
```

To generate the website files for deployment:

```bash
npm run build
```

The project includes a GitHub Pages deployment workflow. In the repository's **Settings → Pages**, select **GitHub Actions** as the deployment source, then push the code to the `main` branch.

## Resources and AI Use

I used Codex to help develop React components and interactions, adjust the page layout, and organize the code. I provided the images, chose the room-based design direction, and gave feedback throughout the development process.
